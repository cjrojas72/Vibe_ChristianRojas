import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTransactions } from '../api/service';
import TransactionList from '../components/TransactionList';

export default function EmployeeAccountTransactions() {
  // Support both accountId and account_id from params (MongoDB string)
  const { accountId } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError('');
    getTransactions(accountId)
      .then(setTransactions)
      .catch(e => setError(e.message || 'Failed to load transactions'))
      .finally(() => setLoading(false));
  }, [accountId]);

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
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Account Transactions</h2>
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4">
          {loading && <div className="text-gray-500">Loading...</div>}
          {error && <div className="text-red-600 mb-2">{error}</div>}
          {!loading && !error && <TransactionList transactions={transactions} />}
        </div>
      </div>
    </div>
  );
}
