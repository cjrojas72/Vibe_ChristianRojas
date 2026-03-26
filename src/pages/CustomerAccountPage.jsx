import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAccount, getTransactions, deposit, withdraw } from '../api/service';
import TransactionList from '../components/TransactionList';
import DepositWithdrawForm from '../components/DepositWithdrawForm';

export default function CustomerAccountPage() {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('deposit');
  const [message, setMessage] = useState('');
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const acc = await getAccount(accountId);
      setAccount(acc);
      const txns = await getTransactions(accountId);
      setTransactions(txns);
      console.log(txns);
    } catch (e) {
      setError(e.message || 'Failed to load account');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [accountId]);

  const handleAction = (type) => {
    setFormType(type);
    setShowForm(true);
  };

  const handleSubmit = async (amount) => {
    try {
      if (formType === 'deposit') {
        await deposit(accountId, amount);
        setMessage('Deposit successful');
      } else {
        await withdraw(accountId, amount);
        setMessage('Withdrawal successful');
      }
      setShowForm(false);
      await fetchData();
    } catch (e) {
      setMessage(e.message || 'Error');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-5 md:py-10 md:px-7 lg:py-12 lg:px-10 font-sans">
      <div className="max-w-[1280px] xl:max-w-[70vw] mx-auto space-y-7 md:space-y-8">
        {/* Back Button */}
        <div className="w-full max-w-[500px] mx-auto mb-2">
          <button
            className="flex items-center gap-2 text-blue-700 font-semibold text-sm px-3 py-2 hover:bg-blue-50 transition mb-2"
            onClick={() => navigate('/customer/home')}
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Accounts
          </button>
        </div>
        {/* Account Card Header */}
        {loading && <div className="text-gray-500">Loading...</div>}
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {account && !loading && !error && (
          <div className="w-full max-w-[500px] mx-auto bg-white rounded-3xl p-6 shadow-md border border-gray-200 mb-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-lg font-bold text-blue-900">{account.accountType} Account</div>
                <div className="text-sm font-medium text-gray-500">ending in {String(account.accountId).slice(-4)}</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-900">${account.balance?.toLocaleString()}</div>
                <div className="text-sm font-medium text-gray-500">Available</div>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                className="px-4 py-2 rounded-lg bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition"
                onClick={() => handleAction('deposit')}
              >
                Deposit
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-semibold shadow hover:bg-blue-100 transition"
                onClick={() => handleAction('withdraw')}
              >
                Withdraw
              </button>
            </div>
            {message && <div className="mt-2 text-green-600">{message}</div>}
          </div>
        )}
        {/* Transactions List */}
        <div className="w-full max-w-[500px] mx-auto bg-white rounded-3xl p-6 shadow-md border border-gray-200">
          <h2 className="text-lg font-bold text-blue-900 mb-4">Transactions</h2>
          <TransactionList transactions={transactions} />
        </div>
        {showForm && <DepositWithdrawForm type={formType} onSubmit={handleSubmit} onClose={() => setShowForm(false)} />}
      </div>
    </div>
  );
}
