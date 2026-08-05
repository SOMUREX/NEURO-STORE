const API_BASE = '/api';

export async function fetchFiles(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/files?${query}`);
  if (!res.ok) throw new Error('Failed to fetch files');
  return res.json();
}

export async function fetchFileById(id) {
  const res = await fetch(`${API_BASE}/files/${id}`);
  if (!res.ok) throw new Error('Failed to fetch file details');
  return res.json();
}

export async function uploadFileApi(formData) {
  const res = await fetch(`${API_BASE}/files/upload`, {
    method: 'POST',
    body: formData,
  });
  const data = await res.json();
  if (res.status === 409) {
    return { duplicateDetected: true, ...data };
  }
  if (!res.ok) throw new Error(data.error || 'Upload failed');
  return data;
}

export async function deleteFileApi(fileId, userId, userName) {
  const res = await fetch(`${API_BASE}/files/${fileId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, userName })
  });
  if (!res.ok) throw new Error('Failed to delete file');
  return res.json();
}

export async function fetchSearch(queryParams) {
  const query = new URLSearchParams(queryParams).toString();
  const res = await fetch(`${API_BASE}/search?${query}`);
  if (!res.ok) throw new Error('Search failed');
  return res.json();
}

export async function fetchAnalytics() {
  const res = await fetch(`${API_BASE}/analytics`);
  if (!res.ok) throw new Error('Failed to load analytics');
  return res.json();
}

export async function fetchAuditLogs() {
  const res = await fetch(`${API_BASE}/audit`);
  if (!res.ok) throw new Error('Failed to load audit logs');
  return res.json();
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

export async function registerUser(name, email, password, role) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  return data;
}

export async function runAICompress(fileId, targetQuality) {
  const res = await fetch(`${API_BASE}/ai/compress`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileId, targetQuality })
  });
  return res.json();
}

export async function runAIFaceLink(fileId) {
  const res = await fetch(`${API_BASE}/ai/face-link`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileId })
  });
  return res.json();
}

export async function runAIVideoSummary(fileId) {
  const res = await fetch(`${API_BASE}/ai/video-summary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fileId })
  });
  return res.json();
}

export async function runAIVectorSearch(queryText) {
  const res = await fetch(`${API_BASE}/ai/vector-search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ queryText })
  });
  return res.json();
}

// IoT ML Engine API functions
export async function fetchIoTDevices() {
  const res = await fetch(`${API_BASE}/iot/devices`);
  if (!res.ok) throw new Error('Failed to fetch IoT devices');
  return res.json();
}

export async function fetchIoTTelemetry(deviceId) {
  const res = await fetch(`${API_BASE}/iot/telemetry/${deviceId}`);
  if (!res.ok) throw new Error('Failed to fetch telemetry stream');
  return res.json();
}

export async function runIoTInference(deviceId, modelType) {
  const res = await fetch(`${API_BASE}/iot/infer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deviceId, modelType })
  });
  if (!res.ok) throw new Error('IoT ML inference failed');
  return res.json();
}

export async function simulateIoTSpike(deviceId) {
  const res = await fetch(`${API_BASE}/iot/simulate-spike`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deviceId })
  });
  if (!res.ok) throw new Error('Failed to simulate spike');
  return res.json();
}
