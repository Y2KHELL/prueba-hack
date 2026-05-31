from flask import Blueprint, jsonify, request
from services.gemini_service import analyze_image
from services.penalty_service import calculate_penalty

reports_bp = Blueprint("reports", __name__)


@reports_bp.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    if not data or "image_url" not in data:
        return jsonify({"error": "Se requiere image_url"}), 400

    image_url = data["image_url"]
    cultivo = data.get("cultivo", "general")

    result = analyze_image(image_url, cultivo)

    if result.get("penalty"):
        penalty_info = calculate_penalty(
            result["calidad"],
            result.get("defectos", []),
            cultivo,
        )
        result["penalty_info"] = penalty_info

    return jsonify(result)


@reports_bp.route("/summary", methods=["GET"])
def summary():
    from flask import current_app
    import json
    import os

    intakes_file = current_app.config["INTAKES_FILE"]
    if os.path.exists(intakes_file):
        with open(intakes_file, "r", encoding="utf-8") as f:
            intakes = json.load(f)
    else:
        intakes = []

    total = len(intakes)
    aprobados = len([i for i in intakes if i.get("estado") == "aprobado"])
    rechazados = len([i for i in intakes if i.get("estado") == "rechazado"])
    pendientes = len([i for i in intakes if i.get("estado") == "pendiente"])

    return jsonify({
        "total_ingresos": total,
        "aprobados": aprobados,
        "rechazados": rechazados,
        "pendientes": pendientes,
        "tasa_aprobacion": round(aprobados / total * 100, 1) if total > 0 else 0,
    })


@reports_bp.route("/penalty", methods=["POST"])
def penalty():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Datos requeridos"}), 400

    result = calculate_penalty(
        data.get("calidad", ""),
        data.get("defectos", []),
        data.get("cultivo", ""),
    )

    return jsonify(result)
