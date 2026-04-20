import os
from dotenv import load_dotenv
import psycopg2

load_dotenv(override=True)

# Nouvelles thumbnails depuis picsum.photos - très fiables et accessibles partout
updates = [
    (5, "https://picsum.photos/seed/bigbuck/800/450",  "Big Buck Bunny"),
    (6, "https://picsum.photos/seed/elephant/800/450", "Elephant Dream"),
    (7, "https://picsum.photos/seed/sintel77/800/450", "Sintel"),
    (8, "https://picsum.photos/seed/tears88/800/450",  "Tears of Steel"),
]

try:
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST", "127.0.0.1"),
        port=os.getenv("DB_PORT", "5434"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", "sousou2004"),
        dbname=os.getenv("DB_NAME", "streaming_db")
    )
    cursor = conn.cursor()
    for vid_id, thumb, name in updates:
        cursor.execute("UPDATE videos SET thumbnail_url=%s WHERE id=%s", (thumb, vid_id))
        print(f"Updated thumbnail for {name} (ID {vid_id})")
    conn.commit()
    print("\nDone!")
    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
