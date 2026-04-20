import os
from dotenv import load_dotenv
import psycopg2
import sys

# Load .env
load_dotenv()

host = os.getenv("DB_HOST", "localhost")
port = os.getenv("DB_PORT", "5432")
user = os.getenv("DB_USER", "postgres")
password = os.getenv("DB_PASSWORD", "")
dbname = os.getenv("DB_NAME", "postgres")

print(f"Testing connection with:")
print(f"  Host: {host}")
print(f"  Port: {port}")
print(f"  User: {user}")
print(f"  Password (repr): {repr(password)}")
print(f"  DB Name: {dbname}")

try:
    conn = psycopg2.connect(
        host=host,
        port=port,
        user=user,
        password=password,
        dbname=dbname,
        connect_timeout=3
    )
    print("SUCCESS!")
    conn.close()
except Exception as e:
    print(f"FAILED: {repr(e)}")
