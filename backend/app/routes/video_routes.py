from flask import Blueprint, jsonify, current_app, request
from psycopg2.extras import RealDictCursor
from app.extensions import get_db_connection
from app.utils.auth import token_required

video_bp = Blueprint("videos", __name__)


def build_video_response(row):
    return {
        "id": row["id"],
        "title": row["title"],
        "description": row["description"],
        "thumbnail_url": row["thumbnail_url"],
<<<<<<< HEAD
        "video_url": row["video_object_name"] if row["video_object_name"].startswith(("http://", "https://")) else f"{current_app.config['MINIO_BASE_URL']}/{row['video_object_name']}",
=======
        "video_url": f"{current_app.config['MINIO_BASE_URL']}/{row['video_object_name']}",
>>>>>>> 7242f513ee0938e42e40502b2d03d404a0a05b9d
        "duration": row["duration"],
        "category": row["category"]
    }


def validate_video_payload(data, partial=False):
    required_fields = [
        "title",
        "description",
        "thumbnail_url",
        "video_object_name",
        "duration",
        "category"
    ]

    if not data:
        return "Request body is missing"

    if not partial:
        for field in required_fields:
            if field not in data:
                return f"Missing field: {field}"

    if "title" in data and not str(data["title"]).strip():
        return "title cannot be empty"

    if "video_object_name" in data and not str(data["video_object_name"]).strip():
        return "video_object_name cannot be empty"

    if "duration" in data:
        try:
            duration = int(data["duration"])
            if duration <= 0:
                return "duration must be greater than 0"
        except (ValueError, TypeError):
            return "duration must be an integer"

    return None


@video_bp.route("/", methods=["GET"])
def get_videos():
    conn = None
    cursor = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            SELECT id, title, description, thumbnail_url, video_object_name, duration, category
            FROM videos
            ORDER BY id ASC
        """)

        rows = cursor.fetchall()
        videos = [build_video_response(row) for row in rows]

        return jsonify(videos), 200

    except Exception as e:
        return jsonify({
            "error": "Failed to fetch videos",
            "details": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@video_bp.route("/<int:video_id>", methods=["GET"])
def get_video_by_id(video_id):
    conn = None
    cursor = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            SELECT id, title, description, thumbnail_url, video_object_name, duration, category
            FROM videos
            WHERE id = %s
        """, (video_id,))

        row = cursor.fetchone()

        if not row:
            return jsonify({
                "error": "Video not found"
            }), 404

        video = build_video_response(row)

        return jsonify(video), 200

    except Exception as e:
        return jsonify({
            "error": "Failed to fetch video",
            "details": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@video_bp.route("/", methods=["POST"])
@token_required
def create_video():
    conn = None
    cursor = None

    try:
        data = request.get_json()
        error = validate_video_payload(data)

        if error:
            return jsonify({"error": error}), 400

        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            INSERT INTO videos (title, description, thumbnail_url, video_object_name, duration, category)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id, title, description, thumbnail_url, video_object_name, duration, category
        """, (
            data["title"],
            data["description"],
            data["thumbnail_url"],
            data["video_object_name"],
            int(data["duration"]),
            data["category"]
        ))

        new_video = cursor.fetchone()
        conn.commit()

        return jsonify({
            "message": "Video created successfully",
            "video": build_video_response(new_video)
        }), 201

    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({
            "error": "Failed to create video",
            "details": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@video_bp.route("/<int:video_id>", methods=["PUT"])
@token_required
def update_video(video_id):
    conn = None
    cursor = None

    try:
        data = request.get_json()
        error = validate_video_payload(data)

        if error:
            return jsonify({"error": error}), 400

        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("SELECT id FROM videos WHERE id = %s", (video_id,))
        existing = cursor.fetchone()

        if not existing:
            return jsonify({"error": "Video not found"}), 404

        cursor.execute("""
            UPDATE videos
            SET title = %s,
                description = %s,
                thumbnail_url = %s,
                video_object_name = %s,
                duration = %s,
                category = %s
            WHERE id = %s
            RETURNING id, title, description, thumbnail_url, video_object_name, duration, category
        """, (
            data["title"],
            data["description"],
            data["thumbnail_url"],
            data["video_object_name"],
            int(data["duration"]),
            data["category"],
            video_id
        ))

        updated_video = cursor.fetchone()
        conn.commit()

        return jsonify({
            "message": "Video updated successfully",
            "video": build_video_response(updated_video)
        }), 200

    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({
            "error": "Failed to update video",
            "details": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@video_bp.route("/<int:video_id>", methods=["DELETE"])
@token_required
def delete_video(video_id):
    conn = None
    cursor = None

    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            DELETE FROM videos
            WHERE id = %s
            RETURNING id, title, description, thumbnail_url, video_object_name, duration, category
        """, (video_id,))

        deleted_video = cursor.fetchone()

        if not deleted_video:
            return jsonify({
                "error": "Video not found"
            }), 404

        conn.commit()

        return jsonify({
            "message": "Video deleted successfully",
            "video": build_video_response(deleted_video)
        }), 200

    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({
            "error": "Failed to delete video",
            "details": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()