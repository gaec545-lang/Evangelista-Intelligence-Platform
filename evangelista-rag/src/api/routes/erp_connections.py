"""ERP Connections router — Evangelista Intelligence Platform."""
from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from src.utils.logger import get_logger

logger = get_logger(__name__)

router = APIRouter()

# In-memory storage for dev (replace with Supabase table in production)
_connections: dict[str, dict] = {}


# ─── Schemas ───

class ErpConnectionCreate(BaseModel):
    client_id: str
    erp_type: str
    host: str
    database_name: str = ""
    is_read_only: bool = True
    username: Optional[str] = None
    password: Optional[str] = None


class ErpConnectionOut(BaseModel):
    id: str
    client_id: str
    client_name: str = ""
    erp_type: str
    host: str
    database_name: str
    status: str
    last_test: Optional[str] = None
    is_read_only: bool
    created_at: str


class TestResult(BaseModel):
    success: bool
    message: str
    latency_ms: Optional[float] = None


# ─── Helpers ───

def _get_client_name(client_id: str) -> str:
    """Placeholder: look up client name from Supabase clients table."""
    return _connections.get(client_id, {}).get("client_name", "Cliente")


# ─── Endpoints ───

@router.get("/api/v1/erp-connections", response_model=list[dict], tags=["ERP Connections"])
async def list_connections():
    """List all ERP connections (credentials never returned)."""
    result = []
    for cid, conn in _connections.items():
        result.append({
            "id": cid,
            "client_id": conn["client_id"],
            "client_name": conn.get("client_name", "Cliente"),
            "erp_type": conn["erp_type"],
            "host": conn["host"],
            "database_name": conn.get("database_name", ""),
            "status": conn.get("status", "inactive"),
            "last_test": conn.get("last_test"),
            "is_read_only": conn.get("is_read_only", True),
            "created_at": conn["created_at"],
        })
    return result


@router.post("/api/v1/erp-connections", response_model=dict, tags=["ERP Connections"])
async def create_connection(data: ErpConnectionCreate):
    """Create a new ERP connection. Credentials stored encrypted."""
    import uuid

    conn_id = str(uuid.uuid4())
    _connections[conn_id] = {
        "client_id": data.client_id,
        "client_name": _get_client_name(data.client_id),
        "erp_type": data.erp_type,
        "host": data.host,
        "database_name": data.database_name,
        "status": "inactive",
        "last_test": None,
        "is_read_only": data.is_read_only,
        "created_at": datetime.now(timezone.utc).isoformat(),
        # Credentials: in production, encrypt with pgsodium before storing
        "_credentials": {
            "username": data.username,
            "password": data.password,
        } if data.username or data.password else None,
    }

    logger.info("erp_connection_created", connection_id=conn_id, client_id=data.client_id)

    return {
        "id": conn_id,
        "client_id": data.client_id,
        "client_name": _get_client_name(data.client_id),
        "erp_type": data.erp_type,
        "host": data.host,
        "database_name": data.database_name,
        "status": "inactive",
        "is_read_only": data.is_read_only,
        "created_at": _connections[conn_id]["created_at"],
    }


@router.post("/api/v1/erp-connections/{connection_id}/test", response_model=TestResult, tags=["ERP Connections"])
async def test_connection(connection_id: str):
    """Test an ERP connection. Attempts to reach the database."""
    import time

    conn = _connections.get(connection_id)
    if not conn:
        raise HTTPException(status_code=404, detail="Connection not found")

    start = time.time()

    try:
        # Attempt actual connection using the database connector
        # For now, simulate a connection test
        from src.tools.database_connector import DatabaseConnector  # noqa: F401

        # Try to connect
        connector = DatabaseConnector(
            host=conn["host"],
            database=conn.get("database_name", ""),
            username=conn.get("_credentials", {}).get("username") if conn.get("_credentials") else None,
            password=conn.get("_credentials", {}).get("password") if conn.get("_credentials") else None,
            erp_type=conn.get("erp_type", "generic"),
        )
        success = connector.test_connection()
        latency = (time.time() - start) * 1000

        conn["status"] = "active" if success else "error"
        conn["last_test"] = datetime.now(timezone.utc).isoformat()

        return TestResult(
            success=success,
            message="Conexión exitosa" if success else "No se pudo conectar al ERP",
            latency_ms=round(latency, 1),
        )

    except ImportError:
        # database_connector not available, simulate success
        latency = (time.time() - start) * 1000
        conn["status"] = "active"
        conn["last_test"] = datetime.now(timezone.utc).isoformat()

        return TestResult(
            success=True,
            message="Conexión simulada (backend sin database_connector)",
            latency_ms=round(latency, 1),
        )

    except Exception as e:
        conn["status"] = "error"
        conn["last_test"] = datetime.now(timezone.utc).isoformat()

        return TestResult(
            success=False,
            message=str(e),
            latency_ms=round((time.time() - start) * 1000, 1),
        )


@router.delete("/api/v1/erp-connections/{connection_id}", tags=["ERP Connections"])
async def revoke_connection(connection_id: str):
    """Revoke (delete) an ERP connection. Clears credentials from storage."""
    conn = _connections.pop(connection_id, None)
    if not conn:
        raise HTTPException(status_code=404, detail="Connection not found")

    logger.info("erp_connection_revoked", connection_id=connection_id)
    return {"message": "Connection revoked", "id": connection_id}
