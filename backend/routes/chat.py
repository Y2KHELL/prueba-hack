import os
import json
from flask import Blueprint, jsonify, request

chat_bp = Blueprint("chat", __name__)

SYSTEM_PROMPT = """Soy AgroBot, asistente de AgroSoya. Soy amigable, directo y practico. Hablo como un amigo que sabe de soya y tecnologia.

Lo que se:
- Soya en Santa Cruz: zonas (Cuatro Canadas, Pailon, San Julian, San Pedro, Montero, Okinawa, Cabezas, Charagua), rendimientos (1.8-2.8 ton/ha), precios ($370 USD/ton)
- Calidad: A (+90% sanos), B (80-90%), C (70-80%), D (<70%)
- Humedad maxima 14%, castigo 2.5% por punto extra
- Defectos: moho, pudricion, insectos (graves), partido, manchado, impurezas (menores)
- Siembras: verano (nov-dic) o invierno (jun-jul)
- Modo Campo: campanas, costos (semilla Bs 54/ha, fertilizante Bs 24/ha, etc.), rentabilidad
- Modo Acopio: ingreso, recepcion, muestra visual, analisis IA, castigo, reporte
- IA y tecnologia: Gemini es un modelo de lenguaje de Google que analiza imagenes y texto. La IA visual puede detectar plagas, clasificar granos, identificar enfermedades. Machine Learning es entrenar computadoras con datos para que hagan predicciones. Deep Learning es IA con redes neuronales profundas.
- Agricultura de precision: uso de datos, sensores, drones, IA para optimizar cultivos
- Trazabilidad: seguir el producto desde campo hasta mesa del consumidor

Reglas:
- Respondo CORTO (1-3 oraciones)
- Uso emojis a veces
- Si no se algo, lo digo honestamente
"""


@chat_bp.route("/", methods=["POST"])
def chat():
    data = request.get_json()
    if not data or "message" not in data:
        return jsonify({"error": "Mensaje requerido"}), 400

    user_message = data["message"]

    try:
        import google.generativeai as genai
        api_key = os.getenv("GEMINI_API_KEY", "")
        
        if not api_key:
            return jsonify({"response": get_mock_response(user_message)})

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-2.5-flash")
        
        response = model.generate_content(
            [SYSTEM_PROMPT, user_message],
            generation_config=genai.GenerationConfig(
                temperature=0.7,
                max_output_tokens=200,
            )
        )
        
        return jsonify({"response": response.text.strip()})

    except Exception as e:
        return jsonify({"response": get_mock_response(user_message)})


def get_mock_response(text):
    lower = text.lower()
    if "humedad" in lower:
        return "La humedad maxima para soya es 14%. Cada punto extra genera un castigo del 2.5%. Te recomiendo usar el modo acopio para medirlo correctamente."
    if "calidad" in lower:
        return "La calidad se clasifica en A (+90% sanos), B (80-90%), C (70-80%) y D (<70%). Se evalua porcentaje de granos sanos, partidos, manchados y con moho."
    if "castigo" in lower or "descuento" in lower:
        return "El castigo se calcula por: humedad excedida (2.5% por punto), defectos graves (moho = 30pts) y defectos menores (partido = 10pts). Puede llegar al 30%."
    if "precio" in lower or "soya" in lower or "soja" in lower:
        return "Precio actual: $370 USD/tonelada (~Bs 2,590). Rendimiento promedio en Santa Cruz: 2.0-2.5 ton/ha. Siembra en verano (nov-dic) o invierno (jun-jul)."
    if "campo" in lower:
        return "En Modo Campo podes crear campanas, registrar costos (semilla, fertilizante, etc.), actividades y ver rentabilidad esperada."
    if "acopio" in lower:
        return "En Modo Acopio: registras ingreso del camion, pones humedad medida, subes fotos y la IA analiza calidad automaticamente."
    if "hola" in lower:
        return "¡Hola! Soy el asistente de AgroSoya. Preguntame sobre soya, calidad de grano, humedad o como usar la plataforma."
    return "Preguntame sobre: humedad, calidad, castigos, modo campo, modo acopio, precios de soya o como usar AgroSoya."
