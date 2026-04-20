import os
from dotenv import load_dotenv
import psycopg2

load_dotenv(override=True)

def update_all():
    videos_data = {
        5: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        7: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        8: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
    }
    
    try:
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST", "127.0.0.1"),
            port=os.getenv("DB_PORT", "5434"),
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD", "sousou2004"),
            dbname=os.getenv("DB_NAME", "streaming_db")
        )
        cursor = conn.cursor()
        for vid, url in videos_data.items():
            cursor.execute("UPDATE videos SET video_object_name=%s WHERE id=%s", (url, vid))
        conn.commit()
        print("ALL VIDEOS UPDATED SUCCESSFULLY")
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    update_all()
