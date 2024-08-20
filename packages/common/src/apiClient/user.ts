// import { User } from '@/user';

const API_URL = 'http://localhost:3001/api';
// const AUTH_USER_KEY = 'u';

// Function to check session
export async function validateSession() {
  const response = await fetch(`${API_URL}/auth/session`, {
    method: 'GET',
    credentials: 'include', // Important for cookies to be sent and received
  });
  if (!response.ok) throw new Error('Session check failed');
  // const data = await response.json();
}

export async function signup(
  username: string,
  email: string,
  password: string,
) {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
  if (!response.ok) throw new Error('Failed to signup');
  // const user = await response.json();
}

export async function login(username_or_email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username_or_email, password }),
  });
  if (!response.ok) throw new Error('Failed to login');
  const res = await response.json();
  if (res.user) {
    return res.user;
  }
}

export async function logout() {
  const response = await fetch(`${API_URL}/auth/logout`, {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to logout');
}
