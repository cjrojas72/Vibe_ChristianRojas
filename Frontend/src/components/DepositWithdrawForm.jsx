import React, { useState } from 'react';

export default function DepositWithdrawForm({ type, onSubmit, onClose }) {
  const [amount, setAmount] = useState('');
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white p-6 rounded shadow w-80">
        <h3 className="text-xl mb-2 font-bold">{type === 'deposit' ? 'Deposit' : 'Withdraw'} Funds</h3>
        <input type="number" min="1" value={amount} onChange={e => setAmount(e.target.value)} className="input mb-4 w-full" placeholder="Amount" />
        <div className="flex gap-2">
          <button className="btn btn-primary" onClick={() => onSubmit(Number(amount))}>Submit</button>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
