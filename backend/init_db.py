import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def init_db():
    conn = psycopg2.connect(
        host=os.getenv("DB_HOST", "localhost"),
        port=os.getenv("DB_PORT", "5434"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", "sousou2004"),
        dbname=os.getenv("DB_NAME", "streaming_db")
    )
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role VARCHAR(50) DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)
    
    # Create videos table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS videos (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            thumbnail_url TEXT,
            video_object_name TEXT NOT NULL,
            duration INTEGER,
            category VARCHAR(100)
        );
    """)
    
    conn.commit()
    cursor.close()
    conn.close()
    print("Database initialized successfully!")

if __name__ == "__main__":
    init_db()
