# AgroSoya

**Gestión inteligente de cultivos y acopio de soya**

> Hackathon Build With AI 2026 · Santa Cruz de la Sierra, Bolivia
> Mención: **AGRO**
> Proyecto enfocado en la cadena soyera cruceña, inteligencia artificial y digitalización agroindustrial.

---

## Tabla de contenidos

* [Equipo](#equipo)
* [Problema identificado](#problema-identificado)
* [Solución propuesta](#solución-propuesta)
* [Usuarios beneficiarios](#usuarios-beneficiarios)
* [Flujo principal](#flujo-principal)
* [Arquitectura tecnológica](#arquitectura-tecnológica)
* [Stack tecnológico](#stack-tecnológico)
* [Aplicación de IA](#aplicación-de-ia)
* [Estado actual del MVP](#estado-actual-del-mvp)
* [Funcionalidades](#funcionalidades)
* [Instalación local](#instalación-local)
* [Variables de entorno](#variables-de-entorno)
* [Estructura del proyecto](#estructura-del-proyecto)
* [API endpoints](#api-endpoints)
* [Capturas de pantalla](#capturas-de-pantalla)
* [Video pitch](#video-pitch)
* [Impacto esperado](#impacto-esperado)
* [Próximos pasos](#próximos-pasos)
* [Licencia](#licencia)
*  [DocumentoTecnico](#Documentación-técnica) 

---

## Equipo

| Nombre         | Rol                  |
| ------------   | -------------------- |
| Josue Guzman   |  Developer           |
| Joel Albert   |  Developer           |
| Fabian Hurtado |  Developer           |
| Elena Rojas    |  encargda del contenido audiovisual y analizis de proyecto |


---
## Demo en línea

La aplicación desplegada de **AgroSoya** está disponible en:

🔗 [https://agro-soya.web.app](https://agro-soya.web.app)

> Nota: la versión desplegada corresponde al MVP/demo de hackathon. Algunas funciones pueden operar con datos de prueba, backend local o servicios externos según la configuración disponible.

## Problema identificado

Santa Cruz es uno de los principales centros productivos de soya en Bolivia. La cadena soyera involucra decisiones críticas desde el campo hasta el acopio: planificación de campaña, costos de producción, insumos, clima, cosecha, transporte, recepción, humedad, impurezas, calidad del grano, castigos y reportes.

Sin embargo, muchos procesos todavía se realizan de forma manual, dispersa o poco trazable. Esto genera problemas como:

* Falta de herramientas digitales simples para registrar y gestionar campañas agrícolas.
* Dificultad para consolidar costos, rendimiento esperado y rentabilidad por campaña.
* Procesos manuales en la recepción de soya en centros de acopio.
* Evaluación visual de calidad poco estandarizada o dependiente del criterio del operador.
* Demoras en el cálculo de penalizaciones por humedad, defectos visibles o impurezas.
* Falta de reportes claros que conecten el origen del lote con su evaluación en acopio.
* Necesidad de información de clima, noticias y contexto productivo para apoyar decisiones.

Estos problemas afectan la eficiencia, trazabilidad y toma de decisiones en la cadena productiva de la soya en Santa Cruz.

---

## Solución propuesta

**AgroSoya** es una plataforma web que integra gestión agrícola e inteligencia artificial para apoyar dos momentos clave de la cadena soyera:

1. **Modo Campo**
   Permite al productor o técnico agrícola registrar campañas de soya, costos, insumos, actividades de manejo y estimaciones de rentabilidad.

2. **Modo Acopio**
   Digitaliza el proceso de recepción de camiones o lotes de soya, permitiendo registrar datos técnicos, humedad medida con equipo externo, muestra visual del grano, análisis con IA, cálculo de penalizaciones y generación de reportes.

Además, AgroSoya incorpora:

* **AgroBot**, un asistente virtual especializado en consultas sobre la cadena soyera.
* **Módulo de clima**, con datos de zonas productivas de Santa Cruz.
* **Noticias del sector**, para contexto productivo y de mercado.
* **Reportes imprimibles**, orientados a trazabilidad y toma de decisiones.

La propuesta no busca reemplazar al agrónomo, al laboratorio ni al criterio técnico del centro de acopio. La IA funciona como una herramienta de apoyo para mejorar la consistencia, rapidez y trazabilidad del análisis visual.

---

## Usuarios beneficiarios

| Usuario                 | Necesidad principal                                       | Parte del sistema |
| ----------------------- | --------------------------------------------------------- | ----------------- |
| Productor agrícola      | Registrar campaña, costos, insumos y rentabilidad         | Modo Campo        |
| Técnico agrícola        | Apoyar seguimiento de campaña y decisiones productivas    | Modo Campo        |
| Operador de acopio      | Registrar ingreso, humedad, muestra y evaluación del lote | Modo Acopio       |
| Centro de acopio / silo | Estandarizar recepción, calidad, penalización y reportes  | Modo Acopio       |
| Equipo de gestión       | Visualizar información, trazabilidad y resultados         | Reportes          |

---

## Flujo principal

El flujo más importante del MVP se encuentra en el **Modo Acopio**, porque ahí la inteligencia artificial tiene un papel central.

```text
Productor / lote de soya
        ↓
Ingreso al centro de acopio
        ↓
Registro de camión o lote
        ↓
Registro de humedad medida con equipo externo
        ↓
Carga o captura de muestra visual
        ↓
Análisis de calidad con IA
        ↓
Estimación de calidad visual
        ↓
Cálculo de penalización o castigo
        ↓
Reporte final de recepción
```

### Nota técnica importante

La humedad **no se calcula mediante imagen**. En AgroSoya, la humedad se registra como dato medido por un equipo externo del centro de acopio. La IA se aplica al análisis visual de la muestra para estimar calidad, defectos visibles, impurezas y recomendaciones de revisión.

---

## Arquitectura tecnológica

AgroSoya está diseñado con una arquitectura web modular que permite funcionar en modo local para la demo y evolucionar hacia una arquitectura cloud más completa.

### Modo local actual

```text
[Usuario]
   ↓
[Frontend React + Vite]
   ↓
[Backend Flask]
   ↓
[Datos JSON demo]
   ↓
[Gemini API / wttr.in API]
```

En este modo, el frontend se ejecuta localmente con Vite y el backend se ejecuta con Flask. Los datos pueden funcionar desde archivos JSON de respaldo y servicios externos como Gemini API para IA y wttr.in para clima.

### Modo demo hackathon

```text
[Usuario]
   ↓
[Firebase Hosting - Frontend SPA]
   ↓
[Backend Flask local o servidor externo]
   ↓
[Gemini API + datos demo]
```

Para la hackathon, el frontend puede desplegarse como SPA en Firebase Hosting. El backend puede ejecutarse localmente durante la demo o desplegarse en un servidor externo si el equipo lo configura.

### Modo producción futura

```text
[Usuario]
   ↓
[Firebase Hosting]
   ↓
[Cloud Functions o Cloud Run]
   ↓
[Firestore + Cloud Storage]
   ↓
[Gemini API]
```

En una versión futura, AgroSoya puede evolucionar hacia una arquitectura basada en Firebase Authentication, Cloud Firestore, Cloud Storage, Cloud Functions o Cloud Run. El uso de Cloud Functions o Cloud Run debe evaluarse solo si el equipo cuenta con facturación controlada, ya que puede requerir configuración adicional fuera del plan gratuito.

---

## Stack tecnológico

| Capa                 | Tecnología                              | Estado                                   |
| -------------------- | --------------------------------------- | ---------------------------------------- |
| Frontend             | React, Vite, Tailwind CSS, React Router | Implementado                             |
| Backend              | Python, Flask, Flask-CORS               | Implementado para modo local             |
| IA                   | Google Gemini API                       | Implementado para chat y análisis visual |
| Clima                | wttr.in API + datos de respaldo         | Implementado                             |
| Hosting              | Firebase Hosting                        | Preparado para frontend                  |
| Base de datos        | JSON demo / Firestore futuro            | JSON implementado, Firestore futuro      |
| Autenticación        | Firebase Authentication                 | Pendiente                                |
| Imágenes             | Local/demo / Cloud Storage futuro       | Pendiente para producción                |
| Control de versiones | Git + GitHub                            | En uso                                   |

---

## Aplicación de IA

AgroSoya integra inteligencia artificial en dos funcionalidades principales.

### 1. Análisis de calidad de grano

El usuario carga una foto o muestra visual de soya. La IA analiza la imagen y genera una estimación de calidad visual.

La salida esperada incluye:

* Calidad estimada: A, B, C o D.
* Porcentaje estimado de grano sano.
* Porcentaje de grano partido.
* Porcentaje de grano manchado.
* Posible presencia de moho visible.
* Impurezas visibles.
* Recomendación para recepción o revisión.

Ejemplo de salida estructurada:

```json
{
  "calidad": "B",
  "granoSanoPct": 84,
  "granoPartidoPct": 6,
  "granoManchadoPct": 5,
  "impurezasPct": 3,
  "posibleMohoPct": 2,
  "riesgoVisual": "medio",
  "recomendacion": "Aceptar con observación y revisar antes de mezclar con lote sano."
}
```

### 2. AgroBot

AgroBot es un asistente virtual orientado a responder consultas sobre:

* Calidad de grano.
* Humedad.
* Castigos o penalizaciones.
* Uso de la plataforma.
* Modo Campo.
* Modo Acopio.
* Interpretación de reportes.
* Recomendaciones generales de operación.

El asistente puede trabajar con Gemini API y también contar con respuestas locales predefinidas cuando la API no esté disponible.

---

## Estado actual del MVP

### Implementado

* Frontend con React y Vite.
* Backend con Flask.
* Modo Campo.
* Modo Acopio.
* Registro de campañas.
* Registro de ingresos de camión/lote.
* Cálculo de rentabilidad.
* Cálculo de penalizaciones.
* Análisis visual con Gemini API.
* AgroBot con Gemini Text.
* Clima por zonas productivas con wttr.in y datos de respaldo.
* Noticias del sector con datos de respaldo.
* Reporte imprimible.
* Datos demo en JSON.
* Estructura preparada para Firebase Hosting.

### Pendiente o futuro

* Autenticación con Firebase Auth.
* Persistencia principal en Cloud Firestore.
* Almacenamiento de imágenes en Cloud Storage.
* Deploy completo del backend.
* Capturas finales del sistema.
* Video pitch de máximo 2 minutos.
* Validación con productores, técnicos agrícolas y operadores de acopio.
* Reglas de seguridad definitivas para producción.

---

## Funcionalidades

### Modo Campo

* Creación y gestión de campañas agrícolas.
* Registro de costos por hectárea:

  * Semilla.
  * Fertilizante.
  * Herbicida.
  * Fungicida.
  * Insecticida.
  * Maquinaria.
  * Transporte.
* Cálculo de costo total.
* Cálculo de costo por hectárea.
* Estimación de producción esperada.
* Cálculo de ingreso esperado.
* Cálculo de ganancia estimada.
* Consulta de clima por zonas productivas.
* Visualización de métricas generales.

### Modo Acopio

* Registro de ingreso de camiones o lotes.
* Registro de productor y zona de origen.
* Registro de peso bruto, tara y peso neto.
* Registro de humedad medida externamente.
* Checklist técnico de recepción.
* Captura o carga de muestra visual.
* Análisis con IA.
* Clasificación de calidad.
* Cálculo de penalizaciones por humedad o defectos.
* Generación de reporte imprimible.

### Clima en zonas productivas

* Consulta de clima actual para zonas productivas de Santa Cruz.
* Datos de temperatura, humedad, viento y condición.
* Datos de respaldo cuando la API no esté disponible.
* Actualización periódica.

### AgroBot

* Chat asistido con IA.
* Respuestas sobre calidad, humedad, castigos, precios, uso del sistema y flujo de recepción.
* Modo de respaldo con respuestas locales.

### Noticias del sector

* Noticias o tarjetas informativas relacionadas con el sector soyero.
* Datos de respaldo para evitar fallos durante la demo.

---

## Instalación local

### Requisitos

* Python 3.10 o superior.
* Node.js 18 o superior.
* npm.
* Git.
* Cuenta o clave de Gemini API si se desea usar IA real.

### Clonar repositorio

```bash
git clone https://github.com/Y2KHELL/prueba-hack.git
cd prueba-hack
```

> Si el repositorio cambia de nombre, actualizar este enlace antes de la entrega final.

### Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
```

Servidor backend:

```text
http://localhost:5000
```

### Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

Servidor frontend:

```text
http://localhost:5173
```

### Ejecutar todo con script

En Windows:

```bash
start.bat
```

Este script levanta backend y frontend de forma simultánea.

---

## Variables de entorno

Crear un archivo `.env` en la carpeta correspondiente del backend según la configuración del proyecto.

Ejemplo:

```env
GEMINI_API_KEY=tu_clave_de_gemini
FLASK_ENV=development
```

Para futuras integraciones con Firebase:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

> No subir archivos `.env` al repositorio.

---

## Estructura del proyecto

```text
AgroSoya/
├── backend/                    # API REST Python/Flask
│   ├── main.py                 # Servidor principal
│   ├── config.py               # Configuración y variables de entorno
│   ├── requirements.txt        # Dependencias Python
│   ├── routes/                 # Endpoints organizados por recurso
│   │   ├── campaigns.py        # CRUD de campañas
│   │   ├── intakes.py          # CRUD de ingresos
│   │   ├── samples.py          # CRUD de muestras
│   │   ├── reports.py          # Análisis y reportes
│   │   ├── chat.py             # Asistente AgroBot
│   │   ├── climate.py          # Clima en zonas productivas
│   │   └── news.py             # Noticias del sector
│   ├── services/               # Lógica de negocio
│   │   ├── gemini_service.py   # Integración con Gemini API
│   │   └── penalty_service.py  # Cálculo de penalizaciones
│   └── data/                   # Datos demo en JSON
│
├── frontend/                   # SPA React + Vite + Tailwind
│   ├── src/
│   │   ├── components/         # Componentes reutilizables
│   │   ├── pages/              # Páginas principales
│   │   └── styles/             # Estilos globales
│   ├── public/                 # Assets estáticos
│   └── vite.config.js          # Configuración de Vite + proxy
│
├── functions/                  # Alternativa futura con Firebase Cloud Functions
│   ├── index.js                # API unificada para producción
│   └── package.json            # Dependencias de funciones
│
├── docs/                       # Documentación del proyecto
│   └── documento_tecnico.md    # Documento técnico
│
├── firebase.json               # Configuración de Firebase Hosting
├── start.bat                   # Script para iniciar frontend y backend
└── README.md                   # Documentación principal
```

> La carpeta `functions/` se considera una alternativa de producción futura. El MVP puede demostrarse con backend Flask local y frontend React.

---

## API endpoints

| Método | Ruta                       | Descripción              |
| ------ | -------------------------- | ------------------------ |
| GET    | `/api/campaigns/`          | Listar campañas          |
| POST   | `/api/campaigns/`          | Crear campaña            |
| GET    | `/api/intakes/`            | Listar ingresos          |
| POST   | `/api/intakes/`            | Registrar ingreso        |
| GET    | `/api/intakes/:id`         | Detalle de ingreso       |
| GET    | `/api/samples/`            | Listar muestras          |
| POST   | `/api/samples/`            | Registrar muestra        |
| POST   | `/api/reports/analyze`     | Análisis IA de imagen    |
| GET    | `/api/reports/summary`     | Resumen de ingresos      |
| POST   | `/api/reports/penalty`     | Calcular penalización    |
| POST   | `/api/chat/`               | Chat con AgroBot         |
| GET    | `/api/climate/zones`       | Zonas productivas        |
| GET    | `/api/climate/weather-all` | Clima de todas las zonas |
| GET    | `/api/news/`               | Noticias del sector      |

---

## Capturas de pantalla

Pendiente: insertar capturas reales del dashboard, Modo Campo, Modo Acopio, análisis IA y reporte final antes de la entrega.

Capturas sugeridas:

1. Pantalla principal.
2. Dashboard de Modo Campo.
3. Registro de campaña.
4. Dashboard de Modo Acopio.
5. Registro de ingreso de camión/lote.
6. Resultado del análisis IA.
7. Reporte final imprimible.
8. AgroBot.

---

## Video pitch

https://youtu.be/H4iZA53qnVY?feature=shared


---

## Impacto esperado

AgroSoya busca generar impacto en la cadena soyera cruceña mediante:

* Reducción de tiempos de registro y evaluación en centros de acopio.
* Digitalización del proceso de recepción de lotes de soya.
* Mejor trazabilidad desde el campo hasta el acopio.
* Apoyo a productores en el registro de costos y rentabilidad.
* Estandarización del análisis visual de calidad mediante IA.
* Reportes más claros para toma de decisiones.
* Mayor acceso a herramientas digitales e inteligencia artificial para el sector agro.
* Base tecnológica escalable hacia soluciones industriales de mayor precisión.

---

## Próximos pasos

AgroSoya está planteado como un MVP funcional para hackathon, pero con una ruta clara de evolución hacia una solución agroindustrial escalable.

### 1. Persistencia y usuarios

* Implementar autenticación con Firebase Authentication para productores, operadores de acopio y administradores.
* Migrar gradualmente los datos demo a Cloud Firestore para guardar campañas, ingresos, muestras, resultados IA y reportes.
* Agregar historial por productor, campaña agrícola, lote recibido y centro de acopio.
* Incorporar roles básicos:

  * Productor.
  * Técnico agrícola.
  * Operador de acopio.
  * Administrador.

### 2. Mejora del análisis con IA

* Recolectar un dataset propio de imágenes de soya en condiciones controladas.
* Mejorar la precisión del análisis visual con más ejemplos de:

  * Granos sanos.
  * Granos partidos.
  * Granos manchados.
  * Posible moho.
  * Impurezas visibles.
* Validar resultados con criterios técnicos de acopio.
* Mantener la humedad como dato medido por equipo externo, no inferido desde imagen.
* Agregar explicación de resultados para que el operador entienda por qué la IA clasificó una muestra como A, B, C o D.

### 3. Puente hacia automatización industrial

El MVP actual valida el núcleo digital e inteligente del proceso: registrar lote, cargar humedad medida, analizar visualmente la muestra, calcular castigo y generar reporte. En una versión industrial, este flujo puede evolucionar hacia una estación de análisis semiautomatizada o automatizada.

Flujo actual del MVP:

```text
Foto o webcam
    ↓
Análisis IA
    ↓
Calidad visual
    ↓
Castigo estimado
    ↓
Reporte
```

Evolución industrial futura:

```text
Cámara industrial fija
    ↓
Iluminación controlada
    ↓
IA en tiempo real
    ↓
PLC / SCADA
    ↓
Actuadores o compuertas
    ↓
Separación o derivación de lote
```

Tecnologías futuras posibles:

* Cámara industrial fija sobre bandeja, cinta transportadora o punto de muestreo.
* Iluminación controlada para mejorar la calidad de captura.
* Modelo de visión artificial entrenado con dataset local de soya.
* Reconocimiento en tiempo real de grano sano, partido, manchado, moho e impurezas.
* Integración con sensores de humedad.
* Integración con balanzas industriales.
* Integración con medidores físicos del silo.
* Integración con PLC o SCADA.
* Actuadores, compuertas o separadores para derivar lotes según calidad.
* Trazabilidad mediante QR desde campo hasta acopio.
* Dashboard industrial para monitorear calidad, humedad, castigos y reportes por lote.

### 4. Escalabilidad del producto

* Publicar el frontend en Firebase Hosting.
* Evaluar Cloud Functions, Cloud Run u otra alternativa de backend solo si se cuenta con facturación controlada.
* Incorporar Cloud Storage para imágenes de muestras y bitácora.
* Agregar alertas de clima, precios y calidad.
* Generar reportes PDF exportables.
* Agregar analítica de campañas, lotes y resultados por zona.
* Ampliar el sistema a otros cultivos industriales después de validar el caso de soya.

### 5. Validación con usuarios reales

* Probar el flujo con productores de soya.
* Probar el flujo con técnicos agrícolas.
* Probar el flujo con operadores de acopio.
* Ajustar formularios según el lenguaje usado en campo y silo.
* Validar reglas de castigo con criterios técnicos reales.
* Medir reducción de tiempo en registro, análisis y generación de reportes.
* Recoger retroalimentación para priorizar mejoras.

---
## Documentación técnica

La documentación técnica oficial de **AgroSoya** se encuentra disponible en la carpeta [`DocumentoTecnico`](DocumentoTecnico/).

### Documento técnico principal

- [Ver Documento Técnico - PDF](DocumentoTecnico/Documento_Tecnico_AgroSoya.pdf)
- [Descargar Documento Técnico editable - DOCX](DocumentoTecnico/Documento_Tecnico_AgroSoya.docx)

El documento técnico incluye los puntos solicitados por los lineamientos de la hackathon:

- investigación y contexto del problema;
- problema identificado;
- solución propuesta;
- arquitectura tecnológica;
- aplicación de inteligencia artificial;
- análisis FODA;
- análisis PESTEL;
- Lean Canvas;
- análisis financiero;
- impacto esperado;
- escalabilidad y próximos pasos.

### Lean Canvas

- [Ver Lean Canvas - PDF](DocumentoTecnico/Lean_Canvas_AgroSoya.pdf)
- [Descargar Lean Canvas editable - DOCX](DocumentoTecnico/Lean_Canvas_AgroSoya.docx)

### Documentos complementarios

- [Resumen Ejecutivo](DocumentoTecnico/Resumen_Ejecutivo_AgroSoya.md)
- [Fuentes de Investigación](DocumentoTecnico/Fuentes_Investigacion_AgroSoya.md)

Estos documentos respaldan la propuesta de AgroSoya como una solución orientada a la digitalización de la cadena soyera cruceña, integrando gestión de campo, control de calidad en acopio, inteligencia artificial y una visión de escalabilidad hacia entornos agroindustriales.

## Licencia

Proyecto desarrollado para el **Hackathon Build With AI 2026** organizado por Google Developer Groups Santa Cruz y Women Techmakers Santa Cruz, en colaboración con la Universidad Católica Boliviana, sede Santa Cruz.

Uso académico, demostrativo y de prototipo para hackathon.
