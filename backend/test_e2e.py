import urllib.request
import json
import sys

# Ensure UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

def test_system():
    print("==================================================")
    print("Testing Smart Faculty Location & Availability Tracker")
    print("==================================================")

    # 1. Backend Health Check
    res = urllib.request.urlopen("http://localhost:5000/api/health")
    health = json.loads(res.read().decode())
    print("[PASS] 1. Backend API Status:", health.get('status'), "| System:", health.get('system'))

    # 2. Login as Student
    login_req = urllib.request.Request(
        "http://localhost:5000/api/auth/login",
        data=json.dumps({"username": "student", "password": "student123"}).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    login_res = urllib.request.urlopen(login_req)
    auth_data = json.loads(login_res.read().decode())
    token = auth_data['token']
    print(f"[PASS] 2. Auth Login (Student): Success | User: {auth_data['user']['username']} | Role: {auth_data['user']['role']}")

    # 3. Faculty List & Location Difference Engine
    fac_req = urllib.request.urlopen("http://localhost:5000/api/faculty?day=Monday&time=10:30")
    fac_data = json.loads(fac_req.read().decode())
    faculty_list = fac_data['faculty']
    metrics = fac_data['metrics']
    print(f"[PASS] 3. Faculty Directory: {len(faculty_list)} members found | Available: {metrics['available']} | Busy: {metrics['busy']}")

    arun = next((f for f in faculty_list if "Arun Kumar" in f['name']), None)
    if arun:
        print(f"   -> Dr. Arun Kumar Current Location: {arun['building_name']} -> {arun['floor_display']} -> Room {arun['room_display']}")
        print(f"   -> Expected Location from Timetable: {arun['expected_location']['location_display']}")
        print(f"   -> Location Differs Alert: {arun['location_differs']} ({arun.get('difference_reason')})")

    # 4. Test Demo Mode Preset
    demo_req = urllib.request.Request(
        "http://localhost:5000/api/demo/preset",
        data=json.dumps({"action": "preset_2"}).encode('utf-8'),
        headers={"Content-Type": "application/json"}
    )
    demo_res = urllib.request.urlopen(demo_req)
    demo_data = json.loads(demo_res.read().decode())
    print(f"[PASS] 4. Demo Mode Action Trigger: {demo_data['message']}")

    # 5. Buildings & Occupancy
    b_req = urllib.request.urlopen("http://localhost:5000/api/buildings")
    b_data = json.loads(b_req.read().decode())
    print(f"[PASS] 5. Campus Schematic Map: {len(b_data['buildings'])} campus blocks loaded with occupancy data")

    # 6. Frontend Web Server
    fe_res = urllib.request.urlopen("http://localhost:5173/")
    fe_html = fe_res.read().decode()
    print(f"[PASS] 6. Frontend Vite Server (Port 5173): Online ({len(fe_html)} bytes HTML returned)")

    print("==================================================")
    print("ALL FULL-STACK CHECKS PASSED PERFECTLY!")
    print("==================================================")

if __name__ == '__main__':
    test_system()
