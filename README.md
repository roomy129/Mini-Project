# Smart Faculty Location & Availability Tracking System

A full-stack college portal module designed for academic institutions to help students and staff instantly discover where faculty members are currently available across campus buildings.

---

## 📌 Project Overview

In large university campuses, students often waste significant time walking across multiple departments, classrooms, laboratories, and staff rooms searching for professors to ask doubts, submit assignments, or get project approvals.

This **Mini Project Demo** provides a simple, professional, and reliable ERP module that allows:
1. **Faculty Members** to manually broadcast their current location (Building, Floor, Room), availability status (🟢 Available, 🟡 Busy, 🔴 Not Available), and toggle location privacy.
2. **Students** to search for professors, view their current reported locations, and receive automatic **Timetable Discrepancy Alerts** (`⚠ Location differs from timetable`).
3. **Administrators** to view a live campus location matrix and manage faculty, student records, timetable schedules, and rooms.
4. **Interactive 1-Click Demo Mode** for presentations and viva examinations.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | React.js 18 + Vite | Modern UI, responsive layout, state management, custom college portal CSS design system |
| **Backend** | Python Flask | Lightweight REST API, CORS support, JWT authentication, timetable difference engine |
| **Database** | SQLite3 | Relational database (zero external cloud database setup required) |
| **Security** | Werkzeug + JWT | Salted password hashing, role-based authorization, privacy protection masking |

---

## 👥 User Roles & Demo Credentials

The portal comes pre-seeded with sample data and dedicated demo accounts. The login screen features 1-click credential auto-fill buttons:

| Role | Username | Password | Access Capabilities |
|---|---|---|---|
| **Student** | `student` | `student123` | Search faculty, view live locations, check timetable differences, campus map |
| **Faculty** | `faculty` | `faculty123` | Broadcast current location, change availability, toggle privacy ON/OFF, view schedule |
| **Admin** | `admin` | `admin123` | View campus location matrix, CRUD management for faculty, students, and timetables |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.10+**
- **Node.js 18+**

### Option A: 1-Click Launch (Windows)
Double-click `start_all.bat` in the root folder, or run:
```bat
start_all.bat
```

### Option B: Manual Terminal Launch

#### 1. Start the Flask Backend
```bash
cd backend
python -m pip install -r requirements.txt
python database.py
python app.py
```
> Backend API will be available at: `http://localhost:5000`

#### 2. Start the React Frontend
```bash
cd frontend
npm install
npm run dev
```
> Open browser at: `http://localhost:5173`

---

## 🌟 Key Features

### 1. Find Faculty (Main Feature)
- Search by faculty name, department, or campus building.
- Displays **Current / Last Known Location** (Building → Floor → Room) and status (🟢 Available, 🟡 Busy, 🔴 Not Available).
- Displays **Expected Location from Timetable** (e.g., `CSE Block → Room 205 (10:00 AM – 11:00 AM)`).
- **Difference Detection**: When reported location does not match the active scheduled class, the card automatically highlights:
  > **⚠ Location differs from timetable.**
  > *Possible reason: Faculty may have moved or timetable may not reflect the current activity.*

### 2. Faculty Location & Availability Updater
- Simple dropdown selection for Building, Floor, and Room.
- Status radio selector: `🟢 Available`, `🟡 Busy`, `🔴 Not Available`.
- **Location Sharing / Privacy Toggle (ON / OFF)**:
  - **ON**: Students see exact room (`CSE Block → 2nd Floor → Room 204`).
  - **OFF**: Students see building only (`📍 CSE Block - Location sharing restricted by faculty`).
- Quick status presets for fast updates during lectures.

### 3. Interactive Campus Schematic Map
- Pure HTML/CSS/SVG visual building schematic (zero external map APIs).
- Visualizes **CSE Block**, **ECE Block**, **EEE Block**, **Main Block**, **Science Block**, and **Library Block**.
- Displays occupant counts and list of professors present in each building.
- Automatically highlights target building when viewing faculty profiles.

### 4. Admin Management Dashboard
- KPI summary cards (Total Faculty, Total Students, Available, Busy).
- Live Faculty Location Matrix with filters.
- Add / Delete Faculty accounts.
- Add / Delete Student accounts.
- Manage Timetable entries.

### 5. 🎬 1-Click Presentation Demo Mode
The top floating toolbar provides instant viva presentation test triggers:
1. **Set Dr. Arun Kumar → CSE Block → Room 204 → Available**
2. **Set Dr. Arun Kumar → CSE Block → Room 205 → Busy**
3. **Set Dr. Arun Kumar → Main Block → Room 101 → Available**
4. **Turn Location Sharing OFF (Hide Room)**
5. **Turn Location Sharing ON (Show Room)**
6. **Reset Demo Data** (Restores clean seed state)

---

## 📂 Project Structure

```
MINI PROJECT/
├── backend/
│   ├── app.py               # Flask REST API routes & controllers
│   ├── auth.py              # JWT authentication & role authorization
│   ├── database.py          # SQLite schema & database seeder
│   ├── models.py            # Business logic, difference engine & queries
│   ├── requirements.txt     # Python dependencies
│   ├── test_backend.py      # Automated backend unit tests
│   └── smart_faculty.db     # SQLite database
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── CampusMap.jsx
│   │   │   ├── DemoModeBar.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Toast.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── FindFacultyPage.jsx
│   │   │   ├── FacultyDetailsPage.jsx
│   │   │   ├── FacultyDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── TimetablePage.jsx
│   │   │   ├── CampusMapPage.jsx
│   │   │   ├── AboutProjectPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css        # University portal design system
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── run_backend.bat          # Script to run backend
├── run_frontend.bat         # Script to run frontend
├── start_all.bat            # 1-Click launch script
└── README.md
```

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate user & return JWT token |
| `GET` | `/api/auth/me` | Fetch active user session |
| `GET` | `/api/faculty` | List faculty with live locations & timetable difference |
| `GET` | `/api/faculty/:id` | Get specific faculty details & schedules |
| `PUT` | `/api/faculty/:id/location` | Update faculty location & status |
| `PUT` | `/api/faculty/:id/privacy` | Toggle location privacy ON/OFF |
| `GET` | `/api/buildings` | List campus buildings & current occupants |
| `GET` | `/api/rooms` | Query rooms by building |
| `GET` | `/api/timetable` | Query master timetable schedule |
| `POST` | `/api/timetable` | Add timetable entry (Admin) |
| `DELETE` | `/api/timetable/:id` | Delete timetable entry (Admin) |
| `GET` | `/api/admin/stats` | Admin metrics & analytics |
| `POST` | `/api/admin/faculty` | Register new faculty profile (Admin) |
| `DELETE` | `/api/admin/faculty/:id` | Remove faculty member (Admin) |
| `POST` | `/api/demo/preset` | Trigger 1-click demo actions |
| `POST` | `/api/demo/reset` | Reset database to initial seed |

---

## ⚠️ Limitations & Future Work

### Mini-Project Scope Limitations:
1. Location relies on manual updates submitted by faculty members.
2. Intentionally built without GPS tracking or hardware sensors.
3. Indoor location is not automatically sensed.
4. Timetables reflect standard schedules and may not account for unannounced cancellations.

### Future Roadmap:
- Mobile Application (Android / iOS).
- BLE Beacon & Wi-Fi Indoor Positioning.
- AI-based Availability Prediction Engine.
- Real-time Push Notifications.
- Outlook & Google Calendar Sync.

---

## 🎓 Academic Viva Presentation Tips

1. **Start on Login Screen**: Showcase the 1-click demo credentials for Student, Faculty, and Admin.
2. **Login as Student**:
   - Show KPI metrics (Available, Busy, Total Faculty).
   - Use the **Find Faculty** search bar to search for `Dr. Arun Kumar`.
   - Point out the **CURRENT / LAST UPDATED LOCATION** (`CSE Block, Room 204`) vs. **EXPECTED LOCATION FROM TIMETABLE** (`CSE Block, Room 205`).
   - Highlight the discrepancy badge: `⚠ Location differs from timetable.`
3. **Use Demo Mode Bar**:
   - Click **2. CSE 205 (Busy)** → Notice the card updates immediately to Busy.
   - Click **4. Privacy OFF** → Notice the room is masked: `📍 CSE Block (Location sharing restricted by faculty)`.
   - Click **5. Privacy ON** → Notice full room visibility is restored.
4. **Login as Faculty**:
   - Show the **UPDATE MY LOCATION** form with dropdowns and availability radio options.
   - Update to `Main Block -> 1st Floor -> Room 101 (Available)` and click `[ UPDATE LOCATION ]`.
5. **Open Campus Map**:
   - Show the interactive building occupancy schematic and inspect professors in CSE Block.
6. **Login as Admin**:
   - Show the full management dashboard, student registration, and live matrix.

---
© 2026 Apex Institute of Technology • Smart Faculty Tracking System
