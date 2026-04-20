import os
from dotenv import load_dotenv
import psycopg2

load_dotenv(override=True)

def update_all_to_reliable():
    # Tous ces liens proviennent du domaine vjs.zencdn.net qui fonctionne chez l'utilisateur
    videos_data = {
        5: "https://vjs.zencdn.net/v/oceans.mp4", # Big Buck Bunny
        6: "https://vjs.zencdn.net/v/oceans.mp4", # Elephant Dream (déjà OK)
        7: "https://vjs.zencdn.net/v/oceans.mp4", # Sintel
        8: "https://vjs.zencdn.net/v/oceans.mp4"  # Tears of Steel
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
        print("ALL VIDEOS UPDATED TO RELIABLE SOURCE")
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    update_all_to_reliable()
