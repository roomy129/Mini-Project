const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('sfl_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const errorMessage = data.error || data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }
  return data;
}

export const api = {
  // Auth
  async login(username, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return handleResponse(res);
  },

  async getCurrentUser() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Faculty & Locations
  async getFacultyList(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.department && params.department !== 'All') query.append('department', params.department);
    if (params.building && params.building !== 'All') query.append('building', params.building);
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.day) query.append('day', params.day);
    if (params.time) query.append('time', params.time);

    const res = await fetch(`${API_BASE}/faculty?${query.toString()}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async getFacultyDetails(id, params = {}) {
    const query = new URLSearchParams();
    if (params.day) query.append('day', params.day);
    if (params.time) query.append('time', params.time);

    const res = await fetch(`${API_BASE}/faculty/${id}?${query.toString()}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async updateFacultyLocation(facultyId, payload) {
    const res = await fetch(`${API_BASE}/faculty/${facultyId}/location`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  async updateFacultyAvailability(facultyId, status) {
    const res = await fetch(`${API_BASE}/faculty/${facultyId}/availability`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    return handleResponse(res);
  },

  async updateFacultyPrivacy(facultyId, sharing_enabled) {
    const res = await fetch(`${API_BASE}/faculty/${facultyId}/privacy`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ sharing_enabled })
    });
    return handleResponse(res);
  },

  // Buildings & Rooms
  async getBuildings() {
    const res = await fetch(`${API_BASE}/buildings`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async getRooms(params = {}) {
    const query = new URLSearchParams();
    if (params.building_name) query.append('building_name', params.building_name);
    if (params.building_code) query.append('building_code', params.building_code);
    if (params.building_id) query.append('building_id', params.building_id);

    const res = await fetch(`${API_BASE}/rooms?${query.toString()}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Timetable
  async getTimetable(params = {}) {
    const query = new URLSearchParams();
    if (params.faculty_id) query.append('faculty_id', params.faculty_id);
    if (params.day && params.day !== 'All') query.append('day', params.day);

    const res = await fetch(`${API_BASE}/timetable?${query.toString()}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async addTimetableEntry(payload) {
    const res = await fetch(`${API_BASE}/timetable`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  async deleteTimetableEntry(id) {
    const res = await fetch(`${API_BASE}/timetable/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Admin APIs
  async getAdminStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async getAdminFacultyLocations() {
    const res = await fetch(`${API_BASE}/admin/faculty-locations`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async createFaculty(payload) {
    const res = await fetch(`${API_BASE}/admin/faculty`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  async updateFaculty(id, payload) {
    const res = await fetch(`${API_BASE}/admin/faculty/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  async deleteFaculty(id) {
    const res = await fetch(`${API_BASE}/admin/faculty/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async getStudents() {
    const res = await fetch(`${API_BASE}/admin/students`, {
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  async createStudent(payload) {
    const res = await fetch(`${API_BASE}/admin/students`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload)
    });
    return handleResponse(res);
  },

  async deleteStudent(id) {
    const res = await fetch(`${API_BASE}/admin/students/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(res);
  },

  // Demo Actions
  async runDemoPreset(action) {
    const res = await fetch(`${API_BASE}/demo/preset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action })
    });
    return handleResponse(res);
  },

  async resetDemoData() {
    const res = await fetch(`${API_BASE}/demo/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return handleResponse(res);
  }
};
