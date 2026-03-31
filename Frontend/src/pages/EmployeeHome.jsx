import React, { useEffect, useState } from 'react';
import { getAllUsers, getEmployees, createUser } from '../api/service';
import EditModal from '../components/EditModal';
import CustomerTable from '../components/CustomerTable';
import EmployeeProfileCard from '../components/EmployeeProfileCard';
import SignOutButton from '../components/SignOutButton';
import { useAuth } from '../context/AuthContext';

export default function EmployeeHome() {
  const [customers, setCustomers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const [showAddUser, setShowAddUser] = useState(false);
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [addUserError, setAddUserError] = useState('');

  const fetchData = () => {
    setLoading(true);
    setError('');
    Promise.all([
      getAllUsers(),
      getEmployees()
    ])
      .then(([users, emps]) => {
        setCustomers(users);
        setEmployees(emps);
        if (user && user.id) {
          // Find employee with matching user_id
          const found = emps.find(e => e.user_id === user.id || e.user_id === user.user_id);
          setEmployee(found || null);
        }
      })
      .catch(e => setError(e.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  return (
    <div className="bg-gray-100 min-h-screen py-8 px-5 md:py-10 md:px-7 lg:py-12 lg:px-10 font-sans">
      <div className="max-w-[1280px] xl:max-w-[70vw] mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-blue-900">All Customers</h2>
          <div className="flex gap-2 items-center">
            <button
              className="btn btn-primary"
              onClick={() => setShowAddUser(true)}
            >
              Add User
            </button>
            <SignOutButton />
          </div>
        </div>
        {/* Employee Profile Card */}
        {employee && <EmployeeProfileCard employee={employee} />}
        {loading && <div className="text-gray-500">Loading...</div>}
        {error && <div className="text-red-600 mb-2">{error}</div>}
        {!loading && !error && (
          <CustomerTable
            customers={customers}
            loading={loading}
            onRefresh={fetchData}
          />
        )}
        {showAddUser && (
          <EditModal
            title="Add User"
            fields={[
              { name: 'name', label: 'Name', required: true },
              { name: 'email', label: 'Email', type: 'email', required: true },
              { name: 'password', label: 'Password', type: 'password', required: true },
              { name: 'role', label: 'Role', options: [
                  { value: 'customer', label: 'Customer' },
                  { value: 'employee', label: 'Employee' }
                ], required: true },
            ]}
            initialValues={{ role: 'customer' }}
            onSubmit={async (values) => {
              setAddUserLoading(true);
              setAddUserError('');
              try {
                await createUser(values);
                setShowAddUser(false);
                fetchData();
              } catch (e) {
                setAddUserError(e.message || 'Failed to add user');
              } finally {
                setAddUserLoading(false);
              }
            }}
            onClose={() => setShowAddUser(false)}
          >
            {addUserError && <div className="text-red-600 mb-2">{addUserError}</div>}
            {addUserLoading && <div className="text-gray-500">Adding user...</div>}
          </EditModal>
        )}
      </div>
    </div>
  );
}
