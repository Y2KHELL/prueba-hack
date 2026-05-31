import requests
import time
import concurrent.futures
from flask import Blueprint, jsonify

climate_bp = Blueprint("climate", __name__)

CACHE = {"data": None, "timestamp": 0}
CACHE_TTL = 600

ZONAS_SOYA = {
    "cuatro_canadas": {"nombre": "Cuatro Canadas", "region": "Este", "lat": -17.45, "lon": -62.95, "hectareas": 120000, "rendimiento": 2.5},
    "pailon": {"nombre": "Pailon", "region": "Este", "lat": -17.55, "lon": -62.85, "hectareas": 85000, "rendimiento": 2.3},
    "san_julian": {"nombre": "San Julian", "region": "Este", "lat": -17.22, "lon": -62.85, "hectareas": 70000, "rendimiento": 2.2},
    "san_jose": {"nombre": "San Jose de Chiquitos", "region": "Este", "lat": -17.85, "lon": -60.75, "hectareas": 45000, "rendimiento": 2.0},
    "el_puente": {"nombre": "El Puente", "region": "Este", "lat": -16.10, "lon": -62.70, "hectareas": 25000, "rendimiento": 1.8},
    "okinawa": {"nombre": "Okinawa", "region": "Norte", "lat": -17.25, "lon": -63.05, "hectareas": 30000, "rendimiento": 2.8},
    "san_pedro": {"nombre": "San Pedro", "region": "Norte", "lat": -17.25, "lon": -63.13, "hectareas": 55000, "rendimiento": 2.4},
    "montero": {"nombre": "Montero", "region": "Norte", "lat": -17.34, "lon": -63.02, "hectareas": 65000, "rendimiento": 2.3},
    "fernandez": {"nombre": "Fernandez Alonso", "region": "Norte", "lat": -17.20, "lon": -63.15, "hectareas": 20000, "rendimiento": 2.2},
    "mineros": {"nombre": "Mineros", "region": "Norte", "lat": -17.10, "lon": -63.10, "hectareas": 18000, "rendimiento": 2.1},
    "general_saavedra": {"nombre": "General Saavedra", "region": "Norte", "lat": -17.10, "lon": -63.20, "hectareas": 22000, "rendimiento": 2.2},
    "santa_rosa_sara": {"nombre": "Santa Rosa del Sara", "region": "Norte", "lat": -17.15, "lon": -63.45, "hectareas": 15000, "rendimiento": 2.0},
    "cabezas": {"nombre": "Cabezas", "region": "Sur", "lat": -17.80, "lon": -63.30, "hectareas": 90000, "rendimiento": 2.1},
    "charagua": {"nombre": "Charagua", "region": "Sur", "lat": -19.80, "lon": -63.20, "hectareas": 50000, "rendimiento": 1.8},
    "gutierrez": {"nombre": "Gutierrez", "region": "Sur", "lat": -18.10, "lon": -63.40, "hectareas": 35000, "rendimiento": 1.9},
}

FALLBACK_CLIMA = {"temperatura": 28, "sensacion": 30, "humedad": 65, "viento": 12, "condicion": "Nublado"}


def fetch_one(key, zona):
    try:
        query = f"{zona['nombre']},Santa+Cruz,Bolivia"
        r = requests.get(f"https://wttr.in/{query}?format=j1", timeout=5)
        if r.status_code == 200:
            d = r.json()
            actual = d["current_condition"][0]
            clima = {
                "temperatura": int(actual["temp_C"]),
                "sensacion": int(actual["FeelsLikeC"]),
                "humedad": int(actual["humidity"]),
                "viento": int(actual["windspeedKmph"]),
                "condicion": actual["weatherDesc"][0]["value"],
            }
        else:
            clima = dict(FALLBACK_CLIMA)
    except:
        clima = dict(FALLBACK_CLIMA)
    return {
        "id": key,
        "nombre": zona["nombre"],
        "region": zona["region"],
        "hectareas": zona["hectareas"],
        "rendimiento": zona["rendimiento"],
        "clima": clima,
    }


def fetch_all_parallel():
    with concurrent.futures.ThreadPoolExecutor(max_workers=15) as executor:
        futures = {executor.submit(fetch_one, key, zona): key for key, zona in ZONAS_SOYA.items()}
        results = []
        for future in concurrent.futures.as_completed(futures):
            results.append(future.result())
    return results


@climate_bp.route("/zones", methods=["GET"])
def get_zones():
    return jsonify(ZONAS_SOYA)


@climate_bp.route("/weather/<zona>", methods=["GET"])
def get_weather(zona):
    zona_data = ZONAS_SOYA.get(zona)
    if not zona_data:
        return jsonify({"error": "Zona no encontrada"}), 404
    return jsonify(fetch_one(zona, zona_data))


@climate_bp.route("/weather-all", methods=["GET"])
def get_weather_all():
    global CACHE
    now = time.time()
    if CACHE["data"] and (now - CACHE["timestamp"]) < CACHE_TTL:
        return jsonify(CACHE["data"])
    data = fetch_all_parallel()
    CACHE["data"] = data
    CACHE["timestamp"] = now
    return jsonify(data)
