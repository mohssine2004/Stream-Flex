import os
from dotenv import load_dotenv

load_dotenv(override=True)

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-secret-key")

    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = os.getenv("DB_PORT", "5432")
    print(f"DEBUG: Config Loaded -> {DB_HOST}:{DB_PORT}")
    DB_NAME = os.getenv("DB_NAME", "streaming_db")
    DB_USER = os.getenv("DB_USER", "postgres")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "")

    SQLALCHEMY_DATABASE_URI = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    MINIO_BASE_URL = os.getenv("MINIO_BASE_URL", "http://localhost:9000/videos")

    # Allow uploads up to 500MB
    MAX_CONTENT_LENGTH = 500 * 1024 * 1024