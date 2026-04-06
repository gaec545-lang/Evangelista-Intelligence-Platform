"""Foundation scoping auto-detection — upload CSV/Excel or analyze via ERP connection."""
import os
import tempfile
from pathlib import Path
from uuid import UUID

import pandas as pd
import structlog
from fastapi import APIRouter, File, HTTPException, UploadFile, Form
from fastapi.responses import JSONResponse
from supabase import create_client

from src.analysis.data_profiler import profile_csv, profile_dataframe
from src.config import settings

logger = structlog.get_logger(__name__)

router = APIRouter(prefix="/api/v1/foundation", tags=["Foundation Analysis"])


def _get_supabase():
    url = getattr(settings, "SUPABASE_URL", os.environ.get("SUPABASE_URL", ""))
    key = getattr(settings, "SUPABASE_SERVICE_ROLE_KEY", os.environ.get("SUPABASE_SERVICE_ROLE_KEY", ""))
    if not url or not key:
        raise RuntimeError("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required")
    return create_client(url, key)


async def _save_ingestion(sb, engagement_id: str, source_type: str, filename: str, result: dict):
    """Record the ingestion event in data_ingestions table."""
    try:
        sb.table("data_ingestions").insert({
            "engagement_id": engagement_id,
            "source_type": source_type,
            "raw_filename": filename,
            "row_count": result.get("row_count"),
            "column_count": result.get("column_count"),
            "detected_params": {
                "registros_estimados": result.get("registros_estimados"),
                "fuentes_datos": result.get("fuentes_datos"),
                "nodo_critico": result.get("nodo_critico"),
                "sucursales": result.get("sucursales"),
                "erp_type": result.get("erp_type"),
                "confidence_scores": result.get("confidence_scores", {}),
            },
        }).execute()
    except Exception as e:
        logger.warning("failed_to_save_ingestion", error=str(e))


@router.post("/{client_id}/analyze-upload")
async def analyze_upload(client_id: str, file: UploadFile = File(...), engagement_id: str = Form(None)):
    """Upload a CSV or Excel file and auto-detect Foundation scoping parameters.

    Returns detected values with confidence scores — no LLM involved.
    """
    allowed = {".csv", ".xlsx", ".xls", ".tsv"}
    ext = Path(file.filename or "").suffix.lower()
    if ext not in allowed:
        raise HTTPException(400, f"Formato no soportado: {ext}. Use CSV, TSV o Excel.")

    try:
        # Save to temp file for profiling
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name

        try:
            result = profile_csv(tmp_path)
        finally:
            os.unlink(tmp_path)

        if engagement_id:
            sb = _get_supabase()
            await _save_ingestion(sb, engagement_id, ext.lstrip("."), file.filename, result)

        logger.info("file_analyzed", client_id=client_id, filename=file.filename, rows=result["row_count"])
        return JSONResponse(content=result)

    except Exception as e:
        logger.error("analyze_upload_failed", client_id=client_id, error=str(e))
        raise HTTPException(500, f"Error analizando archivo: {str(e)}")


@router.post("/{client_id}/analyze-erp")
async def analyze_erp(client_id: str, connection_id: str | None = None, engagement_id: str = Form(None)):
    """Profile the client's ERP database via existing ERP connection.

    Uses the encrypted DB connection to inspect table structure and row counts.
    """
    try:
        from src.tools.database_connector import get_ephemeral_connection

        conn = get_ephemeral_connection(client_id, connection_id)

        try:
            import psycopg2
            cursor = conn.cursor()

            # Get table list and row counts
            cursor.execute("""
                SELECT table_schema, table_name,
                       (xpath('/row/cnt/text()', xml_count))[1]::text::int as row_count
                FROM (
                    SELECT table_schema, table_name,
                           query_to_xml(format('select count(*) as cnt from %I.%I', table_schema, table_name),
                                        false, true, '') as xml_count
                    FROM information_schema.tables
                    WHERE table_schema NOT IN ('pg_catalog', 'information_schema', 'vault', 'storage', 'graphql', 'cron')
                    ORDER BY table_schema, table_name
                ) t
                LIMIT 200
            """)
            tables = cursor.fetchall()

            if not tables:
                # Fallback: simpler count query
                cursor.execute("""
                    SELECT schemaname, relname, n_live_tup
                    FROM pg_stat_user_tables
                    WHERE schemaname NOT IN ('pg_catalog', 'information_schema', 'vault')
                    ORDER BY n_live_tup DESC
                    LIMIT 200
                """)
                tables = cursor.fetchall()

            total_rows = sum(t[2] for t in tables if t[2])
            table_count = len(tables)

            # Sample first large table for column analysis
            largest_table = max(tables, key=lambda t: t[2] or 0)
            schema_name, table_name = largest_table[0], largest_table[1]

            cursor.execute(f"""
                SELECT column_name, data_type
                FROM information_schema.columns
                WHERE table_schema = '{schema_name}' AND table_name = '{table_name}'
                ORDER BY ordinal_position
                LIMIT 100
            """)
            columns = cursor.fetchall()

            col_names = [c[0] for c in columns]

            # Build a minimal dataframe for detection
            df = pd.DataFrame(columns=col_names)
            profile = profile_dataframe(df, f"erp://{schema_name}.{table_name}")

            profile["row_count"] = total_rows
            profile["registros_estimados"] = total_rows
            profile["fuentes_datos"] = max(profile["fuentes_datos"], table_count)
            profile["column_count"] = len(columns)
            profile["table_count"] = table_count
            profile["largest_table"] = f"{schema_name}.{table_name}"

            if engagement_id:
                sb = _get_supabase()
                await _save_ingestion(sb, engagement_id, "erp", f"{schema_name}.{table_name}", profile)

            logger.info("erp_analyzed", client_id=client_id, tables=table_count, total_rows=total_rows)
            return JSONResponse(content=profile)

        finally:
            conn.close()

    except ImportError:
        raise HTTPException(500, "psycopg2 no instalado. pip install psycopg2-binary")
    except KeyError as e:
        raise HTTPException(404, f"Conexion ERP no encontrada: {e}")
    except Exception as e:
        logger.error("erp_analysis_failed", client_id=client_id, error=str(e))
        raise HTTPException(500, f"Error analizando ERP: {str(e)}")
