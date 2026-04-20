import os
from dotenv import load_dotenv
import psycopg2

load_dotenv(override=True)

# Tous les films utilisent des sources fiables (vjs.zencdn.net pour la vidéo, picsum.photos pour les images)
new_videos = [
    # TRENDING
    {
        "title": "Cosmos Journey",
        "description": "Un astronaute solitaire explore les confins de l'univers à la recherche d'une nouvelle Terre habitable.",
        "thumbnail_url": "https://picsum.photos/seed/cosmos1/800/450",
        "video_object_name": "https://vjs.zencdn.net/v/oceans.mp4",
        "duration": 5400,
        "category": "Trending"
    },
    {
        "title": "Dark Horizon",
        "description": "Une équipe de scientifiques découvre un signal extraterrestre venant du fond de l'océan.",
        "thumbnail_url": "https://picsum.photos/seed/dark2/800/450",
        "video_object_name": "https://vjs.zencdn.net/v/oceans.mp4",
        "duration": 6200,
        "category": "Trending"
    },
    {
        "title": "Neon City",
        "description": "Dans une mégalopole futuriste, un détective enquête sur la disparition mystérieuse de citoyens.",
        "thumbnail_url": "https://picsum.photos/seed/neon3/800/450",
        "video_object_name": "https://vjs.zencdn.net/v/oceans.mp4",
        "duration": 4800,
        "category": "Trending"
    },
    {
        "title": "Soleil Noir",
        "description": "Après une éclipse permanente, une communauté survit dans l'obscurité totale en cherchant la lumière.",
        "thumbnail_url": "https://picsum.photos/seed/soleil4/800/450",
        "video_object_name": "https://vjs.zencdn.net/v/oceans.mp4",
        "duration": 5900,
        "category": "Trending"
    },

    # POPULAR
    {
        "title": "The Last Forest",
        "description": "Un militant écolo part seul en expédition pour sauver la dernière forêt primaire de la planète.",
        "thumbnail_url": "https://picsum.photos/seed/forest5/800/450",
        "video_object_name": "https://vjs.zencdn.net/v/oceans.mp4",
        "duration": 7200,
        "category": "Popular"
    },
    {
        "title": "Mémoire Vive",
        "description": "Un homme amnésique reconstitue sa vie passée à travers des fragments de souvenirs digitaux.",
        "thumbnail_url": "https://picsum.photos/seed/memory6/800/450",
        "video_object_name": "https://vjs.zencdn.net/v/oceans.mp4",
        "duration": 5100,
        "category": "Popular"
    },
    {
        "title": "Arctic Storm",
        "description": "Une équipe de chercheurs piégée dans le cercle polaire arctique lutte pour survivre à une tempête record.",
        "thumbnail_url": "https://picsum.photos/seed/arctic7/800/450",
        "video_object_name": "https://vjs.zencdn.net/v/oceans.mp4",
        "duration": 6500,
        "category": "Popular"
    },
    {
        "title": "Quantum Leap",
        "description": "Un physicien invente un appareil permettant de sauter d'une réalité parallèle à une autre.",
        "thumbnail_url": "https://picsum.photos/seed/quantum8/800/450",
        "video_object_name": "https://vjs.zencdn.net/v/oceans.mp4",
        "duration": 5700,
        "category": "Popular"
    },

    # RECENTLY ADDED
    {
        "title": "Désert Bleu",
        "description": "Un road-trip épique à travers le Sahara au volant d'une voiture électrique sans recharge.",
        "thumbnail_url": "https://picsum.photos/seed/desert9/800/450",
        "video_object_name": "https://vjs.zencdn.net/v/oceans.mp4",
        "duration": 4500,
        "category": "Recently Added"
    },
    {
        "title": "Iron Silence",
        "description": "Un soldat revient de guerre et tente de se reconstruire dans un village de montagne isolé.",
        "thumbnail_url": "https://picsum.photos/seed/iron10/800/450",
        "video_object_name": "https://vjs.zencdn.net/v/oceans.mp4",
        "duration": 6800,
        "category": "Recently Added"
    },
    {
        "title": "Nova Rising",
        "description": "Une jeune astronome découvre une supernova menaçant la Terre et tente d'alerter les autorités.",
        "thumbnail_url": "https://picsum.photos/seed/nova11/800/450",
        "video_object_name": "https://vjs.zencdn.net/v/oceans.mp4",
        "duration": 5300,
        "category": "Recently Added"
    },
    {
        "title": "Echo Valley",
        "description": "Dans une vallée mystérieuse, tous les sons du passé résonnent encore et influencent le présent.",
        "thumbnail_url": "https://picsum.photos/seed/echo12/800/450",
        "video_object_name": "https://vjs.zencdn.net/v/oceans.mp4",
        "duration": 4900,
        "category": "Recently Added"
    },

    # RECOMMENDED
    {
        "title": "La Dernière Vague",
        "description": "Un surfeur professionnel affronte la vague la plus dangereuse jamais surfée dans l'histoire.",
        "thumbnail_url": "https://picsum.photos/seed/wave13/800/450",
        "video_object_name": "https://vjs.zencdn.net/v/oceans.mp4",
        "duration": 5600,
        "category": "Recommended"
    },
    {
        "title": "Ghost Protocol",
        "description": "Une agente secrète infiltre une organisation criminelle internationale depuis l'intérieur.",
        "thumbnail_url": "https://picsum.photos/seed/ghost14/800/450",
        "video_object_name": "https://vjs.zencdn.net/v/oceans.mp4",
        "duration": 7100,
        "category": "Recommended"
    },
    {
        "title": "Pale Blue Dot",
        "description": "Un documentaire poignant sur la fragilité de notre planète vue depuis l'espace lointain.",
        "thumbnail_url": "https://picsum.photos/seed/pale15/800/450",
        "video_object_name": "https://vjs.zencdn.net/v/oceans.mp4",
        "duration": 3900,
        "category": "Recommended"
    },
    {
        "title": "Mirage",
        "description": "Un photographe perd ses repères dans le désert du Namib et se retrouve confronté à ses peurs.",
        "thumbnail_url": "https://picsum.photos/seed/mirage16/800/450",
        "video_object_name": "https://vjs.zencdn.net/v/oceans.mp4",
        "duration": 4600,
        "category": "Recommended"
    },
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

    insert_query = """
        INSERT INTO videos (title, description, thumbnail_url, video_object_name, duration, category)
        VALUES (%s, %s, %s, %s, %s, %s)
    """
    
    for v in new_videos:
        cursor.execute(insert_query, (
            v["title"], v["description"], v["thumbnail_url"],
            v["video_object_name"], v["duration"], v["category"]
        ))
        print(f"[+] Ajouté : {v['title']} ({v['category']})")

    conn.commit()
    print(f"\n✅ {len(new_videos)} films ajoutés avec succès !")
    cursor.close()
    conn.close()

except Exception as e:
    print(f"Erreur : {e}")
