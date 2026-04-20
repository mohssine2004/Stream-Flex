import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

conn = psycopg2.connect(
    host=os.getenv("DB_HOST", "localhost"),
    port=os.getenv("DB_PORT", "5434"),
    user=os.getenv("DB_USER", "postgres"),
    password=os.getenv("DB_PASSWORD", "sousou2004"),
    dbname=os.getenv("DB_NAME", "streaming_db")
)

cursor = conn.cursor()
cursor.execute("""
    UPDATE videos 
    SET thumbnail_url = 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Big_buck_bunny_poster_big.jpg' 
    WHERE id = 1
""")
conn.commit()
print("Updated Big Buck Bunny thumbnail")
cursor.close()
conn.close()
