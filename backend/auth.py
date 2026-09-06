import os
import jwt
from datetime import datetime, timedelta, timezone
from functools import wraps
from flask import request, jsonify
from database import get_db_connection

SECRET_KEY = os.environ.get('SECRET_KEY', 'smart_faculty_tracker_secret_key_2026')

def generate_token(user_id, username, role, faculty_id=None, student_id=None):
    payload = {
        'user_id': user_id,
        'username': username,
        'role': role,
        'faculty_id': faculty_id,
        'student_id': student_id,
        'exp': datetime.now(timezone.utc) + timedelta(days=7),
        'iat': datetime.now(timezone.utc)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def decode_token(token):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return jsonify({'error': 'Authorization token is required'}), 401
        
        parts = auth_header.split()
        if len(parts) != 2 or parts[0].lower() != 'bearer':
            return jsonify({'error': 'Invalid token format. Expected: Bearer <token>'}), 401
        
        token = parts[1]
        decoded = decode_token(token)
        if not decoded:
            return jsonify({'error': 'Token is invalid or has expired'}), 401
        
        # Verify user still exists in database
        conn = get_db_connection()
        user = conn.execute("SELECT id, username, role FROM users WHERE id = ?", (decoded['user_id'],)).fetchone()
        conn.close()
        
        if not user:
            return jsonify({'error': 'User not found'}), 401

        request.current_user = decoded
        return f(*args, **kwargs)
    return decorated

def role_required(allowed_roles):
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if not hasattr(request, 'current_user'):
                return jsonify({'error': 'Authentication required'}), 401
            
            user_role = request.current_user.get('role')
            if user_role not in allowed_roles:
                return jsonify({'error': f'Access forbidden: requires one of {allowed_roles}'}), 403
            
            return f(*args, **kwargs)
        return decorated
    return decorator
