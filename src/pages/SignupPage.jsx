import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockApi } from '../api/mockApi';

const roles = ['Customer', 'Employee'];

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Customer');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await mockApi.signup({ name, email, password, role });
      setSuccess('Signup successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError('Signup failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 font-sans">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md w-80">
        <h2 className="text-2xl mb-4 font-bold text-blue-900">Sign Up</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
        <div className='flex flex-col items-start'>
          <label htmlFor="name">Name</label>
          <input id="name" type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="input mb-2 w-full border border-gray-300 rounded-md p-2" required />
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="input mb-2 w-full border border-gray-300 rounded-md p-2" required />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="input mb-2 w-full border border-gray-300 rounded-md p-2" required />
          <label htmlFor="role">Role</label>
          <select id="role" value={role} onChange={e => setRole(e.target.value)} className="input mb-4 w-full border border-gray-300 rounded-md p-2">
            {roles.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <button type="submit" className="btn w-full btn-primary">Sign Up</button>
        <div className="mt-2 text-sm">Already have an account? <a href="/login" className="text-blue-700">Login</a></div>
      </form>
    </div>
  );
}
