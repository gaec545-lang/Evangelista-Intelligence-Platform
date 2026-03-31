---
id: objection-data-privacy
title: "Objeción: Nos Preocupa Compartir Datos Sensibles"
type: objection_handler
agent_access: [financial, process, data_engineer]
tags: [objeciones, ventas, privacidad, datos, seguridad, lfpdppp, nda]
sector: [todos]
dominios: [ventas, compliance, datos]
version: "1.0"
author: evangelista
---

# Objeción: "Nos Preocupa Compartir Datos Sensibles"

## Variantes de esta objeción

1. "Nuestros datos son confidenciales — no podemos compartirlos con terceros"
2. "¿Cómo sabemos que la información no va a salir de la empresa?"
3. "Tenemos datos de clientes y proveedores que no podemos exponer"
4. "El área legal nos dijo que no compartamos accesos a sistemas"
5. "¿Qué pasa con la Ley Federal de Protección de Datos?"

## Por qué aparece esta objeción

Es una objeción legítima y bien fundamentada. A diferencia de "no hay presupuesto" o "necesito consultarlo", la preocupación por privacidad de datos es real, específica y merece una respuesta estructurada y detallada — no solo palabras de confianza.

Responder bien esta objeción construye credibilidad. Responderla mal (con generalidades) la agrava.

## Las cuatro capas de protección que ofrece Evangelista

### Capa 1: NDA antes de revelar metodología (Regla G-04)

Antes de que Evangelista comparta su metodología detallada, precios completos o plantillas propietarias, se firma un **Acuerdo de No Divulgación Recíproco**. Esto establece el tono correcto: la confidencialidad va en ambas direcciones.

El NDA incluye:
- Definición de información confidencial (datos del cliente + metodología Evangelista)
- Plazo de confidencialidad: 3 años post-proyecto
- Prohibición de uso de datos para cualquier fin ajeno al proyecto
- Penalidades específicas por incumplimiento (cláusula penal convencional en $MXN)

### Capa 2: Acceso de Solo Lectura absoluto (Regla G-02)

Evangelista opera bajo el principio de **Read-Only absoluto** en todos los sistemas del cliente:

- Acceso de consulta a base de datos — nunca acceso de escritura
- Sin credenciales de administrador — solo usuario con permisos de SELECT/VIEW
- Sin exportación masiva a sistemas externos — análisis en entorno del cliente cuando sea posible
- Sin acceso a correo corporativo, RRHH o sistemas de nómina salvo que sea explícitamente requerido y aprobado por el cliente

### Capa 3: Snapshot MD5 — evidencia de que nada se modifica

Al inicio de cada sesión de acceso a datos, Evangelista genera un **hash MD5 del esquema de base de datos y tablas críticas**. Este hash se documenta en la bitácora de proyecto y se entrega al cliente.

¿Para qué sirve? Si el cliente tiene dudas sobre si algo fue modificado durante el proyecto, puede comparar el hash Día Cero con el hash al final. Si los hashes coinciden (y siempre deben coincidir), la integridad de los datos está matemáticamente verificada.

Este mecanismo también protege a Evangelista de acusaciones falsas post-proyecto.

### Capa 4: Ley Federal de Protección de Datos Personales en Posesión de Particulares (LFPDPPP)

Evangelista opera en cumplimiento de la LFPDPPP (DOF 05-Jul-2010) y sus reglamentos:

- **Aviso de Privacidad** disponible y actualizado
- Los datos personales de empleados o clientes del cliente se tratan como datos de terceros — se anonomizan o se trabaja con IDs internos, no con nombres
- Si el proyecto requiere análisis de datos personales, se firma un **Convenio de Tratamiento de Datos** específico que cumple con los artículos 36-40 de la LFPDPPP (tratamiento por parte de un tercero)
- Destrucción certificada de cualquier extracción de datos 90 días post-entrega del proyecto

## Manejo de sectores con regulación adicional

**Sector financiero / SOFOM / aseguradoras**: CNBV y CNSF tienen lineamientos específicos sobre outsourcing de datos. Evangelista trabaja con un resumen de datos agregados y no accede a información de crédito individual.

**Sector salud**: NOM-024-SSA3-2010 sobre registros electrónicos de salud. Evangelista no accede a expedientes clínicos — solo a datos administrativos y financieros.

**Empresas con transacciones en USD o con socios internacionales**: GDPR puede aplicar si hay datos de ciudadanos europeos. En ese caso, se añade una capa de acuerdo de procesamiento de datos alineado con GDPR Art. 28.

Ver también [[nom-standards]] para regulación sectorial mexicana aplicable.

## Respuesta de cierre para esta objeción

> "Entiendo completamente la preocupación. Por eso establecimos estas cuatro capas de protección desde el primer día. Antes de que usted nos muestre un solo dato, nosotros firmamos el NDA. Nuestro acceso es de solo lectura — matemáticamente no podemos modificar nada. Y al final del proyecto, cualquier extracción que hayamos hecho se destruye de forma certificada. ¿Le gustaría que le enviara el template del NDA para que su área legal lo revise esta semana?"

## Wikilinks relacionados

- [[evangelista-rules]] — Reglas G-02 (Read-Only) y G-04 (NDA previo)
- [[nom-standards]] — Regulación mexicana sectorial relevante
- [[cfdi-40-implications]] — Datos fiscales que sí se pueden analizar sin exposición de datos personales
- [[coso-control-activities]] — Marco de control que documenta accesos y permisos
