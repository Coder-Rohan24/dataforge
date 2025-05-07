import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings:
    DATA_DIR = BASE_DIR / "data"
    MODEL_DIR = BASE_DIR / "saved_models"
    ALLOWED_EXTENSIONS = ['csv', 'json']

    SQL_CONNECTION_STRING = os.getenv("SQL_URI", "sqlite:///example.db")

settings = Settings()
