import React from 'react';
import { useNavigate } from 'react-router-dom';

const PencilIcon = () => (
  <svg className="w-4 h-4 mr-1 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 1 1 2.828 2.828L11.828 15.828a4 4 0 0 1-1.414.828l-4.243 1.415 1.415-4.243a4 4 0 0 1 .828-1.414z" /></svg>
);
const TrashIcon = () => (
  <svg className="w-4 h-4 mr-1 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
);
const EyeIcon = () => (
  <svg className="w-4 h-4 mr-1 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
);

export default function CustomerTable({ customers }) {
  const navigate = useNavigate();
  // Only show customers that are not employees (assume a 'role' property or filter by email/other property if needed)
  const filteredCustomers = customers.filter(
    cust => !cust.role || cust.role === 'customer' // adjust this filter as needed
  );
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Name</th>
            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-600">Email</th>
            <th className="px-4 py-2 text-right text-xs font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {filteredCustomers.map(cust => (
            <tr key={cust.id} className="hover:bg-gray-50 transition">
              <td className="px-4 py-2 text-sm text-gray-900">{cust.name}</td>
              <td className="px-4 py-2 text-sm text-gray-500">{cust.email}</td>
              <td className="px-4 py-2 text-right flex gap-2 justify-end items-center">
                <button className="flex items-center text-xs text-blue-700 hover:underline px-2 py-1" onClick={() => navigate(`/employee/customers/${cust.id}/accounts`)}><EyeIcon />View Accounts</button>
                <button className="flex items-center text-xs text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg px-3 py-1 font-medium" title="Edit"><PencilIcon />Edit</button>
                <button className="flex items-center text-xs text-red-600 bg-red-50 hover:bg-red-100 rounded-lg px-3 py-1 font-medium" title="Delete"><TrashIcon />Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
