// src/api/auth.js
import { getEmployees, getUser } from './service';

const BASE_URL = import.meta.env.API_BASE_URL || "http://localhost:5000";

// Simulated customer list (for demo, can be replaced with API later)
// const mockCustomers = [
//   { id: 1, name: 'Alice Smith', email: 'alice@bank.com', role: 'customer' },
//   { id: 2, name: 'Bob Lee', email: 'bob@bank.com', role: 'customer' },
// ];


export async function login(email, password) {
  // Use backend /login route for all users
  const res = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  // Fetch user details by id
  const user = await getUser(data.user_id);
  // Use role from backend/jwt
  return { user: { ...user, role: data.role }, token: data.token };
}

export async function signup({ name, email, password, role }) {
  // Only allow customer signup for now
  if (role.toLowerCase() !== 'customer') throw new Error('Only customer signup supported');
  // In real app, call API to create user
  // For now, do nothing and simulate success
  return true;
}
