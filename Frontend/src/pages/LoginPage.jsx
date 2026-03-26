import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';

const roles = ['Customer', 'Employee'];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Customer');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await loginApi(email, password, role);
      login(user);
      if (role.toLowerCase() === 'customer') navigate('/customer/home');
      else navigate('/employee/home');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 font-sans">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md w-80">
        <h2 className="text-2xl mb-4 font-bold text-blue-900">Login</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <div className='flex flex-col items-start'>
            <label htmlFor="email" className=''>Email</label>
            <input id="email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="input mb-2 w-full border border-gray-300 rounded-md p-2" required />
            <label htmlFor="password">Password</label>
            <input id="password" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="input mb-2 w-full border border-gray-300 rounded-md p-2" required />
            <label htmlFor="role">Role</label>
            <select id="role" value={role} onChange={e => setRole(e.target.value)} className="input mb-4 w-full border border-gray-300 rounded-md p-2">
            {roles.map(r => <option key={r}>{r}</option>)}
            </select>
        </div>
        <button type="submit" className="btn w-full btn-primary">Login</button>
        <div className="mt-2 text-sm">Don't have an account? <a href="/signup" className="text-blue-700">Sign up</a></div>
      </form>
    </div>
  );
}
