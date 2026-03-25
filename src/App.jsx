
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CustomerHome from './pages/CustomerHome';
import EmployeeHome from './pages/EmployeeHome';
import CustomerAccountPage from './pages/CustomerAccountPage';
import EmployeeCustomerAccounts from './pages/EmployeeCustomerAccounts';
import EmployeeAccountTransactions from './pages/EmployeeAccountTransactions';

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/login" />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/customer/home" element={
            <ProtectedRoute role="Customer"><CustomerHome /></ProtectedRoute>
          } />
          <Route path="/customer/accounts/:accountId" element={
            <ProtectedRoute role="Customer"><CustomerAccountPage /></ProtectedRoute>
          } />
          <Route path="/employee/home" element={
            <ProtectedRoute role="Employee"><EmployeeHome /></ProtectedRoute>
          } />
          <Route path="/employee/customers/:customerId/accounts" element={
            <ProtectedRoute role="Employee"><EmployeeCustomerAccounts /></ProtectedRoute>
          } />
          <Route path="/employee/accounts/:accountId/transactions" element={
            <ProtectedRoute role="Employee"><EmployeeAccountTransactions /></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
