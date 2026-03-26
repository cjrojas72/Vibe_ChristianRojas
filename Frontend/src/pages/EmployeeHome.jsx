import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../api/service';
import CustomerTable from '../components/CustomerTable';
import SignOutButton from '../components/SignOutButton';

export default function EmployeeHome() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    getAllUsers()
      .then(setCustomers)
      .catch(e => setError(e.message || 'Failed to load customers'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-5 md:py-10 md:px-7 lg:py-12 lg:px-10 font-sans">
      <div className="max-w-[1280px] xl:max-w-[70vw] mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-blue-900">All Customers</h2>
          <SignOutButton />
        </div>
        {loading && <div className="text-gray-500">Loading...</div>}
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {!loading && !error && <CustomerTable customers={customers} />}
      </div>
    </div>
  );
}
