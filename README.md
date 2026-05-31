
![AgroSoya](frontend/public/logo.png#gh-dark-mode-only)
![AgroSoya](frontend/public/logo.png#gh-light-mode-only)

# 🌱 AgroSoya — Gestión Inteligente de Cultivos y Acopio de Soya

> **Hackathon SoyCampo 2026** · Santa Cruz, Bolivia  
> Plataforma que conecta el campo con el centro de acopio usando inteligencia artificial.

---

## ✨ Funcionalidades

### 🌾 Modo Campo
- Creación y gestión de campañas agrícolas
- Registro de costos por hectárea (semilla, fertilizante, herbicida, etc.)
- Cálculo de rentabilidad esperada por campaña
- Datos de rendimiento por zona productiva

### 🏭 Modo Acopio
- Registro de ingreso de camiones con pesaje
- Recepción técnica con checklist de calidad
- Captura de muestra visual (foto del grano)
- **Análisis con IA** — clasificación de calidad del grano vía Gemini
- Cálculo de penalizaciones por humedad y defectos
- Generación de reporte imprimible

### 🌤️ Clima en Tiempo Real
- Clima actual para 15 zonas productivas de Santa Cruz
- Datos de temperatura, humedad, viento y condición
- Actualización automática cada 10 minutos con caché

### 🤖 AgroBot — Chat Asistente
- Chat con IA especializada en soya
- Responde sobre calidad, humedad, castigos, precios
- Modo offline con respuestas locales predefinidas

### 📰 Noticias del Sector
- Noticias actualizadas del rubro soyeros en Santa Cruz
- Fallback estático cuando la API no responde

---

## 🏗️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React 19, Vite 6, Tailwind CSS 4, React Router 7 |
| **Backend** | Python 3.13, Flask 3.1, Flask-CORS |
| **IA** | Google Gemini API (análisis de imágenes) |
| **Clima** | wttr.in API (consultas paralelas + caché) |
| **Hosting** | Firebase Hosting |
| **Almacenamiento** | Sistema de archivos JSON (demo) |

---

## 🚀 Despliegue en Vivo

La aplicación está desplegada en Firebase Hosting:

**👉 [https://aerospray-ai.web.app](https://aerospray-ai.web.app)**

---

## 📦 Instalación Local

### Requisitos
- Python 3.10+
- Node.js 18+
- npm

### Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
# → http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### Un solo comando
```bash
start.bat
# Levanta backend y frontend simultáneamente
```

---

## 🔌 API Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/campaigns/` | Listar campañas |
| POST | `/api/campaigns/` | Crear campaña |
| GET | `/api/intakes/` | Listar ingresos |
| POST | `/api/intakes/` | Registrar ingreso |
| GET | `/api/samples/` | Listar muestras |
| POST | `/api/samples/` | Registrar muestra |
| POST | `/api/reports/analyze` | Análisis IA de imagen |
| GET | `/api/reports/summary` | Resumen de ingresos |
| POST | `/api/reports/penalty` | Calcular penalización |
| POST | `/api/chat/` | Chat con AgroBot |
| GET | `/api/climate/zones` | Zonas productivas |
| GET | `/api/climate/weather-all` | Clima todas las zonas |
| GET | `/api/news/` | Noticias del sector |

---

## 📁 Estructura del Proyecto

```
AgroSoya/
├── backend/               # API REST Python/Flask
│   ├── main.py            # Servidor principal
│   ├── config.py          # Configuración y variables de entorno
│   ├── requirements.txt   # Dependencias Python
│   ├── routes/            # Endpoints organizados por recurso
│   │   ├── campaigns.py   # CRUD de campañas
│   │   ├── intakes.py     # CRUD de ingresos
│   │   ├── samples.py     # CRUD de muestras
│   │   ├── reports.py     # Análisis y reportes
│   │   ├── chat.py        # Asistente AgroBot
│   │   ├── climate.py     # Clima en zonas productivas
│   │   └── news.py        # Noticias del sector
│   ├── services/          # Lógica de negocio
│   │   ├── gemini_service.py   # Integración con Gemini API
│   │   └── penalty_service.py  # Cálculo de penalizaciones
│   └── data/              # Datos demo en JSON
│
├── frontend/              # SPA React + Vite + Tailwind
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/         # Páginas principales
│   │   └── styles/        # Estilos globales
│   ├── public/            # Assets estáticos
│   └── vite.config.js     # Configuración de Vite + proxy
│
├── firebase.json          # Configuración Firebase Hosting
└── start.bat              # Script para iniciar todo
```

---

## ⚙️ Configuración

Renombrar `.env.example` → `backend/.env` y completar:

```env
GEMINI_API_KEY=tu-api-key-de-gemini
SECRET_KEY=una-clave-secreta-segura
FLASK_DEBUG=true
CORS_ORIGINS=http://localhost:5173
```

---

## 🧑‍🌾 Zonas Productivas Soportadas

| Zona | Región | Rendimiento |
|------|--------|-------------|
| Cuatro Cañadas | Este | 2.5 t/ha |
| Pailón | Este | 2.3 t/ha |
| San Julián | Este | 2.2 t/ha |
| San Pedro | Norte | 2.4 t/ha |
| Montero | Norte | 2.3 t/ha |
| Okinawa | Norte | 2.8 t/ha |
| Cabezas | Sur | 2.1 t/ha |
| Charagua | Sur | 1.8 t/ha |

*Más 7 zonas adicionales disponibles en la plataforma.*

---

## 📄 Licencia

Proyecto desarrollado para el **Hackathon SoyCampo 2026** organizado por Build with AI Bolivia.
