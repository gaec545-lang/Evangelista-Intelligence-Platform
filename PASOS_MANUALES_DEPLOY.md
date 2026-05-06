# Pasos Manuales para Finalizar el Deploy

Este proyecto ya ha sido limpiado de secretos, blindado legalmente y subido a GitHub. Para activar la página web en tu dominio de Cloudflare, debes seguir estos últimos 3 pasos manuales.

---

## 1. Agregar GitHub Actions Secrets
GitHub necesita tus credenciales de Supabase para poder construir (build) la aplicación, pero estas no están en el código por seguridad.

Ve a: [Repository Settings → Secrets and variables → Actions](https://github.com/gaec545-lang/Evangelista-Intelligence-Platform/settings/secrets/actions)

Haz clic en **"New repository secret"** y agrega estos 3:

| Nombre del Secret | Valor |
|:--- |:--- |
| `VITE_SUPABASE_URL` | `https://zqyqtcteqtbkadkflaku.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `TU_ANON_KEY_DE_SUPABASE` (Cópiala de tu archivo `.env` local) |
| `VITE_API_URL` | `https://evangelistaco.com/api` (O la URL de tu backend si ya está en la nube) |

---

## 2. Activar GitHub Pages via Actions
Configura el repositorio para que use el flujo de trabajo automático que ya creé.

Ve a: [Repository Settings → Pages](https://github.com/gaec545-lang/Evangelista-Intelligence-Platform/settings/pages)

1. **Build and deployment > Source**: Cambia "Deploy from a branch" por **"GitHub Actions"**.
2. **Custom domain**: Escribe `evangelistaco.com` y haz clic en Save.
3. **Enforce HTTPS**: Una vez que el dominio se verifique, asegúrate de que esta opción esté marcada.

---

## 3. Configurar DNS en Cloudflare
Para que el mundo sepa que `evangelistaco.com` apunta a GitHub, debes actualizar tus registros DNS.

Entra a tu panel de **Cloudflare** para el dominio `evangelistaco.com` y agrega/edita estos registros:

| Tipo | Nombre | Contenido | Proxy |
|:--- |:--- |:--- |:--- |
| `CNAME` | `@` (raíz) | `gaec545-lang.github.io` | 🟠 Proxied |
| `CNAME` | `www` | `gaec545-lang.github.io` | 🟠 Proxied |

> **Nota de Seguridad:** Al usar el Proxy de Cloudflare (nube naranja), proteges la IP de origen y aprovechas el SSL de Cloudflare.

---

## ¿Cómo verificar que todo funciona?
1. Una vez agregues los Secrets, haz un pequeño cambio en el código (o usa el botón "Re-run jobs" en la pestaña **Actions** de GitHub).
2. Verás un proceso llamado "Deploy Evangelista Dashboard". Cuando termine en verde, la página estará al aire.
3. Entra a [https://evangelistaco.com](https://evangelistaco.com) y confirma que carga el login.
