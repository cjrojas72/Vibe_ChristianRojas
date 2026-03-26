// src/api/auth.js
import { getEmployees, getUser } from './service';

// Simulated customer list (for demo, can be replaced with API later)
const mockCustomers = [
  { id: 1, name: 'Alice Smith', email: 'alice@bank.com', role: 'customer' },
  { id: 2, name: 'Bob Lee', email: 'bob@bank.com', role: 'customer' },
];


// No need to map email, use real email from backend
export function mapEmployeeToLogin(employee) {
  return {
    ...employee,
    role: 'employee',
  };
}

export async function login(email, password, role) {
  if (role.toLowerCase() === 'employee') {
    const employees = await getEmployees();
    const found = employees.find(e => e.email && e.email.toLowerCase() === email.toLowerCase());
    if (!found) throw new Error('Employee not found');
    return { ...found, role: 'employee' };
  } else {
    // Use new backend /login route for customer
    const res = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    // Fetch user details by id
    const user = await getUser(data.user_id);
    return { ...user, role: 'customer' };
  }
}

export async function signup({ name, email, password, role }) {
  // Only allow customer signup for now
  if (role.toLowerCase() !== 'customer') throw new Error('Only customer signup supported');
  // In real app, call API to create user
  // For now, do nothing and simulate success
  return true;
}
