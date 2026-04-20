import os
from dotenv import load_dotenv
import psycopg2

load_dotenv()

def check_db():
    try:
        conn = psycopg2.connect(
            host=os.getenv("DB_HOST", "localhost"),
            port=os.getenv("DB_PORT", "5434"),
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD", "sousou2004"),
            dbname=os.getenv("DB_NAME", "streaming_db")
        )
        cursor = conn.cursor()
        
        # Check tables
        cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
        tables = [t[0] for t in cursor.fetchall()]
        print(f"Tables: {tables}")
        
        # Check users columns if exists
        if 'users' in tables:
            cursor.execute("SELECT column_name FROM information_schema.columns WHERE table_name='users'")
            columns = [c[0] for c in cursor.fetchall()]
            print(f"Users columns: {columns}")
            
            cursor.execute("SELECT count(*) FROM users")
            count = cursor.fetchone()[0]
            print(f"Users count: {count}")
            
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_db()
