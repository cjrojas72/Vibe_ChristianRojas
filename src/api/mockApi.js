// src/api/mockApi.js
// Mock API for banking app

export const mockApi = {
  login: async (email, password, role) => {
    // Simulate login
    return { id: 'user1', name: 'Test User', email, role };
  },
  signup: async (userData) => {
    // Simulate signup
    return { ...userData, id: 'user' + Math.random().toString(36).slice(2) };
  },
  getAccounts: async (userIdOrCustomerId) => {
    // Simulate fetching accounts
    return [
      { id: 'acc1', number: '123456', balance: 2500, type: 'Checking' },
      { id: 'acc2', number: '654321', balance: 5000, type: 'Savings' },
    ];
  },
  getTransactions: async (accountId) => {
    // Simulate fetching transactions
    return [
      { id: 'txn1', date: '2024-01-01', type: 'Deposit', amount: 1000 },
      { id: 'txn2', date: '2024-01-05', type: 'Withdraw', amount: 200 },
    ];
  },
  deposit: async (accountId, amount) => {
    // Simulate deposit
    return { success: true, newBalance: 3000 };
  },
  withdraw: async (accountId, amount) => {
    // Simulate withdraw
    if (amount > 2500) return { success: false, error: 'Insufficient funds' };
    return { success: true, newBalance: 2300 };
  },
  getCustomers: async () => {
    // Simulate fetching customers
    return [
      { id: 'cust1', name: 'Alice', email: 'alice@email.com' },
      { id: 'cust2', name: 'Bob', email: 'bob@email.com' },
    ];
  },
  addCustomer: async (customerData) => {},
  editCustomer: async (customerId, updatedData) => {},
  deleteCustomer: async (customerId) => {},
  addAccount: async (customerId, accountData) => {},
  editAccount: async (accountId, updatedData) => {},
  deleteAccount: async (accountId) => {},
};
