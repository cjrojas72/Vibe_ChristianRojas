import React from 'react';

const ArrowDownIcon = () => (
  <svg className="w-4 h-4 mr-1 inline-block text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14m0 0l-6-6m6 6l6-6" /></svg>
);
const ArrowUpIcon = () => (
  <svg className="w-4 h-4 mr-1 inline-block text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 19V5m0 0l-6 6m6-6l6 6" /></svg>
);

export default function TransactionList({ transactions }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Date</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Type</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {transactions.map(txn => {
            // Support both camelCase and snake_case keys for MongoDB
            const txnId = txn.txnId || txn.txn_id || txn._id;
            const createdAt = txn.createdAt || txn.created_at;
            const txnType = txn.txnType || txn.txn_type;
            const amount = txn.amount;
            const isDeposit = txnType?.toLowerCase() === 'deposit';
            const accountId = txn.accountId || txn.account_id;
            const key = txnId || `${accountId}-${createdAt}`;
            return (
              <tr key={key} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2 text-sm text-gray-900">{createdAt}</td>
                <td className="px-4 py-2 text-sm text-gray-500 flex items-center">
                  {isDeposit ? <ArrowDownIcon /> : <ArrowUpIcon />}
                  {txnType}
                </td>
                <td className={`px-4 py-2 text-sm font-medium ${isDeposit ? 'text-green-600' : 'text-red-600'}`}>${amount}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
