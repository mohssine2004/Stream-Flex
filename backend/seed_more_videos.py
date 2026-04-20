import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def seed_more_data():
    try:
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST", "localhost"),
            port=os.getenv("DB_PORT", "5434"),
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD", "sousou2004"),
            dbname=os.getenv("DB_NAME", "streaming_db")
        )
        cursor = conn.cursor()

        more_videos = [
            (
                "For Bigger Blazes",
                "Une démonstration spectaculaire des capacités de Chromecast à travers des images haute qualité.",
                "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=800&q=80",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                120,
                "Recently Added"
            ),
            (
                "For Bigger Escapes",
                "Évadez-vous avec ce court métrage haut en couleur qui met en valeur le streaming haute définition.",
                "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
                180,
                "Recently Added"
            ),
            (
                "For Bigger Fun",
                "Un voyage joyeux et coloré conçu pour démontrer la qualité du streaming vidéo moderne.",
                "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800&q=80",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
                180,
                "Recently Added"
            ),
            (
                "For Bigger Joyrides",
                "Embarquez pour une balade visuellement saisissante à travers des paysages variés.",
                "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
                180,
                "Recommended"
            ),
            (
                "For Bigger Meltdowns",
                "Une explosion d'émotions et de couleurs dans ce court métrage dynamique.",
                "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
                180,
                "Recommended"
            ),
            (
                "Subaru Outback On Street And Dirt",
                "Aventure tout-terrain à travers des paysages naturels époustouflants.",
                "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
                60,
                "Recommended"
            ),
            (
                "Volkswagen GTI Review",
                "Un essai détaillé d'une voiture iconique, filmé avec une qualité cinématographique.",
                "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
                60,
                "Trending"
            ),
            (
                "We Are Going On Bullrun",
                "Suivez l'aventure d'un rallye automobile international à travers plusieurs pays.",
                "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80",
                "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
                60,
                "Popular"
            )
        ]

        cursor.executemany("""
            INSERT INTO videos (title, description, thumbnail_url, video_object_name, duration, category)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, more_videos)

        conn.commit()
        cursor.close()
        conn.close()
        print("8 nouvelles vidéos ajoutées avec succès (total = 12) !")
    
    except Exception as e:
        print(f"Erreur lors de l'ajout : {e}")

if __name__ == "__main__":
    seed_more_data()
