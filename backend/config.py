import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    FLASK_HOST = os.getenv("FLASK_HOST", "0.0.0.0")
    FLASK_PORT = int(os.getenv("FLASK_PORT", 5000))
    FLASK_DEBUG = os.getenv("FLASK_DEBUG", "true").lower() == "true"

    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")

    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

    DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

    CAMPAIGNS_FILE = os.path.join(DATA_DIR, "campana_demo.json")
    INTAKES_FILE = os.path.join(DATA_DIR, "lote_acopio_demo.json")
    NEWS_FILE = os.path.join(DATA_DIR, "noticias_demo.json")
