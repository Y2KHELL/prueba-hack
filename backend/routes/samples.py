import os
import json
import uuid
from flask import Blueprint, jsonify, request, current_app

samples_bp = Blueprint("samples", __name__)


def get_samples_path():
    return current_app.config.get("SAMPLES_FILE") or current_app.config.get("CAMPAIGNS_FILE", "").replace("campana_demo.json", "muestras.json")


def load_samples():
    path = get_samples_path()
    if path and os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    if os.path.exists(os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "muestras.json")):
        with open(os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "muestras.json"), "r", encoding="utf-8") as f:
            return json.load(f)
    return []


def save_samples(data):
    path = get_samples_path()
    if not path:
        path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "muestras.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


@samples_bp.route("/", methods=["GET"])
def list_samples():
    samples = load_samples()
    return jsonify(samples)


@samples_bp.route("/<sample_id>", methods=["GET"])
def get_sample(sample_id):
    samples = load_samples()
    sample = next((s for s in samples if s["id"] == sample_id), None)
    if not sample:
        return jsonify({"error": "Muestra no encontrada"}), 404
    return jsonify(sample)


@samples_bp.route("/", methods=["POST"])
def create_sample():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Datos requeridos"}), 400

    samples = load_samples()

    new_sample = {
        "id": f"muestra_{uuid.uuid4().hex[:8]}",
        "ingreso_id": data.get("ingreso_id", ""),
        "tipo_muestra": data.get("tipo_muestra", "visual"),
        "imagen_url": data.get("imagen_url", ""),
        "observaciones": data.get("observaciones", ""),
        "calidad": data.get("calidad", ""),
        "defectos": data.get("defectos", []),
        "fecha_evaluacion": data.get("fecha_evaluacion", ""),
        "evaluado_por": data.get("evaluado_por", ""),
    }

    samples.append(new_sample)
    save_samples(samples)

    return jsonify(new_sample), 201


@samples_bp.route("/<sample_id>", methods=["PUT"])
def update_sample(sample_id):
    data = request.get_json()
    samples = load_samples()

    for i, s in enumerate(samples):
        if s["id"] == sample_id:
            samples[i].update({k: v for k, v in data.items() if k != "id"})
            save_samples(samples)
            return jsonify(samples[i])

    return jsonify({"error": "Muestra no encontrada"}), 404
