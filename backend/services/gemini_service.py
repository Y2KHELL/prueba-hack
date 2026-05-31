import os
import io
import base64
import json
import random

try:
    import google.generativeai as genai
    HAS_GEMINI = True
except ImportError:
    HAS_GEMINI = False

try:
    from PIL import Image
    HAS_PIL = True
except ImportError:
    HAS_PIL = False


def analyze_image(image_data: str, cultivo: str = "soya") -> dict:
    api_key = os.getenv("GEMINI_API_KEY", "")

    if not api_key or not HAS_GEMINI:
        return _mock_analysis(cultivo)

    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-2.5-flash")

        image = None

        if image_data.startswith("data:image"):
            header, b64data = image_data.split(",", 1)
            img_bytes = base64.b64decode(b64data)
            if HAS_PIL:
                image = Image.open(io.BytesIO(img_bytes))
        elif image_data.startswith("http"):
            import requests
            resp = requests.get(image_data, timeout=10)
            if HAS_PIL:
                image = Image.open(io.BytesIO(resp.content))
        else:
            img_bytes = base64.b64decode(image_data)
            if HAS_PIL:
                image = Image.open(io.BytesIO(img_bytes))

        prompt = f"""Analiza esta imagen de grano de soya ({cultivo}).
Evalua la calidad visual:
- Porcentaje de granos sanos
- Porcentaje de granos partidos
- Porcentaje de granos manchados
- Presencia de moho
- Impurezas visibles

Responde SOLO en JSON:
{{
  "calidad": "excelente|buena|regular|mala",
  "puntuacion": 0-100,
  "sanoPct": 0-100,
  "partidoPct": 0-100,
  "manchadoPct": 0-100,
  "mohoPct": 0-100,
  "impurezasPct": 0-100,
  "defectos": ["defecto1"],
  "observaciones": "descripcion",
  "recomendacion": "aceptar|rechazar|revisar",
  "penalty": true/false
}}"""

        if image:
            response = model.generate_content([prompt, image])
        else:
            response = model.generate_content([prompt])

        response_text = response.text.strip()
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        if response_text.startswith("json"):
            response_text = response_text[4:]

        try:
            result = json.loads(response_text)
        except json.JSONDecodeError:
            result = _mock_analysis(cultivo)

        return result

    except Exception as e:
        return _mock_analysis(cultivo)


def _mock_analysis(cultivo: str) -> dict:
    sano = random.randint(72, 96)
    partido = random.randint(2, 12)
    manchado = random.randint(1, 10)
    moho = random.randint(0, 6)
    impurezas = random.randint(1, 5)
    total = sano + partido + manchado + moho + impurezas
    factor = 100 / total if total > 0 else 1
    sano = round(sano * factor)
    partido = round(partido * factor)
    manchado = round(manchado * factor)
    moho = round(moho * factor)
    impurezas = round(impurezas * factor)
    diff = 100 - (sano + partido + manchado + moho + impurezas)
    sano += diff

    puntuacion = sano - (partido * 2) - (manchado * 2) - (moho * 5) - (impurezas * 3)
    puntuacion = max(0, min(100, puntuacion))

    if puntuacion >= 85:
        calidad = "excelente"
        recomendacion = "aceptar"
        penalty = False
    elif puntuacion >= 70:
        calidad = "buena"
        recomendacion = "aceptar"
        penalty = False
    elif puntuacion >= 50:
        calidad = "regular"
        recomendacion = "revisar"
        penalty = True
    else:
        calidad = "mala"
        recomendacion = "rechazar"
        penalty = True

    defectos = []
    if partido > 8: defectos.append("partido")
    if manchado > 6: defectos.append("manchado")
    if moho > 3: defectos.append("moho")
    if impurezas > 4: defectos.append("impurezas")

    return {
        "calidad": calidad,
        "puntuacion": puntuacion,
        "sanoPct": sano,
        "partidoPct": partido,
        "manchadoPct": manchado,
        "mohoPct": moho,
        "impurezasPct": impurezas,
        "defectos": defectos,
        "observaciones": f"Analisis demo para {cultivo}. Granos sanos: {sano}%, partidos: {partido}%, manchados: {manchado}%, moho: {moho}%, impurezas: {impurezas}%. Configure GEMINI_API_KEY para analisis real.",
        "recomendacion": recomendacion,
        "penalty": penalty,
        "demo": True,
    }
