import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserAccounts, getUser, createAccount } from '../api/service';
import EditModal from '../components/EditModal';
import AccountTable from '../components/AccountTable';

export default function EmployeeCustomerAccounts() {
  const { customerId } = useParams();
  const [accounts, setAccounts] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [addAccountLoading, setAddAccountLoading] = useState(false);
  const [addAccountError, setAddAccountError] = useState('');

  const fetchData = () => {
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
  };

  useEffect(() => {
    fetchData();
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
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-blue-900">Customer Accounts</h2>
          <button
            className="btn btn-primary"
            onClick={() => setShowAddAccount(true)}
          >
            Add Account
          </button>
        </div>
        {customer && <div className="mb-4 text-lg text-gray-700">{customer.name} ({customer.email})</div>}
        {loading && <div className="text-gray-500">Loading...</div>}
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {!loading && !error && (
          <AccountTable
            accounts={accounts}
            loading={loading}
            onRefresh={fetchData}
          />
        )}
        {showAddAccount && (
          <EditModal
            title="Add Account"
            fields={[
              { name: 'account_type', label: 'Type', options: [
                  { value: 'checking', label: 'Checking' },
                  { value: 'savings', label: 'Savings' }
                ], required: true },
            ]}
            initialValues={{ account_type: '', balance: 0 }}
            onSubmit={async (values) => {
              setAddAccountLoading(true);
              setAddAccountError('');
              try {
                await createAccount(customerId, values.account_type);
                setShowAddAccount(false);
                fetchData();
              } catch (e) {
                setAddAccountError(e.message || 'Failed to add account');
              } finally {
                setAddAccountLoading(false);
              }
            }}
            onClose={() => setShowAddAccount(false)}
          >
            {addAccountError && <div className="text-red-600 mb-2">{addAccountError}</div>}
            {addAccountLoading && <div className="text-gray-500">Adding account...</div>}
          </EditModal>
        )}
      </div>
    </div>
  );
}
