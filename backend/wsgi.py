import os
import sqlite3
from database import DB_PATH, seed_db, init_db
from app import app

# Automatically ensure database is initialized on production launch
def ensure_database_ready():
    if not os.path.exists(DB_PATH) or os.path.getsize(DB_PATH) == 0:
        print(f"Initializing and seeding production SQLite database at {DB_PATH}...")
        seed_db()
    else:
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM users")
            count = cursor.fetchone()[0]
            conn.close()
            if count == 0:
                print("Database tables empty. Seeding initial data...")
                seed_db()
        except Exception as e:
            print(f"Database check exception: {e}. Re-seeding database...")
            seed_db()

ensure_database_ready()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
