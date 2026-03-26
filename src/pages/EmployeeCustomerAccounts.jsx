import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserAccounts, getUser } from '../api/service';
import AccountTable from '../components/AccountTable';

export default function EmployeeCustomerAccounts() {
  const { customerId } = useParams();
  const [accounts, setAccounts] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError('');
    Promise.all([
      getUser(customerId),
      getUserAccounts(customerId)
    ])
      .then(([user, accs]) => {
        setCustomer(user);
        setAccounts(accs);
      })
      .catch(e => setError(e.message || 'Failed to load customer accounts'))
      .finally(() => setLoading(false));
  }, [customerId]);

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-5 md:py-10 md:px-7 lg:py-12 lg:px-10 font-sans">
      <div className="max-w-[1280px] xl:max-w-[70vw] mx-auto">
        <button
          className="mb-4 flex items-center text-blue-700 hover:underline text-sm font-medium"
          onClick={() => navigate(-1)}
        >
          <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" /></svg>
          Back
        </button>
        <h2 className="text-2xl font-bold text-blue-900 mb-2">Customer Accounts</h2>
        {customer && <div className="mb-4 text-lg text-gray-700">{customer.name} ({customer.email})</div>}
        {loading && <div className="text-gray-500">Loading...</div>}
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {!loading && !error && <AccountTable accounts={accounts} />}
      </div>
    </div>
  );
}
