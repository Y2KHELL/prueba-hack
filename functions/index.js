const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

admin.initializeApp();
const db = admin.firestore();
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const GEMINI_KEY = functions.config().gemini?.key || process.env.GEMINI_API_KEY;
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent';

async function geminiCall(prompt, imageData = null) {
  const parts = [{ text: prompt }];
  if (imageData) {
    parts.push({ inline_data: { mime_type: 'image/jpeg', data: imageData.split(',')[1] || imageData } });
  }
  const res = await fetch(`${GEMINI_URL}?key=${GEMINI_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts }] })
  });
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
}

const ZONES = [
  { id: 'cuatro_canadas', nombre: 'Cuatro Cañadas', region: 'Este', hectareas: 120000, rendimiento: 2.5 },
  { id: 'pailon', nombre: 'Pailón', region: 'Este', hectareas: 85000, rendimiento: 2.3 },
  { id: 'san_julian', nombre: 'San Julián', region: 'Este', hectareas: 70000, rendimiento: 2.2 },
  { id: 'okinawa', nombre: 'Okinawa', region: 'Norte', hectareas: 30000, rendimiento: 2.8 },
  { id: 'san_pedro', nombre: 'San Pedro', region: 'Norte', hectareas: 55000, rendimiento: 2.4 },
  { id: 'montero', nombre: 'Montero', region: 'Norte', hectareas: 65000, rendimiento: 2.3 },
  { id: 'cabezas', nombre: 'Cabezas', region: 'Sur', hectareas: 90000, rendimiento: 2.1 },
  { id: 'charagua', nombre: 'Charagua', region: 'Sur', hectareas: 50000, rendimiento: 1.8 }
];

const ZONE_WEATHER = {
  'Cuatro Cañadas': { temperatura: 29, humedad: 62, viento: 10, condicion: 'Despejado' },
  'Pailón': { temperatura: 28, humedad: 65, viento: 12, condicion: 'Nublado' },
  'San Julián': { temperatura: 28, humedad: 68, viento: 8, condicion: 'Parcial nublado' },
  'Okinawa': { temperatura: 27, humedad: 60, viento: 15, condicion: 'Despejado' },
  'San Pedro': { temperatura: 27, humedad: 63, viento: 11, condicion: 'Nublado' },
  'Montero': { temperatura: 28, humedad: 64, viento: 9, condicion: 'Parcial nublado' },
  'Cabezas': { temperatura: 27, humedad: 58, viento: 14, condicion: 'Despejado' },
  'Charagua': { temperatura: 26, humedad: 55, viento: 16, condicion: 'Despejado' }
};

app.get('/api/climate/zones', (req, res) => res.json(ZONES));

app.get('/api/climate/weather-all', async (req, res) => {
  try {
    const results = await Promise.all(ZONES.map(async (z) => {
      const name = encodeURIComponent(z.nombre.split(' ')[0]);
      const w = await fetch(`https://wttr.in/${name}?format=%t_%h_%w_%C`);
      const txt = await w.text();
      const p = txt.split('_');
      return { ...z, clima: { temperatura: parseInt(p[0]) || 28, humedad: parseInt(p[1]) || 60, viento: parseInt(p[2]) || 10, condicion: p[3] || 'Despejado' } };
    }));
    res.json(results);
  } catch { res.json(ZONES.map(z => ({ ...z, clima: ZONE_WEATHER[z.nombre] }))); }
});

const NEWS = [
  { id: 1, titulo: 'Campaña sojera 2025-2026 cierra con 3.6 millones de toneladas en Santa Cruz', fuente: 'CNPB', fecha: '2026-05-30', resumen: 'Santa Cruz superó las expectativas con rendimientos promedio de 2.4 ton/ha.', url: 'https://www.cnpb.com.bo' },
  { id: 2, titulo: 'Humedad en granos de soya: el factor clave para el acopio', fuente: 'INIA Santa Cruz', fecha: '2026-05-29', resumen: 'La humedad máxima para acopio es del 14%. Exceder genera descuentos del 2.5% por punto extra.', url: 'https://www.inia.gob.bo' },
  { id: 3, titulo: 'Precio de soya se mantiene en $370 USD/tonelada', fuente: 'CAINCO Santa Cruz', fecha: '2026-05-28', resumen: 'El precio de referencia para Santa Cruz se mantiene estable.', url: 'https://www.cainco.org.bo' },
  { id: 4, titulo: 'Lluvias en el norte integrado benefician zonas de siembra', fuente: 'SENAMHI Santa Cruz', fecha: '2026-05-27', resumen: 'Precipitaciones mejoran condiciones para lotes en fase de crecimiento vegetativo.', url: 'https://www.senamhi.gob.bo' },
  { id: 5, titulo: 'Acopios de Santa Cruz implementan trazabilidad digital', fuente: 'CAINCO', fecha: '2026-05-26', resumen: 'Principales acopios digitalizan recepción de lotes para mejorar trazabilidad.', url: 'https://www.cainco.org.bo' },
  { id: 6, titulo: 'Cabezas y Charagua cierran campaña con rendimientos variables', fuente: 'Cámara Agropecuaria del Sur', fecha: '2026-05-25', resumen: 'Zona sur reporta rendimientos entre 1.8 y 2.2 ton/ha.', url: '#' }
];

app.get('/api/news/', (req, res) => res.json(NEWS));

app.get('/api/campaigns/', async (req, res) => {
  const snap = await db.collection('campaigns').get();
  const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  res.json(list);
});

app.post('/api/campaigns/', async (req, res) => {
  const ref = await db.collection('campaigns').add(req.body);
  const doc = await ref.get();
  res.json({ id: ref.id, ...doc.data() });
});

app.get('/api/intakes/', async (req, res) => {
  const snap = await db.collection('intakes').get();
  const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  res.json(list);
});

app.post('/api/intakes/', async (req, res) => {
  const ref = await db.collection('intakes').add(req.body);
  const doc = await ref.get();
  res.json({ id: ref.id, ...doc.data() });
});

app.get('/api/intakes/:id', async (req, res) => {
  const doc = await db.collection('intakes').doc(req.params.id).get();
  if (!doc.exists) return res.status(404).json({ error: 'No encontrado' });
  res.json({ id: doc.id, ...doc.data() });
});

app.get('/api/samples/', async (req, res) => {
  const snap = await db.collection('samples').get();
  const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  res.json(list);
});

app.post('/api/samples/', async (req, res) => {
  const ref = await db.collection('samples').add(req.body);
  const doc = await ref.get();
  res.json({ id: ref.id, ...doc.data() });
});

app.get('/api/reports/summary', async (req, res) => {
  const snap = await db.collection('intakes').get();
  const list = snap.docs.map(d => d.data());
  const total = list.length;
  const aprobados = list.filter(i => i.estado === 'aprobado').length;
  const rechazados = list.filter(i => i.estado === 'rechazado').length;
  res.json({ total_ingresos: total, aprobados, rechazados, tasa_aprobacion: total ? Math.round(aprobados / total * 100) : 0 });
});

app.post('/api/reports/analyze', async (req, res) => {
  try {
    const { image_url, cultivo } = req.body;
    const prompt = `Analiza esta imagen de granos de ${cultivo || 'soya'}. Responde SOLO con JSON: {"calidad":"A/B/C/D","puntuacion":0-100,"sanoPct":0,"partidoPct":0,"manchadoPct":0,"mohoPct":0,"impurezasPct":0,"recomendacion":"texto","defectos":[],"observaciones":"texto"}`;
    const text = await geminiCall(prompt, image_url);
    const json = JSON.parse(text.replace(/```json|```/g, '').trim());
    json.demo = false;
    res.json(json);
  } catch (e) {
    res.json({ calidad: 'B', puntuacion: 85, sanoPct: 88, partidoPct: 6, manchadoPct: 4, mohoPct: 1, impurezasPct: 1, recomendacion: 'Apto para acopio', defectos: ['5% partidos'], observaciones: 'Lote en buenas condiciones', demo: true });
  }
});

app.post('/api/reports/penalty', (req, res) => {
  const { calidad, defectos } = req.body;
  let puntos = 0, descuento = 0, graves = [], menores = [];
  if (defectos?.includes('moho')) { puntos += 30; graves.push('Moho presente'); }
  if (defectos?.includes('manchado')) { puntos += 15; graves.push('Granos manchados'); }
  if (defectos?.includes('partido')) { puntos += 10; menores.push('Granos partidos'); }
  if (defectos?.includes('impurezas')) { puntos += 5; menores.push('Impurezas'); }
  if (calidad === 'C') { puntos += 10; } else if (calidad === 'D') { puntos += 20; }
  descuento = Math.min(puntos, 30);
  const recomendacion = puntos === 0 ? 'sin_penalizacion' : puntos > 20 ? 'rechazar_lote' : 'aplica_descuento';
  res.json({ penalizacion_puntos: puntos, descuento_porcentaje: descuento, recomendacion, defectos_graves: graves, defectos_menores: menores });
});

app.post('/api/chat/', async (req, res) => {
  try {
    const { message } = req.body;
    const prompt = `Sos un asistente experto en soya de Bolivia. Respondé en español breve y claro. Pregunta: ${message}`;
    const text = await geminiCall(prompt);
    res.json({ response: text });
  } catch {
    const lower = (req.body.message || '').toLowerCase();
    let response = 'Preguntame sobre: humedad, calidad, castigos, modo campo, modo acopio, precios de soya.';
    if (lower.includes('humedad')) response = 'La humedad maxima para soya es 14%. Cada punto extra genera un castigo del 2.5%.';
    else if (lower.includes('calidad')) response = 'La calidad se clasifica en A (+90% sanos), B (80-90%), C (70-80%) y D (<70%).';
    else if (lower.includes('castigo') || lower.includes('descuento')) response = 'El castigo se calcula por: humedad excedida (2.5% por punto), defectos graves (moho = 30pts) y menores (partido = 10pts). Maximo 30%.';
    else if (lower.includes('precio')) response = 'Precio actual: $370 USD/tonelada (~Bs 2,590). Rendimiento promedio en Santa Cruz: 2.0-2.5 ton/ha.';
    else if (lower.includes('campo')) response = 'En Modo Campo podes crear campanas, registrar costos (semilla, fertilizante, etc.) y ver rentabilidad esperada.';
    else if (lower.includes('acopio')) response = 'En Modo Acopio: registras ingreso del camion, pones humedad, subes fotos y la IA analiza calidad.';
    else if (lower.includes('hola') || lower.includes('buenas')) response = 'Hola! Soy el asistente de AgroSoya. Preguntame sobre soya, calidad de grano, humedad o como usar la plataforma.';
    res.json({ response });
  }
});

exports.api = functions.https.onRequest(app);
