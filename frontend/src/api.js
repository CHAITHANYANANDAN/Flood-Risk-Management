const API = 'http://localhost:5000/api';

export const registerUser = async (data) =>
  fetch(`${API}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json());

export const loginUser = async ({ email, role }) => {
  try {
    const response = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, role }),
    });

    return await response.json();
  } catch (err) {
    return { error: 'Failed to reach server' };
  }
};

export const submitAlert = async (data) =>
  fetch(`${API}/alerts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json());

export const fetchAlerts = async () =>
  fetch(`${API}/alerts`).then(res => res.json());

export const addShelter = async (data) =>
  fetch(`${API}/shelters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(res => res.json());

export const fetchShelters = async () =>
  fetch(`${API}/shelters`).then(res => res.json());
