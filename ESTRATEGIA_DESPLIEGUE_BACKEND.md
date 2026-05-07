# Estrategia de Despliegue: Backend Privado + Frontend Público

Este documento describe la arquitectura recomendada para mantener la seguridad de la propiedad intelectual de **Evangelista & Co.** mientras se permite un despliegue ágil del frontend.

## Arquitectura

1.  **Frontend (Repositorio Actual - Público/Compartido):**
    *   Contiene: `evangelista-dashboard/`
    *   Despliegue: GitHub Pages (vía GitHub Actions).
    *   Seguridad: No contiene lógica de negocio sensible ni llaves maestras.

2.  **Backend (Nuevo Repositorio - Privado):**
    *   Contiene: `evangelista-rag/`
    *   Despliegue: Railway, Render o Azure (desde el repo privado).
    *   Seguridad: Protege los agentes, prompts de IA y la lógica del motor RAG.

---

## Pasos para Implementar el Backend Privado

### 1. Crear el Repositorio en GitHub
1.  Ve a [GitHub - New Repository](https://github.com/new).
2.  Nombre sugerido: `evangelista-rag-private`.
3.  **IMPORTANTE:** Selecciona **"Private"**.

### 2. Inicializar y Subir el Código
Ejecuta estos comandos en tu terminal local desde la carpeta del backend:

```bash
# 1. Entrar a la carpeta del backend
cd "evangelista-rag"

# 2. Inicializar un nuevo repositorio Git local
git init

# 3. Agregar los archivos
git add .

# 4. Crear el commit inicial
git commit -m "feat: initial private backend commit"

# 5. Vincular con tu nuevo repo privado (Reemplaza <TU_USUARIO>)
git remote add origin https://github.com/<TU_USUARIO>/evangelista-rag-private.git

# 6. Subir el código
git branch -M main
git push -u origin main
```

### 3. Configurar el Despliegue (Railway)
Como tu prueba gratuita de Railway expiró:
1.  **Activa un plan:** Ve a Railway y selecciona el plan **Hobby** o **Pro**.
2.  **Conecta el Repo:** En el panel de Railway, selecciona "New Project" -> "GitHub Repo" y elige tu nuevo repositorio privado `evangelista-rag-private`.
3.  **Variables de Entorno:** Railway detectará automáticamente tu `railway.toml`. Asegúrate de copiar las variables de tu archivo `.env` local a la sección **Variables** de Railway.

---

## Conectando Frontend y Backend

Una vez que el backend esté desplegado en Railway y tengas una URL (ej: `https://evangelista-rag-production.up.railway.app`):

1.  Ve a tu repositorio de **Frontend** en GitHub.
2.  Ve a **Settings > Secrets and variables > Actions**.
3.  Actualiza el secret `VITE_API_URL` con tu nueva URL de Railway.
4.  El frontend se reconstruirá automáticamente y comenzará a usar el nuevo backend privado.

---

## Notas de Seguridad
*   **Nunca** elimines `evangelista-rag/` del archivo `.gitignore` del repositorio principal.
*   Mantén el repositorio del backend siempre como **Private**.
*   Las llaves de API (OpenAI, Groq, Supabase) solo deben vivir en las variables de entorno de Railway y nunca subirse al código.
