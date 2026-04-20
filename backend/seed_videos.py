import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def seed_data():
    try:
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST", "localhost"),
            port=os.getenv("DB_PORT", "5434"),
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD", "sousou2004"),
            dbname=os.getenv("DB_NAME", "streaming_db")
        )
        cursor = conn.cursor()

        # On vide la table pour remettre les bons liens
        cursor.execute("DELETE FROM videos;")

        videos = [
            (
                "Big Buck Bunny",
                "Un lapin géant et débonnaire se réveille pour découvrir trois rongeurs qui le harcèlent.",
                "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&q=80",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                600,
                "Trending"
            ),
            (
                "Elephant Dream",
                "Deux personnages explorent un univers mécanique étrange et onirique.",
                "https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=800&q=80",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                660,
                "Trending"
            ),
            (
                "Sintel",
                "Une jeune femme part à la recherche d'un dragon qu'elle a perdu.",
                "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800&q=80",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
                900,
                "Popular"
            ),
            (
                "Tears of Steel",
                "Dans un futur dystopique, une équipe tente de sauver le monde.",
                "https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=800&q=80",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
                720,
                "Popular"
            )
        ]

        cursor.executemany("""
            INSERT INTO videos (title, description, thumbnail_url, video_object_name, duration, category)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, videos)

        conn.commit()
        cursor.close()
        conn.close()
        print("Vidéos avec liens directs ajoutées avec succès !")
    
    except Exception as e:
        print(f"Erreur lors du seeding : {e}")

if __name__ == "__main__":
    seed_data()
