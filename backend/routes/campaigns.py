import os
import json
from flask import Blueprint, jsonify, request, current_app

campaigns_bp = Blueprint("campaigns", __name__)


def load_campaigns():
    path = current_app.config["CAMPAIGNS_FILE"]
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data if isinstance(data, list) else []
    return []


def save_campaigns(data):
    path = current_app.config["CAMPAIGNS_FILE"]
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

@campaigns_bp.route("/", methods=["GET"])
def list_campaigns():
    return jsonify(load_campaigns())

@campaigns_bp.route("/<campaign_id>", methods=["GET"])
def get_campaign(campaign_id):
    campaigns = load_campaigns()
    campaign = next((c for c in campaigns if c["id"] == campaign_id), None)
    if not campaign:
        return jsonify({"error": "Campaña no encontrada"}), 404
    return jsonify(campaign)

@campaigns_bp.route("/", methods=["POST"])
def create_campaign():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Datos requeridos"}), 400

    campaigns = load_campaigns()
    new_id = f"CAM-{len(campaigns) + 1:04d}"

    new_campaign = {
        "id": new_id,
        "nombre": data.get("nombre", ""),
        "zona": data.get("zona", ""),
        "hectareas": data.get("hectareas", 0),
        "cultivo": data.get("cultivo", "soya"),
        "tipoSuelo": data.get("tipoSuelo", "Medio"),
        "semilla": data.get("semilla", ""),
        "fechaSiembra": data.get("fechaSiembra", ""),
        "fecha_inicio": data.get("fecha_inicio", ""),
        "fecha_fin": data.get("fecha_fin", ""),
        "estado": data.get("estado", "activa"),
        "lotes": data.get("lotes", []),
        "costos": data.get("costos", {}),
        "rentabilidad": data.get("rentabilidad", {}),
        "clima": data.get("clima", {}),
    }

    campaigns.append(new_campaign)
    save_campaigns(campaigns)
    return jsonify(new_campaign), 201

@campaigns_bp.route("/<campaign_id>", methods=["PUT"])
def update_campaign(campaign_id):
    data = request.get_json()
    campaigns = load_campaigns()
    for i, c in enumerate(campaigns):
        if c["id"] == campaign_id:
            campaigns[i].update({k: v for k, v in data.items() if k != "id"})
            save_campaigns(campaigns)
            return jsonify(campaigns[i])
    return jsonify({"error": "Campaña no encontrada"}), 404

@campaigns_bp.route("/<campaign_id>", methods=["DELETE"])
def delete_campaign(campaign_id):
    campaigns = load_campaigns()
    campaigns = [c for c in campaigns if c["id"] != campaign_id]
    save_campaigns(campaigns)
    return jsonify({"message": "Campaña eliminada"})
