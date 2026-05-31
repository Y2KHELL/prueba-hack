# AgroSoya

**Gestion Inteligente de Cultivos y Acopio de Soya**

> Hackathon Build With AI 2026 · Santa Cruz de la Sierra, Bolivia  
> Mencion: AGRO  
> 29 al 31 de mayo de 2026

---

## Tabla de Contenidos

- [Equipo](#equipo)
- [Problema Identificado](#problema-identificado)
- [Solucion Propuesta](#solucion-propuesta)
- [Arquitectura Tecnologica](#arquitectura-tecnologica)
- [Stack Tecnologico](#stack-tecnologico)
- [Aplicacion de IA](#aplicacion-de-ia)
- [Funcionalidades](#funcionalidades)
- [Instalacion Local](#instalacion-local)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API Endpoints](#api-endpoints)
- [Capturas de Pantalla](#capturas-de-pantalla)
- [Video Pitch](#video-pitch)
- [Impacto Esperado](#impacto-esperado)
- [Proximos Pasos](#proximos-pasos)
- [Licencia](#licencia)

---

## Equipo

| Nombre | Rol |
|--------|-----|
| Josue Guzman | Full Stack Developer |
| Joel albert  | Full Stack dev       |

---

## Problema Identificado

Santa Cruz es el principal productor de soya de Bolivia, con mas de 1.5 millones de hectareas cultivadas. Sin embargo, los productores y centros de acopio enfrentan problemas como:

- Falta de herramientas digitales para registrar y gestionar campanas agricolas.
- Procesos manuales en la recepcion de soya en centros de acopio, generando demoras y errores.
- Dificultad para evaluar la calidad del grano de forma objetiva y rapida.
- Desconocimiento de condiciones climaticas actualizadas por zona productiva.
- Ausencia de un canal de consulta inmediata sobre calidad, humedad, castigos y precios.

Estos problemas afectan directamente la eficiencia de la cadena productiva de la soya en Santa Cruz, desde el campo hasta el acopio.

---

## Solucion Propuesta

AgroSoya es una plataforma web que integra dos modulos principales:

1. **Modo Campo** -- permite a los productores crear y gestionar campanas agricolas, registrar costos por hectarea, y calcular rentabilidad esperada por campana.
2. **Modo Acopio** -- digitaliza el proceso de recepcion de soya, desde el registro del ingreso del camion, pesaje, evaluacion de calidad mediante checklist, captura de muestra visual, analisis automatizado con IA, calculo de penalizaciones y generacion de reportes imprimibles.

Adicionalmente, la plataforma incluye un modulo de clima en tiempo real para zonas productivas de Santa Cruz, un canal de noticias del sector soya, y AgroBot, un asistente virtual especializado en la cadena de valor de la soya.

---

## Arquitectura Tecnologica

```
[Usuario] --> [Firebase Hosting (Frontend SPA)]
                    |
                    | (API calls)
                    v
       [Backend Flask / Firebase Cloud Functions]
                    |
        +-----------+-----------+
        |           |           |
   Gemini API   wttr.in     Firestore
   (IA chat +   (Clima)    (Datos)
   vision IA)
```

La aplicacion sigue una arquitectura de frontend SPA (Single Page Application) con React, desplegada en Firebase Hosting. El backend esta desarrollado en Python con Flask y se conecta a Google Gemini API para analisis de imagenes y chatbot. Los datos se almacenan en Firestore (produccion) o archivos JSON (demo local). El clima se obtiene de la API publica wttr.in.

---

## Stack Tecnologico

| Capa | Tecnologia |
|------|-----------|
| Frontend | React 19, Vite 6, Tailwind CSS 4, React Router 7 |
| Backend | Python 3.13, Flask 3.1, Flask-CORS |
| Inteligencia Artificial | Google Gemini API (chat + analisis de imagenes) |
| Clima | wttr.in API (consultas paralelas con cache) |
| Hosting | Firebase Hosting |
| Base de Datos | Firestore (produccion) / JSON (demo local) |
| Control de Versiones | Git + GitHub |

---

## Aplicacion de IA

AgroSoya integra Google Gemini API en dos funcionalidades clave:

1. **Analisis de Calidad de Grano** (Gemini Vision): El usuario sube una foto de la muestra de soya y la IA clasifica automaticamente la calidad (A/B/C/D), calcula el porcentaje de granos sanos, partidos, manchados, con moho e impurezas, y genera recomendaciones de acopio.

2. **AgroBot - Chat Asistente** (Gemini Text): Un chatbot especializado en la cadena productiva de la soya que responde preguntas sobre calidad de grano, humedad maxima, calculo de castigos, precios de referencia, y uso de la plataforma. Incluye modo offline con respuestas predefinidas.

---

## Funcionalidades

### Modo Campo
- Creacion y gestion de campanas agricolas.
- Registro de costos por hectarea (semilla, fertilizante, herbicida, fungicida, insecticida, maquinaria, transporte).
- Calculo de rentabilidad esperada por campana.
- Datos de rendimiento por zona productiva de Santa Cruz.
- Visualizacion de metricas: hectareas totales, ingreso esperado.

### Modo Acopio
- Registro de ingreso de camiones con pesaje (bruto, tara, neto).
- Recepcion tecnica con checklist de calidad (documentacion, peso, estado fresco, olores, temperatura).
- Captura de muestra visual (foto del grano).
- Analisis con IA para clasificacion de calidad.
- Calculo de penalizaciones por humedad y defectos.
- Generacion de reporte imprimible.

### Clima en Zonas Productivas
- Clima actual para 8+ zonas productivas de Santa Cruz.
- Datos de temperatura, humedad, viento y condicion.
- Datos de respaldo estaticos cuando la API no esta disponible.
- Actualizacion periodica automatica.

### AgroBot - Chat Asistente
- Chat con IA especializada en la cadena de la soya.
- Responde sobre calidad de grano, humedad, castigos, precios, modo campo y modo acopio.
- Modo offline con respuestas locales predefinidas.

### Noticias del Sector
- Noticias del rubro soya en Santa Cruz.
- Datos de respaldo estaticos cuando la API no responde.

---

## Instalacion Local

### Requisitos
- Python 3.10+
- Node.js 18+
- npm

### Clonar repositorio
```bash
git clone https://github.com/Y2KHELL/prueba-hack.git
cd prueba-hack
```

### Backend
```bash
cd backend
pip install -r requirements.txt
# Configurar .env con GEMINI_API_KEY
python main.py
# Servidor en http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Frontend en http://localhost:5173
```

### Un solo comando
```bash
start.bat
# Levanta backend y frontend simultaneamente
```

---

## Estructura del Proyecto

```
AgroSoya/
├── backend/                  # API REST Python/Flask
│   ├── main.py               # Servidor principal
│   ├── config.py             # Configuracion y variables de entorno
│   ├── requirements.txt      # Dependencias Python
│   ├── routes/               # Endpoints organizados por recurso
│   │   ├── campaigns.py      # CRUD de campanas
│   │   ├── intakes.py        # CRUD de ingresos
│   │   ├── samples.py        # CRUD de muestras
│   │   ├── reports.py        # Analisis y reportes
│   │   ├── chat.py           # Asistente AgroBot
│   │   ├── climate.py        # Clima en zonas productivas
│   │   └── news.py           # Noticias del sector
│   ├── services/             # Logica de negocio
│   │   ├── gemini_service.py # Integracion con Gemini API
│   │   └── penalty_service.py# Calculo de penalizaciones
│   └── data/                 # Datos demo en JSON
│
├── frontend/                 # SPA React + Vite + Tailwind
│   ├── src/
│   │   ├── components/       # Componentes reutilizables
│   │   ├── pages/            # Paginas principales
│   │   └── styles/           # Estilos globales
│   ├── public/               # Assets estaticos
│   └── vite.config.js        # Configuracion de Vite + proxy
│
├── functions/                # Firebase Cloud Functions (Node.js)
│   ├── index.js              # API unificada para produccion
│   └── package.json          # Dependencias de funciones
│
├── docs/                     # Documentacion
│   └── documento_tecnico.md  # Documento tecnico del proyecto
│
├── firebase.json             # Configuracion Firebase Hosting
├── start.bat                 # Script para iniciar todo
└── README.md                 # Este archivo
```

---

## API Endpoints

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/api/campaigns/` | Listar campanas |
| POST | `/api/campaigns/` | Crear campana |
| GET | `/api/intakes/` | Listar ingresos |
| POST | `/api/intakes/` | Registrar ingreso |
| GET | `/api/intakes/:id` | Detalle de ingreso |
| GET | `/api/samples/` | Listar muestras |
| POST | `/api/samples/` | Registrar muestra |
| POST | `/api/reports/analyze` | Analisis IA de imagen |
| GET | `/api/reports/summary` | Resumen de ingresos |
| POST | `/api/reports/penalty` | Calcular penalizacion |
| POST | `/api/chat/` | Chat con AgroBot |
| GET | `/api/climate/zones` | Zonas productivas |
| GET | `/api/climate/weather-all` | Clima todas las zonas |
| GET | `/api/news/` | Noticias del sector |

---

## Capturas de Pantalla

*(Insertar imagenes referenciales del proyecto)*

---

## Video Pitch

*(Link al video pitch de maximo 2 minutos)*

---

## Impacto Esperado

- Reducir los tiempos de registro y evaluacion en centros de acopio mediante la digitalizacion del proceso.
- Proveer a los productores de informacion actualizada sobre clima, precios y rendimiento para la toma de decisiones.
- Democratizar el acceso a herramientas de inteligencia artificial para el analisis de calidad de grano.
- Mejorar la trazabilidad del producto desde el campo hasta el acopio.
- Fortalecer la cadena productiva de la soya en Santa Cruz mediante tecnologia accesible.

---

## Proximos Pasos

- Implementar autenticacion de usuarios con Firebase Auth.
- Migrar almacenamiento a Firestore para persistencia de datos en produccion.
- Desplegar backend en Firebase Cloud Functions con plan Blaze.
- Agregar historial de campanas e ingresos por productor.
- Incorporar notificaciones push para alertas climaticas y de precios.
- Publicar el proyecto en un dominio personalizado.

---

## Licencia

Proyecto desarrollado para el **Hackathon Build With AI 2026** organizado por Google Developer Groups Santa Cruz y Women Techmakers Santa Cruz en colaboracion con la Universidad Catolica Boliviana Sede Santa Cruz.
