import sqlite3
import os
from werkzeug.security import generate_password_hash

DB_PATH = os.environ.get('DATABASE_PATH', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'smart_faculty.db'))

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    return conn

def init_db(force_reset=False):
    if force_reset and os.path.exists(DB_PATH):
        try:
            os.remove(DB_PATH)
        except Exception as e:
            print(f"Warning removing DB: {e}")

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.executescript('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('student', 'faculty', 'admin')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS faculty (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        department TEXT NOT NULL,
        designation TEXT NOT NULL,
        phone TEXT,
        cabin_room TEXT,
        avatar TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER UNIQUE,
        name TEXT NOT NULL,
        roll_number TEXT UNIQUE NOT NULL,
        department TEXT NOT NULL,
        semester INTEGER NOT NULL,
        section TEXT,
        email TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS buildings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        floors_count INTEGER DEFAULT 4,
        map_order INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS rooms (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        building_id INTEGER NOT NULL,
        floor_name TEXT NOT NULL,
        room_number TEXT NOT NULL,
        room_type TEXT DEFAULT 'Classroom',
        FOREIGN KEY (building_id) REFERENCES buildings(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        faculty_id INTEGER UNIQUE NOT NULL,
        building_name TEXT NOT NULL,
        floor TEXT NOT NULL,
        room TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Available' CHECK(status IN ('Available', 'Busy', 'Not Available')),
        sharing_enabled INTEGER NOT NULL DEFAULT 1,
        remarks TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS timetable (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        faculty_id INTEGER NOT NULL,
        day_of_week TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        subject_code TEXT,
        subject_name TEXT NOT NULL,
        building TEXT NOT NULL,
        room TEXT NOT NULL,
        FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE CASCADE
    );
    ''')
    conn.commit()
    conn.close()

def seed_db():
    init_db(force_reset=True)
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Create Default Users (Password hashing)
    # student -> student123
    # faculty -> faculty123 (Dr. Arun Kumar)
    # faculty2 -> faculty123 (Dr. Priya Sharma)
    # faculty3 -> faculty123 (Dr. Ravi Kumar)
    # faculty4 -> faculty123 (Dr. Meena R)
    # faculty5 -> faculty123 (Prof. Rajesh Verma)
    # admin -> admin123
    users_data = [
        ('student', generate_password_hash('student123'), 'student'),
        ('faculty', generate_password_hash('faculty123'), 'faculty'),
        ('priya_sharma', generate_password_hash('faculty123'), 'faculty'),
        ('ravi_kumar', generate_password_hash('faculty123'), 'faculty'),
        ('meena_r', generate_password_hash('faculty123'), 'faculty'),
        ('rajesh_v', generate_password_hash('faculty123'), 'faculty'),
        ('admin', generate_password_hash('admin123'), 'admin'),
    ]
    cursor.executemany("INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)", users_data)
    conn.commit()

    # User IDs mapping
    user_ids = {row['username']: row['id'] for row in cursor.execute("SELECT id, username FROM users").fetchall()}

    # 2. Seed Buildings
    buildings_data = [
        ('CSE', 'CSE Block', 'Department of Computer Science & Engineering, Labs 201-210', 4, 1),
        ('ECE', 'ECE Block', 'Electronics & Communication Engg, Signal & VLSI Labs', 4, 2),
        ('EEE', 'EEE Block', 'Electrical & Electronics Engineering, Power Systems', 3, 3),
        ('MAIN', 'Main Block', 'Administrative Offices, Auditoriums & Rooms 101-110', 4, 4),
        ('SCI', 'Science Block', 'Physics, Chemistry & Mathematics Depts', 3, 5),
        ('LIB', 'Library Block', 'Central Library, Digital Reading Hall & Seminar Halls', 3, 6),
    ]
    cursor.executemany("INSERT INTO buildings (code, name, description, floors_count, map_order) VALUES (?, ?, ?, ?, ?)", buildings_data)
    conn.commit()

    b_ids = {row['code']: row['id'] for row in cursor.execute("SELECT id, code FROM buildings").fetchall()}

    # 3. Seed Rooms
    rooms_data = [
        # CSE Block
        (b_ids['CSE'], 'Ground Floor', 'G01', 'Computing Lab 1'),
        (b_ids['CSE'], 'Ground Floor', 'G02', 'Robotics Lab'),
        (b_ids['CSE'], '1st Floor', '101', 'Lecture Hall 1'),
        (b_ids['CSE'], '1st Floor', '102', 'Lecture Hall 2'),
        (b_ids['CSE'], '2nd Floor', '201', 'AI & Data Science Lab'),
        (b_ids['CSE'], '2nd Floor', '202', 'Faculty Cabin Wing A'),
        (b_ids['CSE'], '2nd Floor', '203', 'Seminar Room'),
        (b_ids['CSE'], '2nd Floor', '204', 'Staff Room / Cabin 204'),
        (b_ids['CSE'], '2nd Floor', '205', 'Cloud Computing Lab'),
        (b_ids['CSE'], '3rd Floor', '301', 'PG Class Room 1'),
        (b_ids['CSE'], '3rd Floor', '302', 'PG Class Room 2'),
        (b_ids['CSE'], '3rd Floor', '303', 'HOD Office'),

        # ECE Block
        (b_ids['ECE'], 'Ground Floor', 'G10', 'VLSI Lab'),
        (b_ids['ECE'], '1st Floor', '101', 'Digital Signal Processing Lab'),
        (b_ids['ECE'], '1st Floor', '102', 'Classroom E1'),
        (b_ids['ECE'], '2nd Floor', '201', 'Staff Room ECE'),
        (b_ids['ECE'], '2nd Floor', '202', 'Microprocessor Lab'),
        (b_ids['ECE'], '3rd Floor', '301', 'Embedded Systems Lab'),

        # EEE Block
        (b_ids['EEE'], 'Ground Floor', 'G05', 'High Voltage Lab'),
        (b_ids['EEE'], '1st Floor', '101', 'Power Electronics Lab'),
        (b_ids['EEE'], '1st Floor', '102', 'Classroom EE1'),
        (b_ids['EEE'], '2nd Floor', '201', 'EEE Staff Room'),
        (b_ids['EEE'], '2nd Floor', '202', 'Circuits & Simulation Lab'),

        # Main Block
        (b_ids['MAIN'], 'Ground Floor', 'G01', 'Dean Office'),
        (b_ids['MAIN'], 'Ground Floor', 'G02', 'Principal Office'),
        (b_ids['MAIN'], '1st Floor', '101', 'Main Auditorium Hall A'),
        (b_ids['MAIN'], '1st Floor', '102', 'Conference Hall 1'),
        (b_ids['MAIN'], '2nd Floor', '201', 'Examination Cell'),
        (b_ids['MAIN'], '2nd Floor', '202', 'Placement Center'),
        (b_ids['MAIN'], '3rd Floor', '301', 'Council Room'),

        # Science Block
        (b_ids['SCI'], 'Ground Floor', 'G01', 'Physics Lab'),
        (b_ids['SCI'], '1st Floor', '101', 'Chemistry Lab'),
        (b_ids['SCI'], '2nd Floor', '201', 'Maths Faculty Room'),
        (b_ids['SCI'], '2nd Floor', '202', 'Lecture Room S1'),

        # Library Block
        (b_ids['LIB'], 'Ground Floor', 'G01', 'Issue & Return Counter'),
        (b_ids['LIB'], '1st Floor', '101', 'Digital Reference Section'),
        (b_ids['LIB'], '2nd Floor', '201', 'Quiet Study Area'),
        (b_ids['LIB'], '2nd Floor', '202', 'Journal Archive'),
    ]
    cursor.executemany("INSERT INTO rooms (building_id, floor_name, room_number, room_type) VALUES (?, ?, ?, ?)", rooms_data)
    conn.commit()

    # 4. Seed Faculty
    faculty_data = [
        (user_ids['faculty'], 'Dr. Arun Kumar', 'arunkumar@college.edu', 'Computer Science and Engineering', 'Assistant Professor', '+91 98765 43210', 'CSE Block - 204', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
        (user_ids['priya_sharma'], 'Dr. Priya Sharma', 'priyasharma@college.edu', 'Computer Science and Engineering', 'Associate Professor', '+91 98765 43211', 'CSE Block - 303', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'),
        (user_ids['ravi_kumar'], 'Dr. Ravi Kumar', 'ravikumar@college.edu', 'Electronics and Communication', 'Assistant Professor', '+91 98765 43212', 'ECE Block - 201', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'),
        (user_ids['meena_r'], 'Dr. Meena R', 'meenar@college.edu', 'Electrical and Electronics', 'Assistant Professor', '+91 98765 43213', 'EEE Block - 201', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'),
        (user_ids['rajesh_v'], 'Prof. Rajesh Verma', 'rajeshverma@college.edu', 'Computer Science and Engineering', 'Professor & HOD', '+91 98765 43214', 'CSE Block - 302', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'),
    ]
    cursor.executemany("INSERT INTO faculty (user_id, name, email, department, designation, phone, cabin_room, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", faculty_data)
    conn.commit()

    faculty_ids = {row['name']: row['id'] for row in cursor.execute("SELECT id, name FROM faculty").fetchall()}

    # 5. Seed Students
    student_data = [
        (user_ids['student'], 'Rahul Sharma', '21CS045', 'Computer Science and Engineering', 6, 'A', 'rahul.21cs@college.edu')
    ]
    cursor.executemany("INSERT INTO students (user_id, name, roll_number, department, semester, section, email) VALUES (?, ?, ?, ?, ?, ?, ?)", student_data)
    conn.commit()

    # 6. Seed Locations (Current Location & Availability)
    # Dr. Arun Kumar starts at CSE Block -> 2nd Floor -> Room 204 (Available)
    locations_data = [
        (faculty_ids['Dr. Arun Kumar'], 'CSE Block', '2nd Floor', '204', 'Available', 1, 'In Cabin 204 for Student Mentoring', '2026-09-06 10:35:00'),
        (faculty_ids['Dr. Priya Sharma'], 'CSE Block', '2nd Floor', '201', 'Busy', 1, 'Taking AI Lab Practical Exam', '2026-09-06 10:15:00'),
        (faculty_ids['Dr. Ravi Kumar'], 'ECE Block', '1st Floor', '101', 'Available', 1, 'In DSP Lab', '2026-09-06 09:45:00'),
        (faculty_ids['Dr. Meena R'], 'EEE Block', '2nd Floor', '201', 'Not Available', 1, 'Attending Faculty Meeting', '2026-09-06 09:00:00'),
        (faculty_ids['Prof. Rajesh Verma'], 'CSE Block', '3rd Floor', '302', 'Available', 0, 'In HOD Chamber (Location Sharing Restricted)', '2026-09-06 10:00:00'),
    ]
    cursor.executemany("""
    INSERT INTO locations (faculty_id, building_name, floor, room, status, sharing_enabled, remarks, updated_at) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, locations_data)
    conn.commit()

    # 7. Seed Timetable
    timetable_data = [
        # Dr. Arun Kumar
        (faculty_ids['Dr. Arun Kumar'], 'Monday', '09:00', '10:00', 'CS301', 'Database Management Systems', 'CSE Block', '204'),
        (faculty_ids['Dr. Arun Kumar'], 'Monday', '10:00', '11:00', 'CS302', 'Operating Systems', 'CSE Block', '205'),
        (faculty_ids['Dr. Arun Kumar'], 'Monday', '11:00', '12:00', 'FREE', 'Staff / Free Period', 'CSE Block', '204'),
        (faculty_ids['Dr. Arun Kumar'], 'Monday', '13:30', '15:30', 'CS308', 'DBMS Practical Lab', 'CSE Block', 'G01'),
        (faculty_ids['Dr. Arun Kumar'], 'Tuesday', '10:00', '11:00', 'CS301', 'Database Management Systems', 'CSE Block', '101'),
        (faculty_ids['Dr. Arun Kumar'], 'Tuesday', '11:00', '12:00', 'CS302', 'Operating Systems', 'CSE Block', '102'),
        (faculty_ids['Dr. Arun Kumar'], 'Wednesday', '09:00', '11:00', 'CS308', 'OS Lab Session', 'CSE Block', '205'),
        (faculty_ids['Dr. Arun Kumar'], 'Thursday', '14:00', '15:00', 'CS301', 'Database Management Systems', 'CSE Block', '204'),
        (faculty_ids['Dr. Arun Kumar'], 'Friday', '11:00', '12:00', 'CS302', 'Operating Systems', 'CSE Block', '205'),

        # Dr. Priya Sharma
        (faculty_ids['Dr. Priya Sharma'], 'Monday', '09:00', '11:00', 'CS401', 'Artificial Intelligence', 'CSE Block', '201'),
        (faculty_ids['Dr. Priya Sharma'], 'Monday', '11:00', '12:00', 'CS405', 'Machine Learning Seminar', 'CSE Block', '203'),
        (faculty_ids['Dr. Priya Sharma'], 'Tuesday', '09:00', '10:00', 'CS401', 'Artificial Intelligence', 'CSE Block', '101'),

        # Dr. Ravi Kumar
        (faculty_ids['Dr. Ravi Kumar'], 'Monday', '09:00', '11:00', 'EC301', 'Digital Signal Processing', 'ECE Block', '101'),
        (faculty_ids['Dr. Ravi Kumar'], 'Monday', '11:00', '12:00', 'EC303', 'VLSI Design Basics', 'ECE Block', '102'),

        # Dr. Meena R
        (faculty_ids['Dr. Meena R'], 'Monday', '09:00', '10:00', 'EE201', 'Circuit Theory', 'EEE Block', '102'),
        (faculty_ids['Dr. Meena R'], 'Monday', '10:00', '12:00', 'EE205', 'Power Systems Lab', 'EEE Block', '101'),

        # Prof. Rajesh Verma
        (faculty_ids['Prof. Rajesh Verma'], 'Monday', '10:00', '11:00', 'CS501', 'Advanced Algorithms', 'CSE Block', '301'),
        (faculty_ids['Prof. Rajesh Verma'], 'Monday', '14:00', '16:00', 'MEET', 'Departmental Review Meeting', 'Main Block', '102'),
    ]
    cursor.executemany("""
    INSERT INTO timetable (faculty_id, day_of_week, start_time, end_time, subject_code, subject_name, building, room)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, timetable_data)
    conn.commit()

    conn.close()
    print("Database seeded successfully!")

if __name__ == '__main__':
    seed_db()
