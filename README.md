# Friopacking · Tablero Ejecutivo de Planes Estratégicos

Aplicación web corporativa **premium, responsive y lista para demostración
ejecutiva** que presenta, gestiona, controla y comunica los **tres planes
estratégicos de 90 días** del grupo Friopacking (FRIOPACKING · FRIOTEAM ·
SMARTCOLD · HERMETICA):

1. **Supply Chain Control Tower** — torre de control logística end-to-end.
2. **Sales & Operations Planning (S&OP)** — planificación integrada de demanda y suministro.
3. **Centro de Inteligencia Operacional** — datos únicos para decisiones en tiempo real.

Los tres planes se conservan **completos e independientes**: cada uno mantiene su
objetivo, alcance, fases, flujo operativo, KPIs cuantitativos, evaluación
cualitativa, registro de desviaciones, control de desviaciones (causa raíz) y
plan de acción, con infografía, reporte y envío por WhatsApp funcionales.

---

## ✨ Funcionalidades

- **Executive Overview**: avance global, hitos, desviaciones críticas, acciones
  vencidas, riesgos, próximas decisiones de Gerencia, actividad reciente y KPIs
  corporativos reales de importaciones.
- **Módulo de planes**: 3 tarjetas premium con botones funcionales
  (Ver · Infografía · Reporte · WhatsApp).
- **Detalle de cada plan** con 8 secciones: Resumen · Fases y cronograma
  (timeline + Gantt) · Flujo operativo interactivo · KPIs cuantitativos ·
  Evaluación cualitativa (escala 1–5) · Desviaciones · Control de desviaciones
  (5 Porqués / Ishikawa, ciclo Detectar→…→Estandarizar) · Plan de acción
  (Tabla / Kanban / Timeline / Calendario / Resumen).
- **Infografías** por plan en **vertical (1080×1920, WhatsApp)** y
  **horizontal (1920×1080, presentación)**, con descarga **PNG / SVG**,
  impresión/PDF y compartir.
- **Reportes** ejecutivos en PDF (vía impresión): completo, breve (1 página) y
  **consolidado de los 3 planes**.
- **WhatsApp** en dos niveles: Nivel 1 (Web Share API + enlace oficial `wa.me`,
  activo sin backend) y Nivel 2 (WhatsApp Business Cloud API vía función
  serverless segura).
- **Roles y permisos** (6 perfiles, RBAC simulado) y **bitácora** de cambios.
- **100% responsive** (escritorio · tablet · móvil) y buenas prácticas de
  accesibilidad (roles ARIA, foco visible, contraste, navegación por teclado).

---

## 🧱 Stack y decisión técnica

> **Nota importante.** El brief recomendaba Next.js/React/TypeScript/Tailwind.
> El entorno de construcción de este proyecto **bloquea el registro npm y las
> CDNs (HTTP 403)**, por lo que **no es posible instalar dependencias ni
> compilar** un proyecto Next.js localmente. Se optó por una **SPA estática de
> cero dependencias** (HTML + CSS + JavaScript con ES Modules nativos), que
> además es la opción **más robusta para Vercel**: sin paso de build, sin riesgo
> de cold-build y despliegue inmediato. La arquitectura se mantiene **modular**
> (datos / dominio / servicios / vistas separados), con **tipos vía JSDoc** y una
> **capa serverless** para WhatsApp; todo es migrable a Next.js en una fase
> posterior.

- **Frontend**: JavaScript ES Modules, CSS con **design tokens** centralizados,
  gráficos **SVG hechos a medida** (donut, barras, líneas, anillos), sin librerías.
- **Backend**: función serverless de Vercel (`/api/whatsapp.js`) con **Node
  nativo** (sin dependencias).
- **Persistencia**: datos estructurados locales (`src/data/*`) + `localStorage`
  para el rol activo. Capa desacoplada, lista para Supabase/PostgreSQL.

---

## 🚀 Instalación y ejecución local

Requisitos: **Node.js ≥ 18** (solo para el servidor de desarrollo y las pruebas;
la app no requiere instalación de paquetes).

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd COMERCIO-EXTERIOR-GFP

# 2. Levantar el servidor de desarrollo (sin npm install)
npm run dev        # → http://localhost:3000

# 3. Ejecutar las pruebas de humo
npm test

# 4. (Opcional) Generar un HTML autocontenido de un solo archivo
npm run bundle     # → dist/friopacking-app.html (para revisión/artifact)
```

> No hay `npm install`: el proyecto no tiene dependencias de producción.

---

## ☁️ Despliegue en Vercel

El proyecto es **estático + funciones serverless** — Vercel lo detecta sin
configuración:

1. Importa el repositorio en [vercel.com](https://vercel.com/new).
2. **Framework Preset**: *Other* · **Build Command**: *(vacío)* ·
   **Output Directory**: *(raíz)*.
3. *(Opcional, Nivel 2 WhatsApp)* configura las variables de entorno en
   **Project Settings → Environment Variables** (ver `.env.example`).
4. Deploy. La app queda disponible; `/api/whatsapp` se publica como función.

También puede desplegarse con la CLI: `vercel --prod`.

---

## 🗂️ Estructura del proyecto

```
├── index.html                 # Shell de la SPA
├── vercel.json                # Config estática + headers de seguridad
├── .env.example               # Variables (WhatsApp Cloud API, futuras integraciones)
├── api/
│   └── whatsapp.js            # Serverless (Nivel 2) — Node nativo
├── public/
│   └── favicon.svg
├── scripts/
│   ├── serve.mjs              # Servidor estático de desarrollo
│   └── test.mjs               # Pruebas de humo (Node nativo)
└── src/
    ├── app.js                 # Bootstrap: shell + router + acciones
    ├── styles/                # tokens.css · base.css · components.css
    ├── data/                  # plans.js · realtrade.js · meta.js · types.js
    ├── lib/                   # dom · icons · charts · router · store · ui
    │                          # export · whatsapp · infographic · report · actions
    └── views/                 # overview · plans · plan-detail · reports · activity · roles
```

---

## 📊 Origen de los datos y trazabilidad

- **Fuente primaria (planes)**: `Plan_Estrategico_Friopacking_90_dias_Actualizado.docx`
  (objetivo, características, recursos, fases, flujo, KPIs y el *Complemento
  Ejecutivo* con las partes cuantitativa, cualitativa, desviación, control y plan
  de acción de cada plan).
- **Datos reales de comercio exterior**: `importaciones_master.xlsx`
  (importaciones por año/país/modalidad, 2026 por empresa, top proveedores).
  Alimentan los KPIs corporativos del Overview y del Control Tower.
- **Datos operativos no presentes en los documentos** se marcan claramente como
  **“Datos de ejemplo / Pendiente de validación”** (etiqueta `ej.`) y son fáciles
  de reemplazar en `src/data/plans.js`.

---

## 🧪 Testing y validación realizados

- ✅ 33 pruebas de humo (`npm test`): integridad de los 3 planes, generación de
  infografías (SVG válido, ambos formatos), reportes (completo/breve/consolidado),
  WhatsApp (mensaje, normalización de teléfono, `wa.me`) y métricas globales.
- ✅ Render verificado en navegador headless (Chromium): Overview, detalle de
  plan con pestañas, KPIs, Gantt, infografías y vista móvil, sin errores de
  consola de la aplicación.
- ✅ Revisión responsive (escritorio 1440px, móvil 390px) y de contraste.

---

## 🛠️ Herramientas / Skills utilizados

- **Extracción DOCX/XLSX**: parseo XML nativo (python-docx no disponible en el
  entorno) para leer los documentos y el Excel maestro.
- **Skill `dataviz`**: criterios de visualización ejecutiva y semáforos.
- **Design tokens** centralizados (inspirado en `theme-factory`).
- **MCP Vercel** (`deploy_to_vercel`) para el despliegue.
- **Chromium headless** para verificación visual y de consola.
- *No disponibles por política de red (npm/CDN 403):* Recharts, Framer Motion,
  shadcn/ui — reemplazados por implementaciones propias sin dependencias.

---

## ⚠️ Limitaciones actuales

- Persistencia en memoria/`localStorage` (sin base de datos); los datos son
  demostrativos salvo los provenientes del Excel de importaciones.
- La exportación a PDF usa el diálogo de impresión del navegador
  (“Guardar como PDF”), no una librería de PDF embebida.
- Autenticación y roles **simulados** (arquitectura preparada para auth real).
- WhatsApp Cloud API (Nivel 2) requiere credenciales; sin ellas funciona `wa.me`.

## 🔭 Recomendaciones para la siguiente fase

- Integrar **Supabase/PostgreSQL** para persistencia y auditoría real.
- Autenticación con **Microsoft 365 / Entra ID** y RBAC efectivo.
- Ingesta automática desde **Power BI / Power Automate / SharePoint**.
- Activar **WhatsApp Business Cloud API** y notificaciones programadas.
- Migración opcional a **Next.js** cuando el entorno permita build con dependencias.

---

© Friopacking S.A.C. · Uso interno.
