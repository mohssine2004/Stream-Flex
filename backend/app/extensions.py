from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
import psycopg2
from flask import current_app

db = SQLAlchemy()
migrate = Migrate()
cors = CORS()

def get_db_connection():
    return psycopg2.connect(
        host=current_app.config["DB_HOST"],
        port=current_app.config["DB_PORT"],
        dbname=current_app.config["DB_NAME"],
        user=current_app.config["DB_USER"],
        password=current_app.config["DB_PASSWORD"]
    )