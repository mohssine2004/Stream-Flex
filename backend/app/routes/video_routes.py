from flask import Blueprint, jsonify, current_app, request
from psycopg2.extras import RealDictCursor
from app.extensions import get_db_connection
from app.utils.auth import token_required, admin_required
from app.utils.minio_client import get_minio_client
import uuid
import os

video_bp = Blueprint("videos", __name__)


def build_video_response(row):
    return {
        "id": row["id"],
        "title": row["title"],
        "description": row["description"],
        "thumbnail_url": row["thumbnail_url"],
        "video_url": row["video_object_name"] if row["video_object_name"].startswith(("http://", "https://")) else f"{current_app.config['MINIO_BASE_URL']}/{row['video_object_name']}",
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


@video_bp.route("/upload", methods=["POST"])
@admin_required
def upload_video():
    conn = None
    cursor = None
    import sys

    try:
        print(">>> UPLOAD STEP 1: Request received", flush=True)
        
        # 1. Validate Files
        if "video" not in request.files:
            return jsonify({"error": "Video file is missing"}), 400
        if "thumbnail" not in request.files:
            return jsonify({"error": "Thumbnail file is missing"}), 400

        video_file = request.files["video"]
        thumbnail_file = request.files["thumbnail"]
        print(f">>> UPLOAD STEP 2: Files received - video={video_file.filename}, thumb={thumbnail_file.filename}", flush=True)

        # 2. Get Metadata from Form
        title = request.form.get("title")
        description = request.form.get("description")
        category = request.form.get("category")
        duration = request.form.get("duration")

        if not all([title, description, category, duration]):
            return jsonify({"error": "Missing metadata fields"}), 400

        print(f">>> UPLOAD STEP 3: Metadata OK - title={title}", flush=True)

        # 3. Initialize MinIO Client
        print(">>> UPLOAD STEP 4: Connecting to MinIO...", flush=True)
        client, bucket = get_minio_client()
        print(f">>> UPLOAD STEP 4b: MinIO connected, bucket={bucket}", flush=True)

        # 4. Prepare Unique Filenames
        ext_video = os.path.splitext(video_file.filename)[1]
        ext_thumb = os.path.splitext(thumbnail_file.filename)[1]
        
        video_name = f"videos/{uuid.uuid4()}{ext_video}"
        thumb_name = f"thumbnails/{uuid.uuid4()}{ext_thumb}"

        # 5. Upload to MinIO
        print(">>> UPLOAD STEP 5: Uploading video to MinIO...", flush=True)
        video_file.seek(0, os.SEEK_END)
        video_size = video_file.tell()
        video_file.seek(0)
        print(f">>> Video size: {video_size} bytes", flush=True)
        client.put_object(bucket, video_name, video_file, video_size)
        print(">>> UPLOAD STEP 5b: Video uploaded!", flush=True)

        # Thumbnail
        print(">>> UPLOAD STEP 6: Uploading thumbnail to MinIO...", flush=True)
        thumbnail_file.seek(0, os.SEEK_END)
        thumb_size = thumbnail_file.tell()
        thumbnail_file.seek(0)
        client.put_object(bucket, thumb_name, thumbnail_file, thumb_size)
        print(">>> UPLOAD STEP 6b: Thumbnail uploaded!", flush=True)

        # 6. Save to Database
        print(">>> UPLOAD STEP 7: Saving to database...", flush=True)
        minio_base = current_app.config['MINIO_BASE_URL']
        full_thumb_url = f"{minio_base}/{thumb_name}"

        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            INSERT INTO videos (title, description, thumbnail_url, video_object_name, duration, category)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id, title, description, thumbnail_url, video_object_name, duration, category
        """, (
            title,
            description,
            full_thumb_url,
            video_name,
            int(duration),
            category
        ))

        new_video = cursor.fetchone()
        conn.commit()
        print(">>> UPLOAD STEP 8: Database saved! SUCCESS", flush=True)

        return jsonify({
            "message": "Video and thumbnail uploaded successfully",
            "video": build_video_response(new_video)
        }), 201

    except Exception as e:
        print(f">>> UPLOAD ERROR: {repr(e)}", flush=True)
        if conn:
            conn.rollback()
        return jsonify({
            "error": "Failed to upload video",
            "details": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()