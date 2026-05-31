import os
import json
from flask import Blueprint, jsonify, current_app

news_bp = Blueprint("news", __name__)

FALLBACK_NEWS = [
    {
        "id": 1,
        "titulo": "Campaña sojera 2025-2026 cierra con 3.6 millones de toneladas en Santa Cruz",
        "fuente": "CNPB",
        "fecha": "2026-05-30",
        "resumen": "Santa Cruz superó las expectativas con rendimientos promedio de 2.4 ton/ha.",
        "url": "#"
    },
    {
        "id": 2,
        "titulo": "Humedad en granos de soya: el factor clave para el acopio",
        "fuente": "INIA Santa Cruz",
        "fecha": "2026-05-29",
        "resumen": "La humedad máxima para acopio es del 14%. Exceder genera descuentos del 2.5% por punto extra.",
        "url": "#"
    },
    {
        "id": 3,
        "titulo": "Precio de soya se mantiene en $370 USD/tonelada",
        "fuente": "CAINCO Santa Cruz",
        "fecha": "2026-05-28",
        "resumen": "El precio de referencia para entrega en Santa Cruz se mantiene estable.",
        "url": "#"
    },
    {
        "id": 4,
        "titulo": "Lluvias en el norte integrado benefician zonas de siembra",
        "fuente": "SENAMHI Santa Cruz",
        "fecha": "2026-05-27",
        "resumen": "Precipitaciones mejoran condiciones para lotes en fase de crecimiento vegetativo.",
        "url": "#"
    },
    {
        "id": 5,
        "titulo": "Acopios de Santa Cruz implementan trazabilidad digital",
        "fuente": "CAINCO",
        "fecha": "2026-05-26",
        "resumen": "Principales acopios digitalizan recepción de lotes para mejorar trazabilidad.",
        "url": "#"
    },
    {
        "id": 6,
        "titulo": "Cabezas y Charagua cierran campaña con rendimientos variables",
        "fuente": "Cámara Agropecuaria del Sur",
        "fecha": "2026-05-25",
        "resumen": "Zona sur reporta rendimientos entre 1.8 y 2.2 ton/ha.",
        "url": "#"
    },
]


@news_bp.route("/", methods=["GET"])
def get_news():
    try:
        news_file = current_app.config.get("NEWS_FILE", "")
        if news_file and os.path.exists(news_file):
            with open(news_file, "r", encoding="utf-8") as f:
                data = json.load(f)
                if isinstance(data, list) and len(data) > 0:
                    return jsonify(data)
    except:
        pass
    return jsonify(FALLBACK_NEWS)
