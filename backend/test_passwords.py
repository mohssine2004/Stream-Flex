import psycopg2
import sys

passwords = ["sousou2004", " sousou2004", "Sousou2004", "postgres", "admin"]
ports = [5432, 5433]

for port in ports:
    for pwd in passwords:
        try:
            conn = psycopg2.connect(
                host="127.0.0.1",
                port=port,
                user="postgres",
                password=pwd,
                dbname="postgres",
                connect_timeout=1
            )
            print(f"SUCCESS: port={port}, password='{pwd}'")
            conn.close()
            sys.exit(0)
        except Exception:
            pass

print("ALL FAILED")
