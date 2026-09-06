import unittest
import json
from app import app
from database import seed_db

class BackendTestCase(unittest.TestCase):
    def setUp(self):
        seed_db()
        self.client = app.test_client()

    def test_01_health(self):
        res = self.client.get('/api/health')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertEqual(data['status'], 'online')

    def test_02_login_student_faculty_admin(self):
        # Student Login
        res_stu = self.client.post('/api/auth/login', json={'username': 'student', 'password': 'student123'})
        self.assertEqual(res_stu.status_code, 200)
        self.assertIn('token', json.loads(res_stu.data))

        # Faculty Login
        res_fac = self.client.post('/api/auth/login', json={'username': 'faculty', 'password': 'faculty123'})
        self.assertEqual(res_fac.status_code, 200)
        self.assertIn('token', json.loads(res_fac.data))

        # Admin Login
        res_adm = self.client.post('/api/auth/login', json={'username': 'admin', 'password': 'admin123'})
        self.assertEqual(res_adm.status_code, 200)
        self.assertIn('token', json.loads(res_adm.data))

    def test_03_faculty_listing_and_timetable_difference(self):
        # Monday 10:30 AM Dr. Arun has Operating Systems in CSE 205, but his manual location is CSE 204
        res = self.client.get('/api/faculty?day=Monday&time=10:30')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        faculty = data['faculty']
        self.assertTrue(len(faculty) >= 4)
        
        arun = next((f for f in faculty if 'Arun Kumar' in f['name']), None)
        self.assertIsNotNone(arun)
        self.assertEqual(arun['building_name'], 'CSE Block')
        self.assertEqual(arun['room'], '204')
        self.assertTrue(arun['location_differs'])
        self.assertIn("Location differs from timetable", arun['difference_reason'])

    def test_04_privacy_masking(self):
        # Prof. Rajesh Verma has sharing_enabled = 0
        res = self.client.get('/api/faculty')
        data = json.loads(res.data)
        rajesh = next((f for f in data['faculty'] if 'Rajesh Verma' in f['name']), None)
        self.assertIsNotNone(rajesh)
        self.assertEqual(rajesh['room_display'], 'Location sharing restricted by faculty')
        self.assertEqual(rajesh['sharing_enabled'], False)

    def test_05_faculty_location_update(self):
        # Login as faculty
        res_fac = self.client.post('/api/auth/login', json={'username': 'faculty', 'password': 'faculty123'})
        token = json.loads(res_fac.data)['token']
        fac_id = json.loads(res_fac.data)['user']['faculty']['id']

        headers = {'Authorization': f'Bearer {token}'}
        update_res = self.client.put(f'/api/faculty/{fac_id}/location', headers=headers, json={
            'building': 'Main Block',
            'floor': '1st Floor',
            'room': '101',
            'status': 'Busy',
            'sharing_enabled': True,
            'remarks': 'Attending Meeting'
        })
        self.assertEqual(update_res.status_code, 200)
        
        # Verify updated
        verify_res = self.client.get(f'/api/faculty/{fac_id}')
        v_data = json.loads(verify_res.data)['faculty']
        self.assertEqual(v_data['building_name'], 'Main Block')
        self.assertEqual(v_data['room'], '101')
        self.assertEqual(v_data['status'], 'Busy')

    def test_06_demo_presets(self):
        res = self.client.post('/api/demo/preset', json={'action': 'preset_2'})
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertEqual(data['faculty']['status'], 'Busy')
        self.assertEqual(data['faculty']['room'], '205')

if __name__ == '__main__':
    unittest.main()
