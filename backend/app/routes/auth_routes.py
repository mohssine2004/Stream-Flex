from flask import Blueprint, request, jsonify
from psycopg2.extras import RealDictCursor
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import get_db_connection
from app.utils.auth import generate_token, token_required

auth_bp = Blueprint("auth", __name__)


def validate_register_payload(data):
    required_fields = ["name", "email", "password"]

    if not data:
        return "Request body is missing"

    for field in required_fields:
        if field not in data:
            return f"Missing field: {field}"

    if not str(data["name"]).strip():
        return "name cannot be empty"

    if not str(data["email"]).strip():
        return "email cannot be empty"

    if not str(data["password"]).strip():
        return "password cannot be empty"

    if len(data["password"]) < 6:
        return "password must be at least 6 characters"

    return None


def validate_login_payload(data):
    required_fields = ["email", "password"]

    if not data:
        return "Request body is missing"

    for field in required_fields:
        if field not in data:
            return f"Missing field: {field}"

    return None


@auth_bp.route("/signup", methods=["POST"])
def register():
    conn = None
    cursor = None

    try:
        data = request.get_json()
        error = validate_register_payload(data)

        if error:
            return jsonify({"error": error}), 400

        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute(
            "SELECT id FROM users WHERE email = %s OR username = %s",
            (data["email"], data["name"])
        )
        existing_user = cursor.fetchone()

        if existing_user:
            return jsonify({"error": "User already exists"}), 409

        password_hash = generate_password_hash(data["password"])

        cursor.execute("""
            INSERT INTO users (username, email, password_hash, role)
            VALUES (%s, %s, %s, %s)
            RETURNING id, username, email, role, created_at
        """, (
            data["name"],
            data["email"],
            password_hash,
            "admin"
        ))

        new_user = cursor.fetchone()
        conn.commit()

        token = generate_token(new_user)

        return jsonify({
            "message": "User registered successfully",
            "token": token,
            "user": {
                "id": new_user["id"],
                "username": new_user["username"],
                "email": new_user["email"],
                "role": new_user["role"]
            }
        }), 201

    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({
            "error": "Failed to register user",
            "details": repr(e)
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@auth_bp.route("/login", methods=["POST"])
def login():
    conn = None
    cursor = None

    try:
        data = request.get_json()
        error = validate_login_payload(data)

        if error:
            return jsonify({"error": error}), 400

        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            SELECT id, username, email, password_hash, role
            FROM users
            WHERE email = %s
        """, (data["email"],))

        user = cursor.fetchone()

        if not user:
            return jsonify({"error": "Invalid email or password"}), 401

        if not check_password_hash(user["password_hash"], data["password"]):
            return jsonify({"error": "Invalid email or password"}), 401

        token = generate_token(user)

        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": {
                "id": user["id"],
                "username": user["username"],
                "email": user["email"],
                "role": user["role"]
            }
        }), 200

    except Exception as e:
        return jsonify({
            "error": "Failed to login",
            "details": str(e)
        }), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()


@auth_bp.route("/me", methods=["GET"])
@token_required
def get_me():
    return jsonify({
        "message": "Authenticated user",
        "user": request.user
    }), 200