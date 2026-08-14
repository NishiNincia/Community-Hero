// src/api.js

export async function getUsers() {
  const res = await fetch('/api/users');
  if (!res.ok) throw new Error('Failed to fetch users');
  return res.json();
}

export async function createUser(userData) {
  const res = await fetch('/api/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!res.ok) throw new Error('Failed to create user');
  return res.json();
}

export async function loginCitizen(credentials) {
  const res = await fetch('/api/auth/citizen/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Citizen login failed');

  if (data.token) {
    localStorage.setItem('token', data.token);
  }

  return data;
}

export async function loginGovernment(credentials) {
  const res = await fetch('/api/auth/government/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Government login failed');

  if (data.token) {
    localStorage.setItem('token', data.token);
  }

  return data;
}

export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error('File upload failed');
  return res.json();
}

export async function confirmIssue(id) {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/issues/${id}/confirm`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to confirm issue');
  return data;
}

export async function fetchComplaints() {
  const res = await fetch('/api/complaints');
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to load complaints');
  return data;
}

export async function createComplaint(payload) {
  const token = localStorage.getItem('token');
  const res = await fetch('/api/complaints', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create complaint');
  return data;
}

export async function updateComplaintStatus(id, status) {
  const token = localStorage.getItem('token');
  const res = await fetch(`/api/complaints/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ status }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update complaint status');
  return data;
}


