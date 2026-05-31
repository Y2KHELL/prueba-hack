PENALTY_RULES = {
    "cafe": {
        "defectos_graves": ["hongos", "pudricion", "insectos", "moho"],
        "defectos_menores": ["manchas", "deformidad", "tamano_irregular"],
        "penalizacion_grave": 40,
        "penalizacion_menor": 15,
    },
    "cacao": {
        "defectos_graves": ["moho", "fermentacion_deficiente", "insectos"],
        "defectos_menores": ["color_irregular", "tamano_pequeno", "defectos_superficiales"],
        "penalizacion_grave": 35,
        "penalizacion_menor": 12,
    },
    "platano": {
        "defectos_graves": ["pudricion", "golpe_severo", "insectos"],
        "defectos_menores": ["manchas", "madurez_excesiva", "golpe_menor"],
        "penalizacion_grave": 45,
        "penalizacion_menor": 10,
    },
    "soya": {
        "defectos_graves": ["moho", "pudricion", "insectos", "germinacion"],
        "defectos_menores": ["partido", "manchado", "impurezas", "quemado"],
        "penalizacion_grave": 30,
        "penalizacion_menor": 10,
        "humedad_maxima": 14.0,
        "humedad_penalty_per_pct": 2.5,
    },
    "general": {
        "defectos_graves": ["pudricion", "hongos", "insectos"],
        "defectos_menores": ["manchas", "deformidad", "tamano_irregular"],
        "penalizacion_grave": 35,
        "penalizacion_menor": 10,
    },
}

QUALITY_MULTIPLIER = {
    "excelente": 1.0,
    "buena": 0.95,
    "regular": 0.75,
    "mala": 0.5,
}


def calculate_penalty(
    calidad: str, defectos: list[str], cultivo: str = "general", humedad: float | None = None
) -> dict:
    rules = PENALTY_RULES.get(cultivo, PENALTY_RULES["general"])

    penalizacion_total = 0
    defectos_encontrados = {"graves": [], "menores": []}

    for defecto in defectos:
        defecto_lower = defecto.lower()
        if defecto_lower in rules["defectos_graves"]:
            penalizacion_total += rules["penalizacion_grave"]
            defectos_encontrados["graves"].append(defecto)
        elif defecto_lower in rules["defectos_menores"]:
            penalizacion_total += rules["penalizacion_menor"]
            defectos_encontrados["menores"].append(defecto)

    if humedad is not None and cultivo == "soya":
        humedad_max = rules.get("humedad_maxima", 14.0)
        penalty_per_pct = rules.get("humedad_penalty_per_pct", 2.5)
        if humedad > humedad_max:
            exceso = humedad - humedad_max
            penalizacion_total += int(exceso * penalty_per_pct)

    quality_mult = QUALITY_MULTIPLIER.get(calidad, 0.8)
    penalizacion_final = min(100, int(penalizacion_total * quality_mult))

    if penalizacion_final >= 50:
        descuento_porcentaje = 30
        recomendacion = "rechazar_lote"
    elif penalizacion_final >= 25:
        descuento_porcentaje = 15
        recomendacion = "descuento_parcial"
    elif penalizacion_final > 0:
        descuento_porcentaje = 5
        recomendacion = "descuento_menor"
    else:
        descuento_porcentaje = 0
        recomendacion = "sin_penalizacion"

    return {
        "penalizacion_puntos": penalizacion_final,
        "descuento_porcentaje": descuento_porcentaje,
        "recomendacion": recomendacion,
        "defectos_graves": defectos_encontrados["graves"],
        "defectos_menores": defectos_encontrados["menores"],
        "total_defectos": len(defectos),
        "cultivo_evaluado": cultivo,
    }
