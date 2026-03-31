import React, { useState } from 'react';
import Spinner from './Spinner';
import { useNavigate } from 'react-router-dom';
import EditModal from './EditModal';
import { updateAccount, deleteAccount } from '../api/service';

const PencilIcon = () => (
  <svg className="w-4 h-4 mr-1 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 1 1 2.828 2.828L11.828 15.828a4 4 0 0 1-1.414.828l-4.243 1.415 1.415-4.243a4 4 0 0 1 .828-1.414z" /></svg>
);
const TrashIcon = () => (
  <svg className="w-4 h-4 mr-1 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
);
const EyeIcon = () => (
  <svg className="w-4 h-4 mr-1 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
);

export default function AccountTable({ accounts, onRefresh, loading: externalLoading }) {
  const navigate = useNavigate();
  const [editAccount, setEditAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [accountIdFilter, setAccountIdFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [balanceFilter, setBalanceFilter] = useState("");
  const isLoading = loading || externalLoading;

  const filteredAccounts = accounts
    .filter(acc => !acc.role || acc.role === 'customer')
    .filter(acc => {
      const accountId = String(acc.accountId || acc.account_id || "");
      const accountType = String(acc.accountType || acc.account_type || "");
      const balance = String(acc.balance ?? "");
      return (
        accountId.includes(accountIdFilter) &&
        accountType.toLowerCase().includes(typeFilter.toLowerCase()) &&
        balance.includes(balanceFilter)
      );
    });

  const handleEdit = (acc) => setEditAccount(acc);
  const handleDelete = async (acc) => {
    if (window.confirm('Delete this account?')) {
      setLoading(true);
      await deleteAccount(acc.accountId || acc.account_id);
      setLoading(false);
      onRefresh && onRefresh();
    }
  };
  const handleEditSubmit = async (values) => {
    setLoading(true);
    await updateAccount(editAccount.accountId || editAccount.account_id, values);
    setLoading(false);
    setEditAccount(null);
    onRefresh && onRefresh();
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-60 flex items-center justify-center z-10">
          <Spinner size={32} />
        </div>
      )}
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Account #</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Type</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Balance</th>
            <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600">Actions</th>
          </tr>
          <tr>
            <th className="px-4 pt-0 pb-2">
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                placeholder="Filter by account #"
                value={accountIdFilter}
                onChange={e => setAccountIdFilter(e.target.value)}
              />
            </th>
            <th className="px-4 pt-0 pb-2">
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                placeholder="Filter by type"
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
              />
            </th>
            <th className="px-4 pt-0 pb-2">
              <input
                type="text"
                className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                placeholder="Filter by balance"
                value={balanceFilter}
                onChange={e => setBalanceFilter(e.target.value)}
              />
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {filteredAccounts.map(acc => {
            const accountId = acc.accountId || acc.account_id;
            const accountType = acc.accountType || acc.account_type;
            return (
              <tr key={accountId} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2 text-sm text-gray-900">{accountId}</td>
                <td className="px-4 py-2 text-sm text-gray-500">{accountType}</td>
                <td className="px-4 py-2 text-sm text-gray-900">${acc.balance}</td>
                {/* Updated flex gap and alignment */}
                <td className="px-4 py-2 text-right flex gap-1.5 justify-end items-center">
                  {/* View Button - Updated with icon gap and responsive text span */}
                  <button className="flex items-center gap-1 text-xs text-blue-700 hover:underline px-2 py-1" onClick={() => navigate(`/employee/accounts/${accountId}/transactions`)}>
                    <EyeIcon />
                    <span className="hidden sm:inline">View Transactions</span>
                  </button>
                  {/* Edit Button - Updated with icon gap and responsive text span */}
                  <button className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg px-3 py-1 font-medium" title="Edit" onClick={() => handleEdit(acc)}>
                    <PencilIcon />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  {/* Delete Button - Updated with icon gap and responsive text span */}
                  <button className="flex items-center gap-1 text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded-lg px-3 py-1 font-medium" title="Delete" onClick={() => handleDelete(acc)} disabled={loading}>
                    <TrashIcon />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {editAccount && (
        <EditModal
          title="Edit Account"
          fields={[
            { name: 'account_type', label: 'Type', options: [
                { value: 'checking', label: 'Checking' },
                { value: 'savings', label: 'Savings' }
              ] },
            { name: 'balance', label: 'Balance', type: 'number', min: 0 },
          ]}
          initialValues={{ account_type: editAccount.accountType || editAccount.account_type, balance: editAccount.balance }}
          onSubmit={handleEditSubmit}
          onClose={() => setEditAccount(null)}
        />
      )}
    </div>
  );
}
