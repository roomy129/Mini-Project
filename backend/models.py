import sqlite3
from datetime import datetime
from database import get_db_connection

def get_current_day_and_time(custom_day=None, custom_time=None):
    if custom_day and custom_time:
        return custom_day, custom_time
    
    # By default in demo environment:
    # Use real current day/time or default to Monday 10:30 for rich demo experience
    now = datetime.now()
    days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    current_day = custom_day if custom_day else days[now.weekday()]
    if current_day in ['Saturday', 'Sunday']:
        current_day = 'Monday' # default to Monday for demo presentation
    
    current_time = custom_time if custom_time else now.strftime('%H:%M')
    # Default to standard class hours for rich demo if outside 9-16
    hour = int(current_time.split(':')[0])
    if hour < 9 or hour > 17:
        current_time = '10:30' # representative demo time during active class period
        current_day = 'Monday'
        
    return current_day, current_time

def get_expected_location_for_faculty(cursor, faculty_id, day, time_str):
    """Find scheduled timetable slot for the faculty at the specified day and time."""
    cursor.execute("""
        SELECT * FROM timetable 
        WHERE faculty_id = ? AND day_of_week = ?
        AND start_time <= ? AND end_time > ?
        ORDER BY start_time ASC
        LIMIT 1
    """, (faculty_id, day, time_str, time_str))
    slot = cursor.fetchone()
    if slot:
        return {
            'has_schedule': True,
            'subject_code': slot['subject_code'],
            'subject_name': slot['subject_name'],
            'building': slot['building'],
            'room': slot['room'],
            'start_time': slot['start_time'],
            'end_time': slot['end_time'],
            'time_slot': f"{slot['start_time']} – {slot['end_time']}",
            'location_display': f"{slot['building']}, Room {slot['room']}"
        }
    
    # Check if there is next upcoming schedule today
    cursor.execute("""
        SELECT * FROM timetable 
        WHERE faculty_id = ? AND day_of_week = ?
        AND start_time > ?
        ORDER BY start_time ASC
        LIMIT 1
    """, (faculty_id, day, time_str))
    next_slot = cursor.fetchone()
    if next_slot:
        return {
            'has_schedule': False,
            'upcoming': True,
            'subject_code': next_slot['subject_code'],
            'subject_name': next_slot['subject_name'],
            'building': next_slot['building'],
            'room': next_slot['room'],
            'start_time': next_slot['start_time'],
            'end_time': next_slot['end_time'],
            'time_slot': f"{next_slot['start_time']} – {next_slot['end_time']}",
            'location_display': f"Next class: {next_slot['building']}, Room {next_slot['room']} ({next_slot['start_time']})"
        }

    return {
        'has_schedule': False,
        'upcoming': False,
        'subject_name': 'No Scheduled Class',
        'location_display': 'No scheduled class at this time (Free / Office hours)'
    }

def format_faculty_dict(row, cursor=None, is_admin_or_owner=False, day=None, time_str=None):
    f_dict = dict(row)
    
    # Calculate Expected Location from Timetable
    target_day, target_time = get_current_day_and_time(day, time_str)
    expected = None
    if cursor and 'id' in f_dict:
        expected = get_expected_location_for_faculty(cursor, f_dict['id'], target_day, target_time)
        f_dict['expected_location'] = expected
    
    # Location Difference Detection
    sharing_enabled = bool(f_dict.get('sharing_enabled', 1))
    f_dict['sharing_enabled'] = sharing_enabled
    
    current_building = f_dict.get('building_name', '')
    current_room = f_dict.get('room', '')
    
    location_differs = False
    diff_reason = None
    
    if expected and expected.get('has_schedule'):
        exp_building = expected.get('building', '')
        exp_room = expected.get('room', '')
        
        # Check if building or room differs
        if current_building and (current_building.lower() != exp_building.lower() or current_room.lower() != exp_room.lower()):
            location_differs = True
            diff_reason = "Location differs from timetable. Possible reason: Faculty may have moved or timetable may not reflect the current activity."
    
    f_dict['location_differs'] = location_differs
    f_dict['difference_reason'] = diff_reason

    # Privacy Protection Logic:
    # If sharing is OFF and not viewing as admin/owner:
    # Mask room and floor details, show building only with privacy notice
    if not sharing_enabled and not is_admin_or_owner:
        f_dict['room_display'] = 'Location sharing restricted by faculty'
        f_dict['floor_display'] = 'Restricted'
        f_dict['room'] = 'Restricted'
        f_dict['floor'] = 'Restricted'
        f_dict['privacy_notice'] = 'Faculty has disabled exact room sharing for privacy.'
    else:
        f_dict['room_display'] = current_room
        f_dict['floor_display'] = f_dict.get('floor', '')
        f_dict['privacy_notice'] = None

    return f_dict

def get_all_faculty(search_query=None, department=None, building=None, status=None, day=None, time_str=None, current_user=None):
    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
        SELECT f.id, f.user_id, f.name, f.email, f.department, f.designation, f.phone, f.cabin_room, f.avatar,
               l.building_name, l.floor, l.room, l.status, l.sharing_enabled, l.remarks, l.updated_at
        FROM faculty f
        LEFT JOIN locations l ON f.id = l.faculty_id
        WHERE 1=1
    """
    params = []

    if search_query:
        query += " AND (f.name LIKE ? OR f.department LIKE ? OR l.building_name LIKE ? OR f.designation LIKE ?)"
        like_term = f"%{search_query}%"
        params.extend([like_term, like_term, like_term, like_term])

    if department and department != 'All':
        query += " AND f.department = ?"
        params.append(department)

    if building and building != 'All':
        query += " AND l.building_name = ?"
        params.append(building)

    if status and status != 'All':
        query += " AND l.status = ?"
        params.append(status)

    query += " ORDER BY f.name ASC"
    
    cursor.execute(query, params)
    rows = cursor.fetchall()

    is_admin = current_user and current_user.get('role') == 'admin'
    user_fac_id = current_user.get('faculty_id') if current_user else None

    faculty_list = []
    for r in rows:
        is_owner = user_fac_id and user_fac_id == r['id']
        f_dict = format_faculty_dict(r, cursor, is_admin or is_owner, day, time_str)
        faculty_list.append(f_dict)

    conn.close()
    return faculty_list

def get_faculty_by_id(faculty_id, day=None, time_str=None, current_user=None):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT f.id, f.user_id, f.name, f.email, f.department, f.designation, f.phone, f.cabin_room, f.avatar,
               l.building_name, l.floor, l.room, l.status, l.sharing_enabled, l.remarks, l.updated_at
        FROM faculty f
        LEFT JOIN locations l ON f.id = l.faculty_id
        WHERE f.id = ?
    """, (faculty_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        return None

    is_admin = current_user and current_user.get('role') == 'admin'
    user_fac_id = current_user.get('faculty_id') if current_user else None
    is_owner = user_fac_id and user_fac_id == faculty_id

    f_dict = format_faculty_dict(row, cursor, is_admin or is_owner, day, time_str)

    # Fetch full today's and weekly timetable
    target_day, _ = get_current_day_and_time(day, time_str)
    cursor.execute("""
        SELECT * FROM timetable
        WHERE faculty_id = ? AND day_of_week = ?
        ORDER BY start_time ASC
    """, (faculty_id, target_day))
    f_dict['today_timetable'] = [dict(t) for t in cursor.fetchall()]

    cursor.execute("""
        SELECT * FROM timetable
        WHERE faculty_id = ?
        ORDER BY CASE day_of_week
            WHEN 'Monday' THEN 1
            WHEN 'Tuesday' THEN 2
            WHEN 'Wednesday' THEN 3
            WHEN 'Thursday' THEN 4
            WHEN 'Friday' THEN 5
            ELSE 6 END, start_time ASC
    """, (faculty_id,))
    f_dict['weekly_timetable'] = [dict(t) for t in cursor.fetchall()]

    conn.close()
    return f_dict

def update_faculty_location(faculty_id, building_name, floor, room, status, sharing_enabled, remarks=""):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if location entry exists
    cursor.execute("SELECT id FROM locations WHERE faculty_id = ?", (faculty_id,))
    existing = cursor.fetchone()

    if existing:
        cursor.execute("""
            UPDATE locations 
            SET building_name = ?, floor = ?, room = ?, status = ?, sharing_enabled = ?, remarks = ?, updated_at = CURRENT_TIMESTAMP
            WHERE faculty_id = ?
        """, (building_name, floor, room, status, 1 if sharing_enabled else 0, remarks, faculty_id))
    else:
        cursor.execute("""
            INSERT INTO locations (faculty_id, building_name, floor, room, status, sharing_enabled, remarks, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        """, (faculty_id, building_name, floor, room, status, 1 if sharing_enabled else 0, remarks))

    conn.commit()
    conn.close()
    return True

def update_faculty_availability(faculty_id, status):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE locations 
        SET status = ?, updated_at = CURRENT_TIMESTAMP
        WHERE faculty_id = ?
    """, (status, faculty_id))
    conn.commit()
    conn.close()
    return True

def update_faculty_privacy(faculty_id, sharing_enabled):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE locations 
        SET sharing_enabled = ?, updated_at = CURRENT_TIMESTAMP
        WHERE faculty_id = ?
    """, (1 if sharing_enabled else 0, faculty_id))
    conn.commit()
    conn.close()
    return True
