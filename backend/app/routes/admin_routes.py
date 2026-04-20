from flask import Blueprint, jsonify
from psycopg2.extras import RealDictCursor
from app.extensions import get_db_connection
from app.utils.auth import admin_required

admin_bp = Blueprint("admin", __name__)


@admin_bp.route("/users", methods=["GET"])
@admin_required
def get_all_users():
    """Return all users (id, username, email, role, created_at) — NO passwords."""
    conn = None
    cursor = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            SELECT id, username, email, role, created_at
            FROM users
            ORDER BY id ASC
        """)

        users = cursor.fetchall()

        # Serialize datetime for JSON
        result = []
        for u in users:
            result.append({
                "id": u["id"],
                "username": u["username"],
                "email": u["email"],
                "role": u["role"],
                "created_at": u["created_at"].isoformat() if u.get("created_at") else None,
            })

        return jsonify(result), 200

    except Exception as e:
        return jsonify({
            "error": "Failed to fetch users",
            "details": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@admin_bp.route("/stats", methods=["GET"])
@admin_required
def get_stats():
    """Return dashboard statistics."""
    conn = None
    cursor = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("SELECT COUNT(*) as count FROM users")
        user_count = cursor.fetchone()["count"]

        cursor.execute("SELECT COUNT(*) as count FROM videos")
        video_count = cursor.fetchone()["count"]

        cursor.execute("""
            SELECT category, COUNT(*) as count 
            FROM videos 
            GROUP BY category 
            ORDER BY count DESC
        """)
        categories = cursor.fetchall()

        return jsonify({
            "total_users": user_count,
            "total_videos": video_count,
            "categories": [{"name": c["category"], "count": c["count"]} for c in categories],
        }), 200

    except Exception as e:
        return jsonify({
            "error": "Failed to fetch stats",
            "details": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
