import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

from database import get_db_connection, seed_db
from auth import generate_token, token_required, role_required
import models

app = Flask(__name__)
# Enable CORS for all frontend requests
CORS(app, resources={r"/api/*": {"origins": "*"}})

# -------------------------------------------------------------
# AUTHENTICATION ENDPOINTS
# -------------------------------------------------------------

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    conn = get_db_connection()
    user = conn.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    
    if not user or not check_password_hash(user['password_hash'], password):
        conn.close()
        return jsonify({'error': 'Invalid username or password'}), 401

    role = user['role']
    faculty_info = None
    student_info = None

    if role == 'faculty':
        fac = conn.execute("SELECT * FROM faculty WHERE user_id = ?", (user['id'],)).fetchone()
        if fac:
            faculty_info = dict(fac)
    elif role == 'student':
        stu = conn.execute("SELECT * FROM students WHERE user_id = ?", (user['id'],)).fetchone()
        if stu:
            student_info = dict(stu)

    conn.close()

    faculty_id = faculty_info['id'] if faculty_info else None
    student_id = student_info['id'] if student_info else None

    token = generate_token(user['id'], user['username'], role, faculty_id, student_id)

    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': {
            'id': user['id'],
            'username': user['username'],
            'role': role,
            'faculty': faculty_info,
            'student': student_info
        }
    })

@app.route('/api/auth/me', methods=['GET'])
@token_required
def get_current_user():
    user_id = request.current_user['user_id']
    conn = get_db_connection()
    user = conn.execute("SELECT id, username, role, created_at FROM users WHERE id = ?", (user_id,)).fetchone()
    
    if not user:
        conn.close()
        return jsonify({'error': 'User not found'}), 404

    role = user['role']
    faculty_info = None
    student_info = None

    if role == 'faculty':
        fac = conn.execute("SELECT * FROM faculty WHERE user_id = ?", (user['id'],)).fetchone()
        if fac:
            faculty_info = dict(fac)
    elif role == 'student':
        stu = conn.execute("SELECT * FROM students WHERE user_id = ?", (user['id'],)).fetchone()
        if stu:
            student_info = dict(stu)

    conn.close()

    return jsonify({
        'id': user['id'],
        'username': user['username'],
        'role': role,
        'created_at': user['created_at'],
        'faculty': faculty_info,
        'student': student_info
    })

# -------------------------------------------------------------
# FACULTY & LOCATION ENDPOINTS (MAIN FEATURE)
# -------------------------------------------------------------

@app.route('/api/faculty', methods=['GET'])
def list_faculty():
    search = request.args.get('search')
    department = request.args.get('department')
    building = request.args.get('building')
    status = request.args.get('status')
    day = request.args.get('day')
    time_str = request.args.get('time')

    # Optional auth extraction if token passed in headers
    current_user = None
    auth_header = request.headers.get('Authorization')
    if auth_header:
        try:
            parts = auth_header.split()
            if len(parts) == 2 and parts[0].lower() == 'bearer':
                from auth import decode_token
                current_user = decode_token(parts[1])
        except Exception:
            pass

    faculty_list = models.get_all_faculty(
        search_query=search,
        department=department,
        building=building,
        status=status,
        day=day,
        time_str=time_str,
        current_user=current_user
    )

    # Calculate summary metrics
    total = len(faculty_list)
    available_count = sum(1 for f in faculty_list if f.get('status') == 'Available')
    busy_count = sum(1 for f in faculty_list if f.get('status') == 'Busy')
    not_available_count = sum(1 for f in faculty_list if f.get('status') == 'Not Available')

    return jsonify({
        'faculty': faculty_list,
        'metrics': {
            'total': total,
            'available': available_count,
            'busy': busy_count,
            'not_available': not_available_count
        }
    })

@app.route('/api/faculty/<int:faculty_id>', methods=['GET'])
def get_faculty_details(faculty_id):
    day = request.args.get('day')
    time_str = request.args.get('time')

    current_user = None
    auth_header = request.headers.get('Authorization')
    if auth_header:
        try:
            parts = auth_header.split()
            if len(parts) == 2 and parts[0].lower() == 'bearer':
                from auth import decode_token
                current_user = decode_token(parts[1])
        except Exception:
            pass

    faculty = models.get_faculty_by_id(faculty_id, day=day, time_str=time_str, current_user=current_user)
    if not faculty:
        return jsonify({'error': 'Faculty member not found'}), 404
    
    return jsonify({'faculty': faculty})

@app.route('/api/faculty/<int:faculty_id>/location', methods=['GET'])
def get_faculty_location(faculty_id):
    current_user = None
    auth_header = request.headers.get('Authorization')
    if auth_header:
        try:
            parts = auth_header.split()
            if len(parts) == 2 and parts[0].lower() == 'bearer':
                from auth import decode_token
                current_user = decode_token(parts[1])
        except Exception:
            pass

    faculty = models.get_faculty_by_id(faculty_id, current_user=current_user)
    if not faculty:
        return jsonify({'error': 'Faculty member not found'}), 404
    
    return jsonify({
        'faculty_id': faculty['id'],
        'name': faculty['name'],
        'building': faculty.get('building_name'),
        'floor': faculty.get('floor_display'),
        'room': faculty.get('room_display'),
        'status': faculty.get('status'),
        'sharing_enabled': faculty.get('sharing_enabled'),
        'remarks': faculty.get('remarks'),
        'updated_at': faculty.get('updated_at'),
        'location_differs': faculty.get('location_differs'),
        'difference_reason': faculty.get('difference_reason')
    })

@app.route('/api/faculty/<int:faculty_id>/location', methods=['PUT'])
@token_required
def update_location(faculty_id):
    user = request.current_user
    # Only the faculty member themselves or admin can update location
    if user['role'] != 'admin' and (user['role'] != 'faculty' or user.get('faculty_id') != faculty_id):
        return jsonify({'error': 'You are only authorized to update your own location'}), 403

    data = request.get_json() or {}
    building = data.get('building') or data.get('building_name')
    floor = data.get('floor')
    room = data.get('room')
    status = data.get('status', 'Available')
    sharing_enabled = data.get('sharing_enabled', True)
    remarks = data.get('remarks', '')

    if not building or not floor or not room:
        return jsonify({'error': 'Building, floor, and room are required'}), 400

    if status not in ['Available', 'Busy', 'Not Available']:
        return jsonify({'error': 'Status must be Available, Busy, or Not Available'}), 400

    models.update_faculty_location(
        faculty_id=faculty_id,
        building_name=building,
        floor=floor,
        room=room,
        status=status,
        sharing_enabled=sharing_enabled,
        remarks=remarks
    )

    # Return refreshed faculty details
    refreshed = models.get_faculty_by_id(faculty_id, current_user=user)
    return jsonify({
        'message': 'Location updated successfully.',
        'faculty': refreshed
    })

@app.route('/api/faculty/<int:faculty_id>/availability', methods=['PUT'])
@token_required
def update_availability(faculty_id):
    user = request.current_user
    if user['role'] != 'admin' and (user['role'] != 'faculty' or user.get('faculty_id') != faculty_id):
        return jsonify({'error': 'Unauthorized to update availability'}), 403

    data = request.get_json() or {}
    status = data.get('status')
    if status not in ['Available', 'Busy', 'Not Available']:
        return jsonify({'error': 'Invalid status'}), 400

    models.update_faculty_availability(faculty_id, status)
    return jsonify({'message': 'Availability updated successfully.', 'status': status})

@app.route('/api/faculty/<int:faculty_id>/privacy', methods=['PUT'])
@token_required
def update_privacy(faculty_id):
    user = request.current_user
    if user['role'] != 'admin' and (user['role'] != 'faculty' or user.get('faculty_id') != faculty_id):
        return jsonify({'error': 'Unauthorized to update privacy settings'}), 403

    data = request.get_json() or {}
    sharing_enabled = bool(data.get('sharing_enabled', True))

    models.update_faculty_privacy(faculty_id, sharing_enabled)
    notice = "Exact room location is now visible to students." if sharing_enabled else "Exact room location is now hidden from students (Building only shown)."
    return jsonify({
        'message': 'Privacy settings updated successfully.',
        'sharing_enabled': sharing_enabled,
        'notice': notice
    })

# -------------------------------------------------------------
# BUILDINGS & ROOMS ENDPOINTS
# -------------------------------------------------------------

@app.route('/api/buildings', methods=['GET'])
def get_buildings():
    conn = get_db_connection()
    buildings = [dict(b) for b in conn.execute("SELECT * FROM buildings ORDER BY map_order ASC").fetchall()]
    
    # For each building, get current faculty present inside
    for b in buildings:
        fac_in_b = conn.execute("""
            SELECT f.id, f.name, f.department, l.floor, l.room, l.status, l.sharing_enabled, l.updated_at
            FROM faculty f
            JOIN locations l ON f.id = l.faculty_id
            WHERE l.building_name = ?
        """, (b['name'],)).fetchall()
        
        b['faculty_present'] = [dict(f) for f in fac_in_b]
        b['faculty_count'] = len(b['faculty_present'])
        
    conn.close()
    return jsonify({'buildings': buildings})

@app.route('/api/rooms', methods=['GET'])
def get_rooms():
    building_id = request.args.get('building_id')
    building_code = request.args.get('building_code')
    building_name = request.args.get('building_name')

    conn = get_db_connection()
    query = """
        SELECT r.*, b.name as building_name, b.code as building_code
        FROM rooms r
        JOIN buildings b ON r.building_id = b.id
        WHERE 1=1
    """
    params = []
    if building_id:
        query += " AND r.building_id = ?"
        params.append(building_id)
    if building_code:
        query += " AND b.code = ?"
        params.append(building_code)
    if building_name:
        query += " AND b.name = ?"
        params.append(building_name)

    query += " ORDER BY r.floor_name, r.room_number"
    rooms = [dict(r) for r in conn.execute(query, params).fetchall()]
    conn.close()
    return jsonify({'rooms': rooms})

# -------------------------------------------------------------
# TIMETABLE ENDPOINTS
# -------------------------------------------------------------

@app.route('/api/timetable', methods=['GET'])
def get_timetable():
    faculty_id = request.args.get('faculty_id')
    day = request.args.get('day')

    conn = get_db_connection()
    query = """
        SELECT t.*, f.name as faculty_name, f.department, f.designation
        FROM timetable t
        JOIN faculty f ON t.faculty_id = f.id
        WHERE 1=1
    """
    params = []
    if faculty_id:
        query += " AND t.faculty_id = ?"
        params.append(faculty_id)
    if day and day != 'All':
        query += " AND t.day_of_week = ?"
        params.append(day)

    query += """
        ORDER BY CASE t.day_of_week
            WHEN 'Monday' THEN 1
            WHEN 'Tuesday' THEN 2
            WHEN 'Wednesday' THEN 3
            WHEN 'Thursday' THEN 4
            WHEN 'Friday' THEN 5
            ELSE 6 END, t.start_time ASC
    """
    entries = [dict(row) for row in conn.execute(query, params).fetchall()]
    conn.close()
    return jsonify({'timetable': entries})

@app.route('/api/timetable', methods=['POST'])
@token_required
@role_required(['admin'])
def add_timetable_entry():
    data = request.get_json() or {}
    faculty_id = data.get('faculty_id')
    day_of_week = data.get('day_of_week')
    start_time = data.get('start_time')
    end_time = data.get('end_time')
    subject_code = data.get('subject_code', '')
    subject_name = data.get('subject_name')
    building = data.get('building')
    room = data.get('room')

    if not all([faculty_id, day_of_week, start_time, end_time, subject_name, building, room]):
        return jsonify({'error': 'All fields are required'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO timetable (faculty_id, day_of_week, start_time, end_time, subject_code, subject_name, building, room)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (faculty_id, day_of_week, start_time, end_time, subject_code, subject_name, building, room))
    new_id = cursor.lastrowid
    conn.commit()
    conn.close()

    return jsonify({'message': 'Timetable entry added successfully', 'id': new_id}), 201

@app.route('/api/timetable/<int:entry_id>', methods=['DELETE'])
@token_required
@role_required(['admin'])
def delete_timetable_entry(entry_id):
    conn = get_db_connection()
    conn.execute("DELETE FROM timetable WHERE id = ?", (entry_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Timetable entry deleted successfully'})

# -------------------------------------------------------------
# ADMIN DASHBOARD & MANAGEMENT ENDPOINTS
# -------------------------------------------------------------

@app.route('/api/admin/stats', methods=['GET'])
@token_required
@role_required(['admin'])
def get_admin_stats():
    conn = get_db_connection()
    total_students = conn.execute("SELECT COUNT(*) as c FROM students").fetchone()['c']
    total_faculty = conn.execute("SELECT COUNT(*) as c FROM faculty").fetchone()['c']
    total_buildings = conn.execute("SELECT COUNT(*) as c FROM buildings").fetchone()['c']
    total_rooms = conn.execute("SELECT COUNT(*) as c FROM rooms").fetchone()['c']

    available_faculty = conn.execute("SELECT COUNT(*) as c FROM locations WHERE status = 'Available'").fetchone()['c']
    busy_faculty = conn.execute("SELECT COUNT(*) as c FROM locations WHERE status = 'Busy'").fetchone()['c']
    not_available_faculty = conn.execute("SELECT COUNT(*) as c FROM locations WHERE status = 'Not Available'").fetchone()['c']
    privacy_enabled_count = conn.execute("SELECT COUNT(*) as c FROM locations WHERE sharing_enabled = 1").fetchone()['c']

    recent_updates = conn.execute("""
        SELECT f.name, f.department, l.building_name, l.floor, l.room, l.status, l.updated_at
        FROM locations l
        JOIN faculty f ON l.faculty_id = f.id
        ORDER BY l.updated_at DESC
        LIMIT 5
    """).fetchall()

    conn.close()

    return jsonify({
        'stats': {
            'total_students': total_students,
            'total_faculty': total_faculty,
            'total_buildings': total_buildings,
            'total_rooms': total_rooms,
            'available_faculty': available_faculty,
            'busy_faculty': busy_faculty,
            'not_available_faculty': not_available_faculty,
            'privacy_enabled_count': privacy_enabled_count
        },
        'recent_updates': [dict(r) for r in recent_updates]
    })

@app.route('/api/admin/faculty-locations', methods=['GET'])
@token_required
@role_required(['admin'])
def get_admin_faculty_locations():
    conn = get_db_connection()
    rows = conn.execute("""
        SELECT f.id, f.name, f.email, f.department, f.designation, f.phone, f.cabin_room,
               l.building_name, l.floor, l.room, l.status, l.sharing_enabled, l.remarks, l.updated_at
        FROM faculty f
        LEFT JOIN locations l ON f.id = l.faculty_id
        ORDER BY f.name ASC
    """).fetchall()
    conn.close()
    return jsonify({'faculty_locations': [dict(r) for r in rows]})

@app.route('/api/admin/faculty', methods=['POST'])
@token_required
@role_required(['admin'])
def create_faculty():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    department = data.get('department', '').strip()
    designation = data.get('designation', '').strip()
    phone = data.get('phone', '').strip()
    cabin_room = data.get('cabin_room', '').strip()
    username = data.get('username', '').strip() or email.split('@')[0]
    password = data.get('password', 'faculty123').strip()

    if not all([name, email, department, designation]):
        return jsonify({'error': 'Name, email, department, and designation are required'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # 1. Create user
        cursor.execute("INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)",
                       (username, generate_password_hash(password), 'faculty'))
        user_id = cursor.lastrowid

        # 2. Create faculty
        cursor.execute("""
            INSERT INTO faculty (user_id, name, email, department, designation, phone, cabin_room, avatar)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (user_id, name, email, department, designation, phone, cabin_room, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'))
        faculty_id = cursor.lastrowid

        # 3. Create initial default location
        cursor.execute("""
            INSERT INTO locations (faculty_id, building_name, floor, room, status, sharing_enabled, remarks)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (faculty_id, 'CSE Block', '2nd Floor', '204', 'Available', 1, 'In Office'))

        conn.commit()
        conn.close()
        return jsonify({'message': 'Faculty created successfully', 'faculty_id': faculty_id}), 201
    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({'error': str(e)}), 400

@app.route('/api/admin/faculty/<int:faculty_id>', methods=['PUT'])
@token_required
@role_required(['admin'])
def update_faculty(faculty_id):
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip()
    department = data.get('department', '').strip()
    designation = data.get('designation', '').strip()
    phone = data.get('phone', '').strip()
    cabin_room = data.get('cabin_room', '').strip()

    conn = get_db_connection()
    conn.execute("""
        UPDATE faculty 
        SET name = ?, email = ?, department = ?, designation = ?, phone = ?, cabin_room = ?
        WHERE id = ?
    """, (name, email, department, designation, phone, cabin_room, faculty_id))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Faculty updated successfully'})

@app.route('/api/admin/faculty/<int:faculty_id>', methods=['DELETE'])
@token_required
@role_required(['admin'])
def delete_faculty(faculty_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    fac = cursor.execute("SELECT user_id FROM faculty WHERE id = ?", (faculty_id,)).fetchone()
    if fac and fac['user_id']:
        cursor.execute("DELETE FROM users WHERE id = ?", (fac['user_id'],))
    cursor.execute("DELETE FROM faculty WHERE id = ?", (faculty_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Faculty deleted successfully'})

@app.route('/api/admin/students', methods=['GET'])
@token_required
@role_required(['admin'])
def get_students():
    conn = get_db_connection()
    students = [dict(s) for s in conn.execute("SELECT * FROM students ORDER BY name ASC").fetchall()]
    conn.close()
    return jsonify({'students': students})

@app.route('/api/admin/students', methods=['POST'])
@token_required
@role_required(['admin'])
def create_student():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    roll_number = data.get('roll_number', '').strip()
    department = data.get('department', '').strip()
    semester = data.get('semester', 1)
    section = data.get('section', 'A').strip()
    email = data.get('email', '').strip()
    username = data.get('username', '').strip() or roll_number.lower()
    password = data.get('password', 'student123').strip()

    if not all([name, roll_number, department]):
        return jsonify({'error': 'Name, roll number, and department are required'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)",
                       (username, generate_password_hash(password), 'student'))
        user_id = cursor.lastrowid

        cursor.execute("""
            INSERT INTO students (user_id, name, roll_number, department, semester, section, email)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (user_id, name, roll_number, department, semester, section, email))
        student_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return jsonify({'message': 'Student created successfully', 'student_id': student_id}), 201
    except Exception as e:
        conn.rollback()
        conn.close()
        return jsonify({'error': str(e)}), 400

@app.route('/api/admin/students/<int:student_id>', methods=['DELETE'])
@token_required
@role_required(['admin'])
def delete_student(student_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    stu = cursor.execute("SELECT user_id FROM students WHERE id = ?", (student_id,)).fetchone()
    if stu and stu['user_id']:
        cursor.execute("DELETE FROM users WHERE id = ?", (stu['user_id'],))
    cursor.execute("DELETE FROM students WHERE id = ?", (student_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': 'Student deleted successfully'})

# -------------------------------------------------------------
# DEMO MODE PRESETS & RESET ENDPOINTS
# -------------------------------------------------------------

@app.route('/api/demo/preset', methods=['POST'])
def run_demo_preset():
    data = request.get_json() or {}
    action = data.get('action')

    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get Dr. Arun Kumar's ID
    fac = cursor.execute("SELECT id FROM faculty WHERE name LIKE '%Arun Kumar%'").fetchone()
    if not fac:
        conn.close()
        return jsonify({'error': 'Dr. Arun Kumar record not found'}), 404
    
    fac_id = fac['id']
    message = ""

    if action == 'preset_1':
        # 1. Set Dr. Arun Kumar -> CSE Block -> Room 204 -> Available
        cursor.execute("""
            UPDATE locations 
            SET building_name = 'CSE Block', floor = '2nd Floor', room = '204', status = 'Available', sharing_enabled = 1,
                remarks = 'In Cabin 204 for student counseling', updated_at = CURRENT_TIMESTAMP
            WHERE faculty_id = ?
        """, (fac_id,))
        message = "Demo Action: Set Dr. Arun Kumar → CSE Block → Room 204 → Available"

    elif action == 'preset_2':
        # 2. Set Dr. Arun Kumar -> CSE Block -> Room 205 -> Busy
        cursor.execute("""
            UPDATE locations 
            SET building_name = 'CSE Block', floor = '2nd Floor', room = '205', status = 'Busy', sharing_enabled = 1,
                remarks = 'Conducting Operating Systems Lab', updated_at = CURRENT_TIMESTAMP
            WHERE faculty_id = ?
        """, (fac_id,))
        message = "Demo Action: Set Dr. Arun Kumar → CSE Block → Room 205 → Busy"

    elif action == 'preset_3':
        # 3. Set Dr. Arun Kumar -> Main Block -> Room 101 -> Available
        cursor.execute("""
            UPDATE locations 
            SET building_name = 'Main Block', floor = '1st Floor', room = '101', status = 'Available', sharing_enabled = 1,
                remarks = 'In Main Auditorium Hall A for Workshop', updated_at = CURRENT_TIMESTAMP
            WHERE faculty_id = ?
        """, (fac_id,))
        message = "Demo Action: Set Dr. Arun Kumar → Main Block → Room 101 → Available"

    elif action == 'privacy_off':
        # 4. Turn Location Sharing OFF
        cursor.execute("""
            UPDATE locations 
            SET sharing_enabled = 0, updated_at = CURRENT_TIMESTAMP
            WHERE faculty_id = ?
        """, (fac_id,))
        message = "Demo Action: Location Sharing turned OFF for Dr. Arun Kumar (Room masked for privacy)"

    elif action == 'privacy_on':
        # 5. Turn Location Sharing ON
        cursor.execute("""
            UPDATE locations 
            SET sharing_enabled = 1, updated_at = CURRENT_TIMESTAMP
            WHERE faculty_id = ?
        """, (fac_id,))
        message = "Demo Action: Location Sharing turned ON for Dr. Arun Kumar (Exact room visible)"

    else:
        conn.close()
        return jsonify({'error': 'Invalid demo preset action'}), 400

    conn.commit()
    conn.close()

    refreshed = models.get_faculty_by_id(fac_id)
    return jsonify({
        'message': message,
        'action': action,
        'faculty': refreshed
    })

@app.route('/api/demo/reset', methods=['POST'])
def reset_demo_data():
    seed_db()
    return jsonify({'message': 'Demo database has been reset to original state with sample data!'})

# Health check
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'online', 'system': 'Smart Faculty Location & Availability Tracking System', 'version': '1.0.0'})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting Smart Faculty Tracking API on http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=True)
