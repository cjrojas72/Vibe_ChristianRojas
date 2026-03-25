import React, { useEffect, useState } from 'react';
import { mockApi } from '../api/mockApi';
import CustomerTable from '../components/CustomerTable';
import SignOutButton from '../components/SignOutButton';

export default function EmployeeHome() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    mockApi.getCustomers().then(setCustomers);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-5 md:py-10 md:px-7 lg:py-12 lg:px-10 font-sans">
      <div className="max-w-[1280px] xl:max-w-[70vw] mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-blue-900">Customers</h2>
          <SignOutButton />
        </div>
        <CustomerTable customers={customers} />
      </div>
    </div>
  );
}
