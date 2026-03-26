// src/api/auth.js
import { getEmployees, getUser } from './service';

// Simulated customer list (for demo, can be replaced with API later)
const mockCustomers = [
  { id: 1, name: 'Alice Smith', email: 'alice@bank.com', role: 'customer' },
  { id: 2, name: 'Bob Lee', email: 'bob@bank.com', role: 'customer' },
];

export function mapEmployeeToLogin(employee) {
  return {
    ...employee,
    email: employee.name.toLowerCase().replace(/\s+/g, '') + '@bank.com',
    role: 'employee',
  };
}

export async function login(email, password, role) {
  if (role.toLowerCase() === 'employee') {
    const employees = await getEmployees();
    const mapped = employees.map(mapEmployeeToLogin);
    const found = mapped.find(e => e.email.toLowerCase() === email.toLowerCase());
    if (!found) throw new Error('Employee not found');
    return found;
  } else {
    // Use getUser API to find customer by email
    // Since backend only supports lookup by userId, simulate by trying ids 1-20
    for (let id = 1; id <= 20; id++) {
      try {
        const user = await getUser(id);
        if (user.email && user.email.toLowerCase() === email.toLowerCase()) {
          return { ...user, role: 'customer' };
        }
      } catch (e) {
        // ignore not found
      }
    }
    throw new Error('User not found');
  }
}

export async function signup({ name, email, password, role }) {
  // Only allow customer signup for now
  if (role.toLowerCase() !== 'customer') throw new Error('Only customer signup supported');
  // In real app, call API to create user
  // For now, do nothing and simulate success
  return true;
}
