from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel

router = APIRouter()

class DocumentRequest(BaseModel):
    template: str
    data: dict

@router.post("/documents/generate")
async def generate_document_endpoint(req: DocumentRequest):
    """Genera un .docx desde template con datos del engagement."""
    from ...proposals.docx_generator import generate_document
    
    try:
        path = generate_document(req.template, req.data)
        return FileResponse(
            path=str(path),
            media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            filename=path.name,
            headers={"Content-Disposition": f'attachment; filename="{path.name}"'}
        )
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/documents/templates")
async def list_templates():
    """Lista los templates disponibles."""
    from ...proposals.docx_generator import TEMPLATE_MAP
    return {"templates": list(TEMPLATE_MAP.keys())}
