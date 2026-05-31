import os
import json
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, origins=app.config["CORS_ORIGINS"])

    from routes.campaigns import campaigns_bp
    from routes.intakes import intakes_bp
    from routes.samples import samples_bp
    from routes.reports import reports_bp
    from routes.chat import chat_bp
    from routes.climate import climate_bp
    from routes.news import news_bp

    app.register_blueprint(campaigns_bp, url_prefix="/api/campaigns")
    app.register_blueprint(intakes_bp, url_prefix="/api/intakes")
    app.register_blueprint(samples_bp, url_prefix="/api/samples")
    app.register_blueprint(reports_bp, url_prefix="/api/reports")
    app.register_blueprint(chat_bp, url_prefix="/api/chat")
    app.register_blueprint(climate_bp, url_prefix="/api/climate")
    app.register_blueprint(news_bp, url_prefix="/api/news")

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(
        host=Config.FLASK_HOST,
        port=Config.FLASK_PORT,
        debug=Config.FLASK_DEBUG,
    )
