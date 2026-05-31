import os
import json
from flask import Blueprint, jsonify, request, current_app

intakes_bp = Blueprint("intakes", __name__)


def load_intakes():
    path = current_app.config["INTAKES_FILE"]
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


def save_intakes(data):
    path = current_app.config["INTAKES_FILE"]
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


@intakes_bp.route("/", methods=["GET"])
def list_intakes():
    intakes = load_intakes()
    return jsonify(intakes)


@intakes_bp.route("/<intake_id>", methods=["GET"])
def get_intake(intake_id):
    intakes = load_intakes()
    intake = next((i for i in intakes if i["id"] == intake_id), None)
    if not intake:
        return jsonify({"error": "Ingreso no encontrado"}), 404
    return jsonify(intake)


@intakes_bp.route("/", methods=["POST"])
def create_intake():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Datos requeridos"}), 400

    intakes = load_intakes()

    new_intake = {
        "id": f"ing_{len(intakes) + 1:04d}",
        "productor": data.get("productor", ""),
        "finca": data.get("finca", ""),
        "lote": data.get("lote", ""),
        "cultivo": data.get("cultivo", ""),
        "variedad": data.get("variedad", ""),
        "peso_bruto": data.get("peso_bruto", 0),
        "peso_tara": data.get("peso_tara", 0),
        "peso_neto": data.get("peso_neto", 0),
        "fecha_ingreso": data.get("fecha_ingreso", ""),
        "hora_ingreso": data.get("hora_ingreso", ""),
        "estado": data.get("estado", "pendiente"),
        "muestra_id": None,
        "resultado_ia": None,
    }

    intakes.append(new_intake)
    save_intakes(intakes)

    return jsonify(new_intake), 201


@intakes_bp.route("/<intake_id>", methods=["PUT"])
def update_intake(intake_id):
    data = request.get_json()
    intakes = load_intakes()

    for i, intake in enumerate(intakes):
        if intake["id"] == intake_id:
            intakes[i].update({k: v for k, v in data.items() if k != "id"})
            save_intakes(intakes)
            return jsonify(intakes[i])

    return jsonify({"error": "Ingreso no encontrado"}), 404


@intakes_bp.route("/<intake_id>", methods=["DELETE"])
def delete_intake(intake_id):
    intakes = load_intakes()
    intakes = [i for i in intakes if i["id"] != intake_id]
    save_intakes(intakes)
    return jsonify({"message": "Ingreso eliminado"})
