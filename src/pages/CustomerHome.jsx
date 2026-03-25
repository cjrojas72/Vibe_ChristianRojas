import React, { useEffect, useState } from 'react';
import { mockApi } from '../api/mockApi';
import AccountCard from '../components/AccountCard';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SignOutButton from '../components/SignOutButton';

export default function CustomerHome() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      mockApi.getAccounts(user.id).then(setAccounts);
    }
  }, [user]);

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-5 md:py-10 md:px-7 lg:py-12 lg:px-10 font-sans">
      <div className="max-w-[1280px] xl:max-w-[70vw] mx-auto space-y-7 md:space-y-8">
        {/* Header */}
        <div className="w-full max-w-[420px] mx-auto flex items-center justify-between pb-2">
          <h1 className="text-3xl font-extrabold text-blue-900">
            Hi {user?.name || 'Customer'}!
          </h1>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-full hover:bg-white transition duration-150">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-900/60">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-gray-100"></span>
            </button>
            <SignOutButton />
          </div>
        </div>
        {/* Total Balance Card */}
        <div className="w-full max-w-[500px] mx-auto">
          <div className="rounded-3xl p-6 mb-6 bg-white border border-gray-200 text-blue-900 flex flex-col items-start gap-1 shadow-md">
            <div className="flex w-full items-center justify-between">
              <div className="text-base font-semibold text-blue-900/90">Total Balance</div>
              <div className="w-8 h-5 bg-gray-100 rounded"></div>
            </div>
            <div className="text-4xl font-extrabold tracking-tight text-blue-900 mb-1">
              ${accounts.reduce((sum, a) => sum + a.balance, 0).toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 font-medium">
              as of today
            </div>
          </div>
        </div>
        {/* Accounts Card */}
        <div className="w-full max-w-[500px] mx-auto bg-white rounded-3xl p-6 shadow-md border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-blue-900">Accounts</h2>
            <div className="bg-blue-50 rounded-full px-3 py-1 inline-block text-blue-700 text-xs font-semibold">
              {accounts.length} {accounts.length === 1 ? 'Account' : 'Accounts'}
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {accounts.map(acc => (
              <AccountCard key={acc.id} account={acc} onClick={() => navigate(`/customer/accounts/${acc.id}`)} />
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-200">
            <button className="w-full text-center py-2.5 bg-blue-700 text-white text-sm font-semibold rounded-xl hover:bg-blue-800 transition duration-150">
              View All Account Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
