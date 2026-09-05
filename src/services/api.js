const API_BASE = import.meta.env.VITE_API_BASE || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' && window.location.port === '5173' ? 'http://127.0.0.1:8000/api/v1' : '/api/v1');

async function fetchWithTimeout(url, options = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(id);
  }
}

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function loginRequest(username, password) {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);
  const res = await fetchWithTimeout(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString(),
  });
  if (!res.ok) throw new Error((await res.json()).detail || 'Login failed.');
  return res.json();
}

export async function registerRequest({ email, username, password, full_name }) {
  const res = await fetchWithTimeout(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, username, password, full_name }),
  });
  if (!res.ok) throw new Error((await res.json()).detail || 'Registration failed.');
  return res.json();
}

export async function saveProfile(profile) {
  const res = await fetchWithTimeout(`${API_BASE}/profile/me`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(profile),
  });
  if (!res.ok) throw new Error('Could not save profile to backend');
  return res.json();
}

export async function fetchProfile() {
  const res = await fetchWithTimeout(`${API_BASE}/profile/me`, { headers: authHeaders() });
  if (!res.ok) throw new Error('No saved profile');
  return res.json();
}

export async function twinChat(message, profile, history) {
  const res = await fetchWithTimeout(`${API_BASE}/twin/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ message, profile, history }),
  }, 15000);
  if (!res.ok) throw new Error('Twin chat request failed');
  return res.json();
}

export async function fetchChatHistory() {
  const res = await fetchWithTimeout(`${API_BASE}/twin/history`, {
    headers: authHeaders()
  });
  if (!res.ok) return [];
  return res.json();
}

export async function fetchOpportunities() {
  const res = await fetchWithTimeout(`${API_BASE}/twin/opportunities`, {
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Could not fetch opportunities');
  return res.json();
}

export async function fetchStudyTwins() {
  const res = await fetchWithTimeout(`${API_BASE}/twin/peers`, {
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Could not fetch study twins');
  return res.json();
}

export async function fetchTwinAnalytics() {
  const res = await fetchWithTimeout(`${API_BASE}/twin/analytics`, {
    headers: authHeaders()
  });
  if (!res.ok) throw new Error('Could not fetch analytics');
  return res.json();
}

export async function twinInsights(profile) {
  const res = await fetchWithTimeout(`${API_BASE}/twin/insights`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ profile }),
  }, 15000);
  if (!res.ok) throw new Error('Twin insights request failed');
  return res.json();
}
