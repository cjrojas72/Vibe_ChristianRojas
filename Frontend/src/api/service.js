// src/api/service.js
const BASE_URL = "http://localhost:5000";


// Map MongoDB API account object to frontend format
function mapAccount(apiAccount) {
  return {
    accountId: apiAccount.account_id || apiAccount._id || apiAccount.accountId,
    userId: apiAccount.user_id || apiAccount.userId,
    balance: apiAccount.balance,
    accountType: apiAccount.account_type || apiAccount.accountType,
    createdAt: apiAccount.created_at || apiAccount.createdAt,
  };
}


// Map MongoDB API transaction object to frontend format
function mapTransaction(apiTxn) {
  return {
    txnId: apiTxn.txn_id || apiTxn._id || apiTxn.txnId,
    accountId: apiTxn.account_id || apiTxn.accountId,
    txnType: apiTxn.txn_type || apiTxn.txnType,
    amount: apiTxn.amount,
    createdAt: apiTxn.created_at || apiTxn.createdAt,
  };
}

export async function getEmployees() {
  try {
    const res = await fetch(`${BASE_URL}/employees`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch employees");
    return data;
  } catch (err) {
    throw err;
  }
}

export async function createEmployee(employee) {
  try {
    const res = await fetch(`${BASE_URL}/employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employee),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create employee");
    return data;
  } catch (err) {
    throw err;
  }
}

export async function createAccount(userId, accountType) {
  try {
    const res = await fetch(`${BASE_URL}/api/accounts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, accountType }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create account");
    return mapAccount(data);
  } catch (err) {
    throw err;
  }
}

export async function getAccount(accountId) {
  try {
    const res = await fetch(`${BASE_URL}/api/accounts/${accountId}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Account not found");
    return mapAccount(data);
  } catch (err) {
    throw err;
  }
}

export async function deposit(accountId, amount) {
  try {
    const res = await fetch(`${BASE_URL}/api/accounts/${accountId}/deposit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: String(amount) }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Invalid amount");
    return mapAccount(data);
  } catch (err) {
    throw err;
  }
}

export async function withdraw(accountId, amount) {
  try {
    const res = await fetch(`${BASE_URL}/api/accounts/${accountId}/withdraw`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: String(amount) }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Insufficient funds");
    return mapAccount(data);
  } catch (err) {
    throw err;
  }
}

export async function getTransactions(accountId) {
  try {
    const res = await fetch(`${BASE_URL}/api/accounts/${accountId}/transactions`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch transactions");
    return Array.isArray(data) ? data.map(mapTransaction) : [];
  } catch (err) {
    throw err;
  }
}


export async function getUserAccounts(userId) {
  try {
    const res = await fetch(`${BASE_URL}/api/users/${userId}/accounts`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch user accounts");
    return Array.isArray(data) ? data.map(mapAccount) : [];
  } catch (err) {
    throw err;
  }
}

export async function getUser(userId) {
  try {
    const res = await fetch(`${BASE_URL}/api/users/${userId}`);
    const data = await res.json();
    console.log(data);
    if (!res.ok) throw new Error(data.error || "User not found");
    return {
      id: data.user_id || data._id || data.id,
      name: data.name,
      email: data.email,
      role: data.role,
    };
  } catch (err) {
    throw err;
  }
}

export async function getAllAccounts() {
  try {
    const res = await fetch(`${BASE_URL}/api/accounts`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch accounts");
    return Array.isArray(data) ? data.map(mapAccount) : [];
  } catch (err) {
    throw err;
  }
}

export async function getAllUsers() {
  try {
    const res = await fetch(`${BASE_URL}/api/users`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to fetch users");
    return Array.isArray(data)
      ? data.map(u => ({ 
          id: u.user_id || u._id || u.id, 
          name: u.name, 
          email: u.email, 
          role: u.role }))
      : [];
  } catch (err) {
    throw err;
  }
}