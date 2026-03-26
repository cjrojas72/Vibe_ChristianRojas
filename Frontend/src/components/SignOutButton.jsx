import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function SignOutButton() {
  const { logout } = useAuth();
  return (
    <button
      className="ml-2 px-4 py-2 rounded-xl bg-gray-500 text-white font-semibold text-sm hover:bg-red-500 transition duration-150"
      onClick={logout}
      aria-label="Sign out"
    >
      Sign Out
    </button>
  );
}
