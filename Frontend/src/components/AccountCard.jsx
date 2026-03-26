import React from 'react';

const CheckingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <line x1="2" x2="22" y1="10" y2="10" />
  </svg>
);
const SavingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);
const ChevronRight = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

export default function AccountCard({ account, onClick }) {
  const isChecking = (account.accountType || account.account_type)?.toLowerCase() === 'checking';
  const last4 = String(account.accountId || account.account_id).slice(-4);
  return (
    <div
      className="py-3.5 flex items-center gap-4 group cursor-pointer transition duration-150 divide-y-0"
      onClick={onClick}
    >
      <div className={`flex-shrink-0 p-3 rounded-full bg-gray-100 text-gray-500 group-hover:bg-${isChecking ? 'blue' : 'green'}-100 group-hover:text-${isChecking ? 'apex-primary' : 'emerald-700'} transition duration-150`}>
        {isChecking ? <CheckingIcon /> : <SavingsIcon />}
      </div>
      <div className="flex-grow flex items-center justify-between">
        <div>
          <div className={`text-base font-semibold ${isChecking ? 'text-apex-secondary group-hover:text-apex-primary' : 'text-apex-secondary group-hover:text-emerald-800'}`}>{account.accountType || account.account_type} Account</div>
          <div className="text-sm font-medium text-apex-text-body">ending in {last4}</div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-apex-secondary">${account.balance?.toLocaleString()}</div>
          <div className="text-sm font-medium text-apex-text-body">{isChecking ? 'Available' : 'Balance'}</div>
        </div>
      </div>
      <div className="flex-shrink-0 text-gray-400 p-1">
        <ChevronRight />
      </div>
    </div>
  );
}
