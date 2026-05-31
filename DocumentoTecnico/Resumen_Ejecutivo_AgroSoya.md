# Resumen Ejecutivo — AgroSoya
## Hackathon Build With AI 2026 | Mención AGRO

---

## ¿Qué es AgroSoya?

**AgroSoya** es una plataforma web tipo PWA (Progressive Web App) que digitaliza y conecta dos momentos críticos de la cadena soyera cruceña: la gestión de la campaña agrícola en campo y el control de calidad en centros de acopio, usando inteligencia artificial como apoyo a la decisión.

---

## El problema

Santa Cruz concentra más del 95% de la producción de soya en Bolivia. Sin embargo, existe una **brecha digital** en la gestión cotidiana del sector:

- **En campo:** los agricultores registran costos, insumos y rentabilidad de forma manual o informal, sin herramientas integradas.
- **En acopio:** los silos evalúan calidad del grano (humedad, impurezas, granos dañados) con procesos manuales, poco trazables y subjetivos.
- **Sin conexión:** no hay un hilo digital entre el origen del lote y su evaluación final.

---

## La solución

Dos modos en una sola plataforma:

| Modo | Para quién | Qué hace |
|---|---|---|
| **Modo Campo** | Agricultor / técnico | Registra campaña, costos, insumos, fumigaciones, bitácora fotográfica y calcula rentabilidad |
| **Modo Acopio** | Operador de silo / industria | Registra ingreso de camión, humedad (manual), analiza muestra con IA, calcula castigo y genera reporte |

---

## La IA en AgroSoya

**Gemini Developer API** analiza visualmente las fotografías de la muestra de soya y estima:
- % de grano sano, partido, manchado
- % de impurezas visibles
- % de posible moho
- Calificación de calidad: A / B / C / R
- Nivel de riesgo: Bajo / Medio / Alto / Crítico

> **Nota importante:** La humedad NO se calcula desde la imagen. Se ingresa manualmente desde el equipo externo del silo. La IA es apoyo visual a la decisión, no reemplaza el laboratorio certificado.

---

## Stack tecnológico

React + Vite + TypeScript + Tailwind CSS · Firebase Hosting + Firestore + Storage (plan Spark gratuito) · Gemini API (free tier) · PWA offline parcial para Modo Campo.

**Costo de infraestructura del MVP: $0 (todo en nivel gratuito).**

---

## Impacto esperado

- **Productivo:** gestión digital de campañas agrícolas con histórico y cálculo de rentabilidad.
- **Económico:** reducción de castigos por mejor control de calidad en acopio; ahorro estimado (supuesto pendiente de validación).
- **Tecnológico:** IA visual aplicada a un flujo agroindustrial real en Bolivia.
- **Social:** acceso a herramientas digitales para productores medianos y pequeños de Santa Cruz.

---

## Criterios del jurado cubiertos

| Criterio | Puntaje | Cobertura |
|---|---|---|
| Impacto y relevancia del problema | 20 pts | Brecha digital en la cadena soyera cruceña |
| Calidad técnica de la IA | 20 pts | Gemini API visual integrado en el flujo real |
| Innovación y creatividad | 15 pts | Primera plataforma que conecta campo y acopio para soya en Bolivia |
| Integración de APIs | 15 pts | Gemini + Firebase (Auth, Firestore, Storage, Hosting) |
| FODA, PESTEL, Lean Canvas | 10 pts | Incluidos en el documento técnico |
| Escalabilidad y sostenibilidad | 10 pts | Modelo SaaS, expansión a otros cultivos |
| Calidad del pitch | 10 pts | Flujo demo end-to-end demostrable |
| **Total** | **100 pts** | |

---

## Próximos pasos post-hackathon

1. Piloto con 1 silo y 5–10 productores en campaña 2026–2027.
2. Validación de reglas de castigo con operadores reales.
3. Dataset propio de imágenes de soya boliviana para mayor precisión de IA.
4. Alianza con ANAPO y CAO para distribución sectorial.
5. Modelo de suscripción SaaS operativo en 6–12 meses.

---

*AgroSoya — Santa Cruz de la Sierra, Bolivia — Hackathon Build With AI 2026*
