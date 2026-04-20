import sys

from app.extensions import get_db_connection
from app import create_app
import psycopg2.extras

app = create_app()
with app.app_context():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute("SELECT COUNT(*) FROM videos")
        result = cursor.fetchone()
        print(f"Number of videos in DB: {result['count']}")
        cursor.close()
        conn.close()
    except Exception as e:
        # Just print the repr to avoid decode issues
        print(f"Error checking DB (repr): {repr(e)}")
