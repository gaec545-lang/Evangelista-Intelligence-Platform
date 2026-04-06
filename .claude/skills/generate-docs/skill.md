---
name: generate-docs
description: >
  Genera documentos .docx (propuestas, contratos, dictámenes) usando
  python-docx con los templates de Evangelista & Co. Los templates
  están en evangelista-rag/src/proposals/templates_docx/.
triggers:
  - genera el documento
  - crea la propuesta
  - genera el contrato
  - genera el dictamen
  - descarga el .docx
---

# Generate Docs — Documentos .docx EIP

## Templates disponibles

| Template | Archivo | Uso |
|---|---|---|
| propuesta_foundation | propuesta_foundation.docx | Propuesta comercial Foundation |
| propuesta_architecture | propuesta_architecture.docx | Propuesta implementación BI |
| contrato_foundation | contrato_foundation.docx | Contrato de servicios Foundation |
| contrato_architecture | contrato_architecture.docx | Contrato maestro Architecture |
| dictamen_forense | reporte_dictamen.docx | Dictamen con hallazgos |
| orden_servicio | orden_servicio.docx | Orden interna de trabajo |
| expediente_operativo | expediente_operativo.docx | Expediente del engagement |

## Patrón de generación
```python
from docx import Document

def generate(template_path, data):
    doc = Document(template_path)
    # Reemplazar placeholders [NOMBRE] con datos reales
    for paragraph in doc.paragraphs:
        for key, value in data.items():
            if key in paragraph.text:
                # Preservar formato del run original
                for run in paragraph.runs:
                    if key in run.text:
                        run.text = run.text.replace(key, str(value))
    # Repetir para tablas
    for table in doc.tables:
        for row in table.rows:
            for cell in row.cells:
                for paragraph in cell.paragraphs:
                    # mismo patrón
    return doc
```
