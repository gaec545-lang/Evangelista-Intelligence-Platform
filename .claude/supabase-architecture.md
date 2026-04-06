# Supabase — Arquitectura Completa

## 1. Visión General

El proyecto **Evangelista & Co** utiliza Supabase en dos capas independientes:

| Capa | Proyecto | Stack | Propósito |
|---|---|---|---|
| **Frontend Dashboard** | `zqyqtcteqtbkadkflaku.supabase.co` | `@supabase/supabase-js` | UI de gestión de clientes, análisis, propuestas y autenticación |
| **Backend RAG / Agents** | Mismo proyecto | `supabase-py` + `pgsodium` | Data Abstraction Vault — conexión zero-trust a ERPs de clientes |

La clave del proyecto es **`zqyqtcteqtbkadkflaku`** (región no confirmada, verificar en dashboard).

---

## 2. Frontend — `evangelista-dashboard`

### 2.1. Cliente Supabase (`src/lib/supabase.ts`)

Inicialización con `@supabase/supabase-js`:

```ts
const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Graceful degradation**: si las credenciales faltan, se instancia con valores placeholder. La app sigue funcionando — muestra un `LoginPage` y opera sin Supabase. La constante `SUPABASE_CONFIGURED` controla este comportamiento en todos los módulos.

### 2.2. Capa de Datos — Wrappers DB

#### `clientsDB` — CRUD completo sobre tabla `clients`

| Método | Operación | Descripción |
|---|---|---|
| `list()` | `SELECT * ORDER BY created_at DESC` | Todos los clientes |
| `get(id)` | `SELECT * WHERE id = ? SINGLE` | Un cliente por ID |
| `create(client)` | `INSERT ... RETURNING SINGLE` | Crear cliente |
| `update(id, updates)` | `UPDATE ... WHERE id = ? RETURNING SINGLE` | Actualizar parcialmente |
| `delete(id)` | `DELETE WHERE id = ?` | Eliminar cliente |

#### `analysesDB` — Registros de análisis/ejecuciones

| Método | Operación | Descripción |
|---|---|---|
| `list(clientId?)` | `SELECT *, client:clients(name) ORDER BY created_at DESC` | Todos o filtrados por cliente. Incluye join al nombre del cliente |
| `create(analysis)` | `INSERT ... RETURNING SINGLE` | Guardar resultado de análisis |

#### `proposalsDB` — Propuestas comerciales

| Método | Operación | Descripción |
|---|---|---|
| `list(clientId)` | `SELECT * WHERE client_id = ? ORDER BY created_at DESC` | Propuestas de un cliente |
| `create(proposal)` | `INSERT ... RETURNING SINGLE` | Crear propuesta |

### 2.3. Autenticación (`src/stores/authStore.ts`)

Gestión con **Zustand** + Supabase Auth:

- **`signIn(email, password)`** → `supabase.auth.signInWithPassword()`
- **`signOut()`** → `supabase.auth.signOut()` + reset del store
- **`initialize()`** → recarga sesión existente + suscribe `onAuthStateChange` para reactividad en tiempo real

Si `SUPABASE_CONFIGURED` es `false`, el store se inicializa sin usuario y sin error — la app funciona en modo offline/demostración.

### 2.4. Hooks React (`src/hooks/`)

#### `useClients()`

Abstracción sobre `clientsDB` con estado React:

- Carga automática al montar (`useEffect` + `useCallback`)
- `createClient`, `updateClient`, `deleteClient` — actualizan estado local optimísticamente tras la mutación
- `reload` — refuerza la carga desde el servidor

#### `useHistory(clientId?)`

Abstracción sobre `analysesDB`:

- `saveAnalysis` — guarda y prepends al estado local
- Filtro opcional por `clientId`
- Estado de `loading` / `error` manejado internamente

### 2.5. Componentes que consumen Supabase directamente

- **`AnalysisHistory.tsx`** — hace `.from('analyses').select('*').limit(50)` directo (no usa el hook). Muestra panel lateral con lista de análisis + panel de detalle con `final_response` renderizado en Markdown
- **`ClientDetailPage.tsx`**, **`ProposalPage.tsx`**, **`SettingsPage.tsx`** — consumen hooks o wrappers directamente

### 2.6. Variables de Entorno

| Variable | Valor | Uso |
|---|---|---|
| `VITE_SUPABASE_URL` | `https://zqyqtcteqtbkadkflaku.supabase.co` | URL del proyecto |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbG...7r4Rw` | Clave anónima (cliente-side, con RLS) |
| `VITE_API_URL` | `http://localhost:8000` | Backend FastAPI (comunicación separada) |

El archivo `.env` existe y contiene valores reales. `.env.example` está versionado como referencia.

### 2.7. Tipos de Datos (`src/lib/types.ts`)

#### `Client`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `string` (UUID) | |
| `name` | `string` | Nombre del cliente |
| `sector` | `string` | Industria |
| `contact_name` | `string?` | |
| `contact_email` | `string?` | |
| `contact_phone` | `string?` | |
| `city` | `string` | |
| `sucursales` | `number` | Número de sucursales |
| `sistemas_erp` | `number` | Cantidad de sistemas ERP |
| `erp_type` | `string?` | Tipo de ERP |
| `factor_gamma` | `number?` | Factor γ — metodología Evangelista |
| `factor_alpha` | `number?` | Factor α |
| `factor_beta` | `number?` | Factor β |
| `vetting_status` | `'pending' \| 'go' \| 'no_go'` | |
| `status` | `'prospect' \| 'active' \| 'completed' \| 'archived'` | |
| `notes` | `string?` | |
| `created_at` | `string` (ISO) | |
| `updated_at` | `string` (ISO) | |

#### `Analysis`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `string` (UUID) | |
| `client_id` | `string?` | FK a `clients` |
| `client` | `{ name: string }?` | Join de la tabla clients |
| `task` | `string` | Prompt/consulta original |
| `execution_plan` | `string?` | Plan de ejecución del enjambre |
| `final_response` | `string?` | Respuesta generada |
| `confidence` | `number?` | [0-1] precisión del análisis |
| `subtasks` | `SubtaskSummary[]?` | Resumen de agentes individuales |
| `sources_used` | `string[]?` | Fuentes consultadas |
| `errors` | `string[]?` | Errores si los hubo |
| `execution_time_ms` | `number?` | Latencia total |
| `status` | `'running' \| 'completed' \| 'failed'` | |
| `created_at` | `string` (ISO) | |

#### `Proposal`

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `string` (UUID) | |
| `client_id` | `string` | FK a `clients` |
| `type` | `'foundation' \| 'architecture'` | Tipo de propuesta |
| `content` | `string` | Contenido principal |
| `pricing` | `ProposalPricing?` | Estructura de precios |
| `status` | `'draft' \| 'sent' \| 'accepted' \| 'rejected'` | |
| `created_at` / `updated_at` | `string` (ISO) | |

#### `ProposalPricing`

| Campo | Tipo |
|---|---|
| `foundation_fee` | `number?` |
| `setup_fee` | `number?` |
| `success_fee` | `number?` |
| `gamma`, `alpha`, `beta` | `number?` |

---

## 3. Backend — `evangelista-rag`

### 3.1. Data Abstraction Vault (`src/tools/database_connector.py`)

Este módulo es el **corazón de la arquitectura zero-trust** del sistema. Su propósito es permitir que los agentes (LangGraph) consulten los ERPs de los clientes **sin que las credenciales jamás salgan de Supabase**.

#### Principios de Seguridad

1. **Contraseña nunca en texto plano** — se almacena cifrada con `pgsodium` en `vault.secrets`
2. **Service Role Key, no anon key** — el backend usa credenciales de servicio para acceso total
3. **Descifrado in-process** — la contraseña solo se descifra al momento de abrir la conexión
4. **Eliminación inmediata de memoria** — `del decrypted_password` tras crear la conexión
5. **Conexión read-only** — el ERP del cliente nunca puede ser modificado
6. **Protocolo PED** — el Financial Agent nunca ve las credenciales; solo el Data Engineer Agent accede al Vault

#### `get_supabase_client()`

Retorna un cliente `supabase-py` autenticado con `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`. Las credenciales se leen de `src/config.py` (`Settings` de pydantic-settings).

**Nota importante**: `config.py` NO tiene `SUPABASE_URL` ni `SUPABASE_SERVICE_ROLE_KEY` definidos explícitamente — se extraen con `getattr(settings, "SUPABASE_URL", "")`. Esto significa que deben estar como variables de entorno en el `.env` del backend (no versionado). Si no existen, lanza `RuntimeError`.

#### CRUD de Metadatos

| Función | RPC SQL | Descripción |
|---|---|---|
| `list_client_connections(client_id)` | — | `SELECT * FROM erp_connections WHERE client_id = ?` |
| `register_erp_connection(...)` | `create_erp_connection()` | Registra vía RPC — la contraseña viaja cifrada por TLS 1.3 y se almacena en vault |
| `remove_erp_connection(client_id)` | `revoke_erp_connection()` | Elimina conexión + secreto del vault |

#### `get_ephemeral_connection(client_id, connection_id?)` — Core

Flujo de 5 pasos:

1. **Consulta `erp_connections`** — obtiene `host`, `port`, `database_name`, `username`, `secret_id`, `connection_type`
2. **Recupera contraseña** — llama a `_get_secret_key(secret_id)` que lee `vault.decrypted_secrets`
3. **Abre conexión** — fábrica `_open_readonly_connection()` según tipo de ERP
4. **Retorna conexión abierta** — `psycopg2`, `mysql.connector`, o `pyodbc`
5. **Elimina contraseña de memoria** — `del decrypted_password` en bloque `finally`

El uso recomendado es como **context manager**:

```python
with get_ephemeral_connection("uuid-cliente") as conn:
    cursor = conn.cursor()
    cursor.execute("SELECT SUM(total) FROM facturas")
    results = cursor.fetchall()
```

#### Fábrica de Conexiones por ERP

| `db_type` | Driver | Configuración |
|---|---|---|
| `postgresql`, `postgres`, `pg`, `sap_hana` | `psycopg2` | `conn.set_session(readonly=True)` |
| `mysql`, `maria`, `asper` | `mysql.connector` | Sin modo readonly nativo (restrict a SELECT) |
| `sql_server`, `mssql` | `pyodbc` | `ApplicationIntent=ReadOnly` (SQL Server AlwaysOn) |

Los drivers se importan dinámicamente con `ImportError` handling — si no está instalado, sugiere el paquete pip correspondiente.

### 3.2. Migración SQL (`src/db/migrations/01_supabase_vault.sql`)

#### Extensión

```sql
CREATE EXTENSION IF NOT EXISTS supabase_vault WITH SCHEMA vault CASCADE;
```

Requiere `pgsodium` habilitado en el proyecto Supabase.

#### Tabla `erp_connections`

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | `UUID PK` | `gen_random_uuid()` |
| `client_id` | `UUID FK → clients(id)` | `ON DELETE CASCADE` |
| `connection_type` | `VARCHAR(50)` | `sap_hana`, `aspel`, `sql_server`, `postgresql`, `mysql` |
| `host` | `VARCHAR(255)` | |
| `port` | `INTEGER` | Default: `5432` |
| `database_name` | `VARCHAR(128)` | Nullable |
| `username` | `VARCHAR(128)` | |
| `secret_id` | `UUID` | Referencia a `vault.secrets` |
| `extra_config` | `JSONB` | Default: `{}` |
| `created_at` / `updated_at` | `TIMESTAMPTZ` | Default: `NOW()` |

Índice único: `idx_erp_conn_client` sobre `(client_id)` — una conexión por cliente.

#### Función `create_erp_connection()`

- `SECURITY DEFINER` — ejecuta con permisos de `supabase_admin`
- Guarda contraseña en `vault.store_secret()` (cifrado pgsodium automático)
- Inserta `erp_connections` con referencia al `secret_id`
- Retorna `conn_id` (UUID)

#### Función `revoke_erp_connection()`

- Obtiene `secret_id` antes de borrar
- Elimina `erp_connections`
- Elimina `vault.decrypted_secrets` donde `id = secret_id`

### 3.3. Configuración (`src/config.py`)

Pydantic-settings con carga desde `.env`. **No incluye** `SUPABASE_URL` ni `SUPABASE_SERVICE_ROLE_KEY` como campos declarados — se esperan como variables de entorno dinámicas (extraídas con `getattr`).

Configuraciones relevantes que SÍ están declaradas:

| Categoría | Campo | Default |
|---|---|---|
| Vault | `VAULT_PATH` | `../Evangelista-Obsidian/evangelista-vault` |
| Qdrant | `QDRANT_MODE` | `local` |
| Qdrant | `QDRANT_LOCAL_PATH` | `./qdrant_storage` |
| LLM | `LLM_PROVIDER` | `groq` |
| Groq | `GROQ_MODEL` | `llama-3.3-70b-versatile` |
| Ollama | `OLLAMA_MODEL` | `qwen2.5:32b` |
| Anthropic | `ANTHROPIC_MODEL` | `claude-sonnet-4-5-20251022` |
| Embeddings | `EMBED_PROVIDER` | `ollama` |
| Embeddings | `EMBED_MODEL` | `nomic-embed-text` |
| Embeddings | `EMBED_DIMENSIONS` | `768` |
| Chunking | `CHUNK_LENGTH` | `100–2000` |
| Retrieval | `TOP_K` / `FINAL_K` | `10` / `5` |

### 3.4. Módulo Tools (`src/tools/__init__.py`)

Expone dos herramientas para el enjambre LangGraph:

- `get_ephemeral_connection` — conexión efímera al ERP
- `sql_from_prompt` — generación de SQL (de `sql_generator.py`)

---

## 4. Esquema de Base de Datos — Estado Esperado

### Tablas requeridas en Supabase

| Tabla | Uso | Propiedad |
|---|---|---|
| `clients` | Gestión de clientes del dashboard | Frontend + Backend (FK) |
| `analyses` | Historial de ejecuciones del enjambre | Frontend (lectura/escritura) |
| `proposals` | Propuestas comerciales | Frontend |
| `erp_connections` | Metadatos de ERP (sin contraseñas) | Backend (RPC) |
| `auth.users` | Usuarios del dashboard | Supabase Auth (built-in) |

### Tabla `vault.secrets` (schema `vault`)

Gestionada por `pgsodium`. Creada automáticamente por la extensión `supabase_vault`. No se manipula directamente — solo via `vault.store_secret()` y eliminaciones directas.

---

## 5. Flujo de Datos Completo

### 5.1. Registro de un Cliente → Conexión ERP

```
1. Usuario crea cliente en Dashboard (frontend)
   → clientsDB.create() → Supabase table: clients

2. Usuario registra ERP del cliente (SettingsPage)
   → Backend: register_erp_connection()
   → RPC: create_erp_connection() en Supabase
   → Supabase:
     a) Guarda password en vault.store_secret()
     b) Inserta en erp_connections con referencia a secret_id
```

### 5.2. Ejecución de Análisis (Enjambre LangGraph)

```
1. Usuario envía consulta desde Dashboard
   → POST a api/v1/analyses (backend FastAPI)

2. Data Engineer Agent usa get_ephemeral_connection(client_id)
   → Recupera metadata de erp_connections (sin password)
   → Descifra password de vault.decrypted_secrets
   → Abre conexión read-only al ERP
   → Ejecuta queries SQL
   → Elimina password de memoria

3. Resultado se guarda en tabla analyses
   → analysesDB.create() → Supabase table: analyses
```

### 5.3. Consulta de Historial

```
1. Usuario abre Historial en Dashboard
   → analysesDB.list() / supabase.from('analyses').select()
   → Renderiza lista con confianza, fecha, task
   → Al seleccionar: muestra final_response en Markdown
```

### 5.4. Autenticación

```
1. Usuario abre Dashboard → authStore.initialize()
2. supabase.auth.getSession() verifica sesión activa
3. onAuthStateChange mantiene reactividad
4. Si no hay credenciales → app opera en modo offline
```

---

## 6. Dependencias

### Frontend (`evangelista-dashboard/package.json`)

```
@supabase/supabase-js  → cliente JavaScript
```

### Backend (`evangelista-rag`)

```
supabase-py            → cliente Python (service role)
psycopg2 / psycopg2-binary  → PostgreSQL / SAP HANA
mysql-connector-python      → MySQL / Aspel
pyodbc                      → SQL Server
```

---

## 7. Observaciones y Puntos de Atención

1. **`config.py` del backend no declara `SUPABASE_URL` ni `SUPABASE_SERVICE_ROLE_KEY`** — se leen dinámicamente con `getattr()`. Si se olvidan en el `.env`, el error solo aparece en runtime como `RuntimeError`. Conviene agregarlos como campos explícitos en `Settings`.

2. **`_get_secret_key()` usa `.table("vault").select()`** — supabase-py intenta acceder a una tabla llamada `vault`. En Supabase, los secretos están en el schema `vault`, no como tabla pública. Esta implementación puede fallar dependiendo de permisos y configuración RLS. La forma más segura sería usar `sb.rpc()` o una query directa a `vault.decrypted_secrets`.

3. **RLS (Row Level Security)** — no hay evidencia de políticas RLS definidas para `clients`, `analyses`, `proposals` o `erp_connections`. Con la `anon` key expuesta en el frontend, es crítico que existan políticas que restrinjan quién puede leer/escribir qué.

4. **`erp_connections` tiene índice único por `client_id`** — esto implica que solo se permite **una** conexión ERP por cliente. Si un cliente tiene múltiples sistemas ERP, el modelo no lo soporta sin modificar la restricción.

5. **Credenciales expuestas en `.env` versionado** — `.env` está en `.gitignore` por defecto, pero `git status` muestra archivos `?? evangelista-rag/src/db/` como no rastreados, lo cual es correcto.

6. **La migración SQL debe aplicarse manualmente** — hay que correrla en Supabase Dashboard > SQL Editor. No hay evidencia de CLI de Supabase aplicado automáticamente.
