import os
from dotenv import load_dotenv
import psycopg2

load_dotenv(override=True)

def update_video():
    try:
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST", "127.0.0.1"),
            port=os.getenv("DB_PORT", "5434"),
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD", "sousou2004"),
            dbname=os.getenv("DB_NAME", "streaming_db")
        )
        cursor = conn.cursor()
        cursor.execute("UPDATE videos SET video_object_name='https://vjs.zencdn.net/v/oceans.mp4' WHERE id=6")
        conn.commit()
        print("VIDEO 6 UPDATED TO OCEANS.MP4")
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    update_video()
