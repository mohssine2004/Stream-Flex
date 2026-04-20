import psycopg2
import sys

def check_port(port):
    print(f"Checking port {port}...")
    try:
        conn = psycopg2.connect(
            host="127.0.0.1",
            port=port,
            user="postgres",
            password="sousou2004",
            dbname="postgres",
            connect_timeout=3
        )
        print(f"  Connection successful to port {port}!")
        cursor = conn.cursor()
        cursor.execute("SELECT datname FROM pg_database WHERE datistemplate = false;")
        dbs = [row[0] for row in cursor.fetchall()]
        print(f"  Databases: {dbs}")
        conn.close()
    except Exception as e:
        print(f"  Failed on port {port}: {repr(e)}")

check_port(5432)
check_port(5433)
