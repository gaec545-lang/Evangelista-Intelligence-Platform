# 📊 RESEÑA TÉCNICA: MONTECARLO-EVANGELISTACO

> **Core Engine**: Simulación Prospectiva y Optimización Financiera con IA.
> **Enfoque**: Resiliencia financiera y toma de decisiones estratégicas.

---

## 🚀 1. El Pipeline: "El Escudo Financiero"

El sistema no es solo un simulador; es un **pipeline orquestado** de inteligencia empresarial dividido en 4 fases críticas de razonamiento y cálculo.

### 📡 Fase 0: Radar (Forecasting)
*   **Módulo**: `src/forecasting_engine.py`
*   **Función**: Predicción de variables macro y micro financieras (ingresos, costos, volatilidad).
*   **Ciencia de Datos**: Utiliza modelos de series temporales avanzados (**Prophet** y **ARCH**) para proyectar no solo el "escenario base", sino los intervalos de confianza que alimentan la simulación.

### 🚜 Fase 0b: La Trituradora (Stress Testing)
*   **Módulo**: `src/stress_testing_engine.py`
*   **Función**: Someter el modelo de negocio a condiciones extremas para identificar puntos de quiebre.
*   **Algoritmos**: 
    *   **Cópulas Gaussianas**: Para modelar dependencias no lineales entre variables de riesgo.
    *   **SimPy**: Simulación de eventos discretos para procesos operativos.
    *   **PyMC (Bayesian)**: Estimación de probabilidades de impago y crisis de liquidez.

### ♟️ Fase 0c: Estratega (Optimization)
*   **Módulo**: `src/optimization_engine.py`
*   **Función**: Optimización matemática de la estructura de capital y flujo de caja.
*   **Tecnología**: Implementación de **CVXPY** para resolver problemas de optimización convexa, equilibrando OPEX, pagos a proveedores y estrategias de factoring.

### 👁️ Fase 4: IA Sentinel (Decision Intelligence)
*   **Módulo**: `src/decision_intelligence_engine.py` / `src/decision_pipeline.py`
*   **Función**: La "Última Milla". Traduce los Gigabytes de simulaciones en narrativa de negocio accionable.
*   **IA**: Integración con **Groq (Llama 3)** para generar el *Executive Summary* y recomendaciones tácticas (por ejemplo: "Reducir inventario en un x% para evitar default técnico en el Q3").

---

## 🛠️ 2. Stack de Herramientas Core

El repositorio destaca por una selección quirúrgica de librerías de alto rendimiento:

### 🔬 Análisis & Simulación
*   **`numpy` & `pandas`**: La base de manipulación matricial y tabular.
*   **`darts` / `prophet` / `statsmodels`**: Arsenal para forecasting multivariado.
*   **`riskfolio-lib`**: Gestión profesional de riesgo de cartera.
*   **`pymc`**: Modelado probabilístico Bayesiano de alta fidelidad.

### ⚡ IA & Backend
*   **`groq`**: Inferencia de LLM de ultra-baja latencia para análisis en tiempo real.
*   **`SQLAlchemy`**: Capa de persistencia robusta para el historial de simulaciones.
*   **`httpx`**: Comunicación asíncrona con servicios externos.

### 📊 Visualización (The UI)
*   **`streamlit`**: Framework central de la interfaz de usuario.
*   **`plotly`**: Generación de "semáforos de riesgo" y gráficos de dispersión de Monte Carlo de alta interactividad.

---

## ⚙️ 3. Área de Administración (Gestión & Soporte)

El proyecto mantiene una frontera clara entre el **motor de cálculo** y el **control de acceso**, ubicada principalmente en el frontend y scripts de utilidad:

*   **Admin Panel (`app/pages/3_⚙️_Admin_Panel.py`)**: Interfaz dedicada para:
    *   Gestión de clientes y suscripciones (SaaS-Ready).
    *   Configuración dinámica de API Keys (enmascaradas).
    *   Auditoría de logs de ejecución del motor.
*   **Security Layer (`src/security.py` / `src/user_manager.py`)**:
    *   Manejo de credenciales con **Bcrypt**.
    *   Validación de roles y permisos para multi-tenancy.
*   **Setup Tools (`crear_admin.py`)**: Script raíz para la inicialización rápida del entorno administrativo y súper-usuarios.

---

## 📁 Estructura del Repositorio

```text
📂 montecarlo-evangelistaco
├── 📂 app/                     # UI & Dashboard (Streamlit)
│   ├── 📂 components/          # Widgets financieros custom
│   └── 📂 pages/               # Flujos Multi-step & Admin Panel
├── 📂 src/                     # Core Engines (Forecasting, Stress, Opt, IA)
│   ├── 📄 decision_pipeline.py  # Orquestador del flujo completo
│   └── 📄 database_connector.py # Capa de datos (Postgres/Supabase)
├── 📂 configs/                 # Configuración YAML (Thresholds de riesgo)
├── 📂 supabase/                # Estructura de DB y Migraciones
└── 📄 requirements.txt         # Blueprint de dependencias
```

---
*Reseña generada para Evangelista & Co — Inteligencia Prospectiva.*
