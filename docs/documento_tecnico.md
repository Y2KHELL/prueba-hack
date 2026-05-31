# Documento Técnico - SoyCampo

## 1. Descripción General

SoyCampo es un sistema integral de gestión de calidad agrícola diseñado para optimizar el flujo de trabajo entre productores de campo y centros de acopio. El sistema incorpora análisis inteligente potenciado por IA para la evaluación visual de productos agrícolas.

## 2. Arquitectura del Sistema

### 2.1 Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (React)                     │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │
│  │  Campo  │  │  Acopio  │  │  Análisis│  │ Reporte │ │
│  └─────────┘  └──────────┘  └──────────┘  └─────────┘ │
└────────────────────────┬────────────────────────────────┘
                         │ HTTP/REST
┌────────────────────────┴────────────────────────────────┐
│                     Backend (Flask)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Campaigns│  │ Intakes  │  │ Samples  │              │
│  └──────────┘  └──────────┘  └──────────┘              │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │  Gemini Service  │  │ Penalty Service  │            │
│  └──────────────────┘  └──────────────────┘            │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────┐
│              External APIs (Gemini AI)                   │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Frontend | React | 19.x |
| Build Tool | Vite | 6.x |
| CSS Framework | Tailwind CSS | 4.x |
| Backend | Flask | 3.x |
| IA | Google Gemini | 1.5 Flash |

## 3. Flujo de Trabajo

### 3.1 Flujo Principal de Acopio

1. **Nuevo Ingreso**: Se registra la llegada del producto con datos del productor
2. **Recepción Técnica**: Se verifica documentación y estado del producto
3. **Muestra Visual**: Se captura imagen para análisis
4. **Análisis IA**: Gemini evalúa calidad visual del producto
5. **Evaluación Penalización**: Se calculan descuentos según calidad
6. **Reporte**: Se genera documento final con toda la información

### 3.2 Penalizaciones

El sistema aplica penalizaciones automáticas basadas en:
- Tipo de cultivo (café, cacao, plátano)
- Defectos detectados (graves vs menores)
- Calidad general del producto

| Calidad | Multiplicador |
|---------|--------------|
| Excelente | 1.0 |
| Buena | 0.95 |
| Regular | 0.75 |
| Mala | 0.5 |

## 4. API REST

### 4.1 Endpoints Principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/campaigns` | Listar campañas |
| POST | `/api/campaigns` | Crear campaña |
| GET | `/api/intakes` | Listar ingresos |
| POST | `/api/intakes` | Registrar ingreso |
| GET | `/api/samples` | Listar muestras |
| POST | `/api/samples` | Registrar muestra |
| POST | `/api/reports/analyze` | Análisis IA |
| GET | `/api/reports/summary` | Resumen estadístico |

### 4.2 Ejemplo de Request

```json
POST /api/reports/analyze
{
  "image_url": "https://ejemplo.com/imagen.jpg",
  "cultivo": "cafe"
}
```

### 4.3 Ejemplo de Response

```json
{
  "calidad": "buena",
  "puntuacion": 82,
  "defectos": ["manchas_leves"],
  "observaciones": "Producto en buen estado general",
  "recomendacion": "aceptar",
  "penalty_info": {
    "penalizacion_puntos": 15,
    "descuento_porcentaje": 5,
    "recomendacion": "descuento_menor"
  }
}
```

## 5. Instalación y Desarrollo

### 5.1 Prerrequisitos

- Python 3.10+
- Node.js 18+
- Git

### 5.2 Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### 5.3 Frontend

```bash
cd frontend
npm install
npm run dev
```

### 5.4 Variables de Entorno

Copiar `.env.example` a `.env` y configurar:

- `GEMINI_API_KEY`: Clave de API de Google Gemini
- `FLASK_DEBUG`: Modo debug (true/false)
- `CORS_ORIGINS`: Orígenes permitidos

## 6. Estructura de Datos

### 6.1 Campaña

```json
{
  "id": "camp_001",
  "nombre": "string",
  "cultivo": "cafe|cacao|platano",
  "fecha_inicio": "YYYY-MM-DD",
  "fecha_fin": "YYYY-MM-DD",
  "estado": "activa|finalizada",
  "lotes": ["string"]
}
```

### 6.2 Ingreso

```json
{
  "id": "ing_0001",
  "productor": "string",
  "finca": "string",
  "lote": "string",
  "cultivo": "string",
  "peso_neto": 0,
  "estado": "pendiente|aprobado|rechazado"
}
```

## 7. Consideraciones de Seguridad

- Las API keys nunca se exponen en el frontend
- CORS configurado solo para orígenes conocidos
- Validación de entrada en todos los endpoints

## 8. Escalabilidad Futura

- Integración con Firebase para persistencia
- Sistema de notificaciones
- Dashboard administrativo avanzado
- App móvil para campo
- Integración con básculas digitales
