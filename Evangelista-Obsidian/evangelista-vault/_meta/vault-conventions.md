---
id: "EVK-META-002"
title: "Convenciones del Vault — Reglas de Escritura y Estructura"
type: meta
version: "1.0"
domain: []
sector: []
agent_access: [all]
confidence: high
source: evangelista
last_validated: 2026-03-28
parent: ""
related: ["tags-taxonomy", "changelog"]
depends_on: []
tags: []
status: active
last_ingested: null
chunk_count: null
---

# Convenciones del Vault — Reglas de Escritura y Estructura

## Propósito de Este Documento

Este vault es la base de conocimiento del pipeline RAG de Evangelista & Co. Las convenciones aquí descritas garantizan que los documentos sean:
1. **Recuperables**: El agente de IA puede encontrar el chunk correcto
2. **Autocontenidos**: Cada sección `##` tiene sentido por sí sola, sin contexto adicional
3. **Auditables**: El frontmatter YAML permite filtrar y rastrear cualquier documento
4. **Consistentes**: Todos los documentos siguen el mismo patrón de escritura

---

## Convenciones de Estructura

### Frontmatter YAML Obligatorio

Todos los archivos `.md` DEBEN comenzar con el bloque YAML completo. Ningún campo puede estar vacío — si no aplica, usar `[]` para listas o `""` para strings. El schema completo está en la instrucción de creación del vault.

### Jerarquía de Headers

```
# Título del documento (H1) — Solo uno por documento
## Sección principal (H2) — Puntos de corte de chunking
### Subsección (H3) — Detalle de una sección
#### Sub-subsección (H4) — Uso excepcional, máximo 1 nivel más
```

> [!IMPORTANT] Los headers `##` son los puntos de corte del chunking semántico.
> Cada sección `##` debe ser autocontenida: un agente que recibe solo ese chunk debe poder entenderlo y usarlo sin leer el resto del documento.

### Límite de Extensión

- **Máximo 2,500 palabras por documento**
- Si un tema requiere más, dividirlo en notas enlazadas
- El frontmatter no cuenta para el límite de palabras

---

## Convenciones de Contenido

### Datos con Unidades

Todos los datos cuantitativos **siempre** incluyen su unidad:

| Correcto | Incorrecto |
|---------|-----------|
| $486,000 MXN | $486,000 o 486,000 pesos |
| 213% | 213 |
| 90 días | 3 meses |
| 9-12 semanas | 2-3 meses |

### Callouts para Información Crítica

Usar la sintaxis de callouts de Obsidian para resaltar información crítica:

```markdown
> [!RULE] Nombre de la regla
> Descripción de la regla.

> [!CRITICAL] Advertencia crítica
> Algo que NUNCA debe hacerse.

> [!WARNING] Advertencia importante
> Algo que requiere precaución.

> [!NOTE] Nota informativa
> Información adicional útil.
```

### Wikilinks Obligatorios

Cuando se mencione un concepto que tiene su propio documento en el vault, **siempre** usar wikilink:

```
[[alcoa-protocol]]       ← Correcto
[[success-fee-calc]]     ← Correcto
"el protocolo ALCOA+"    ← Incorrecto (no vincula)
```

Los wikilinks deben apuntar a archivos que **existen** en el vault. No crear wikilinks a documentos que no existen aún.

---

## Convenciones de Nombrado de Archivos

- `kebab-case` sin acentos ni caracteres especiales
- Descriptivo y específico (no genérico)
- Sin prefijos de número (el orden lo da el frontmatter, no el nombre)

| Correcto | Incorrecto |
|---------|-----------|
| `foundation-pricing.md` | `pricing.md` o `01-pricing.md` |
| `caso-textiles-atoyac.md` | `caso1.md` o `Caso Textiles.md` |
| `dmaic-analyze.md` | `analyze.md` o `DMAIC_Analyze.md` |

---

## Convenciones del Frontmatter YAML

### IDs Únicos

El campo `id` sigue el formato `EVK-{TIPO}-{NUM}` donde:
- `EVK` = Evangelista Knowledge (prefijo fijo)
- `{TIPO}` = FWK (framework), FOR (formula), CASE (case), PLAY (playbook), RULE (rule), PROM (prompt), OBJ (objection), GLOS (glossary), MOC (moc), META (meta)
- `{NUM}` = Número secuencial de 3 dígitos dentro del tipo

### Tags

Solo usar tags de la taxonomía oficial en [[tags-taxonomy]]. Máximo 8 por documento.

### Campos `last_ingested` y `chunk_count`

Estos campos son administrados automáticamente por el pipeline RAG. **No editar manualmente**. Inicializarlos siempre como `null`.

---

## Proceso de Actualización de Documentos

1. Actualizar el contenido del documento
2. Incrementar `version` (1.0 → 1.1 para cambios menores, 1.x → 2.0 para cambios mayores)
3. Actualizar `last_validated` a la fecha actual
4. Registrar el cambio en [[changelog]]
5. Si el cambio afecta el chunking, resetear `last_ingested` a `null` y `chunk_count` a `null`
