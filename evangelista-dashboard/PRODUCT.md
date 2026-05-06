# PRODUCT.md — Evangelista Intelligence Platform

## Register
product

## Product Purpose
Una plataforma de inteligencia estratégica para consultoras de gestión de élite.
Centraliza el conocimiento institucional, acceso a modelos LLM y capacidades de análisis
cuantitativo (Montecarlo, RAG, análisis de datos) en una sola interfaz de uso interno.

## Users
- **Consultores Senior**: usan el dashboard para buscar conocimiento del vault, 
  ejecutar análisis y generar propuestas de valor para clientes corporativos.
- **Socios de Evangelista & Co**: revisan reportes, métricas del negocio y el 
  estado del pipeline de proyectos.
- **Operaciones Internas**: cargan documentos, mantienen el vault de conocimiento 
  y administran la plataforma.

## Brand Positioning
Firma consultora de élite con enfoque en estrategia, finanzas corporativas y 
transformación digital. El diseño debe proyectar autoridad, precisión y sofisticación.
Es equivalente al nivel visual de McKinsey, BCG o Goldman Sachs —  no a una startup SaaS.

## Tone
- **Preciso**: números exactos, lenguaje técnico cuando aplica, sin ambigüedades.
- **Autorizado**: el AI habla como un consultor senior de New York, no como un asistente genérico.
- **Conciso**: cada palabra gana su lugar. Sin intros que repitan el título.
- **Institucional pero accesible**: mantiene el rigor sin ser frío.

## Anti-References (Qué evitar)
- Diseño tipo startup de Silicon Valley (gradientes purple-to-blue, card grids idénticos)
- Paletas de colores brillantes o "energéticas"
- Animaciones bounce o elastic
- Glassmorphism decorativo como defecto
- Hero-metric template (número grande + label pequeño + gradient accent) — es cliché de SaaS
- Inter como única tipografía (demasiado genérico)
- Texto gris sobre fondo de color

## Strategic Principles
1. **Elegancia funcional**: cada elemento de UI tiene una función. Decoración sin propósito es ruido.
2. **Jerarquía visual clara**: el ojo del usuario llega al insight correcto en ≤3 segundos.
3. **Dark mode como default**: los consultores trabajan en entornos controlados de oficina;
   el dark mode proyecta profesionalismo y reduce fatiga en sesiones largas.
4. **Densidad informativa**: no esconder la complejidad. Los usuarios son expertos; 
   pueden procesar más información que una app de consumo.
5. **Velocidad percibida**: micro-animaciones que indican progreso, no decoración.

## Technical Context
- **Stack**: React + TypeScript + Vite, backend FastAPI + Python, Qdrant vector DB
- **Theme system**: CSS custom properties (design tokens) + Tailwind utility classes
- **Color palette extraída**: ver DESIGN.md adjunto (20 colores, 101 componentes, 11 animaciones)
- **Base spacing**: 4px grid

## Color Strategy
**Restrained** para vistas de producto (dashboard, knowledge, análisis).
**Committed** para superficies de marca (landing page, propuestas para clientes).
