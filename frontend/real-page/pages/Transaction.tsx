import React, { useState } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
      _id
      amount
      type
      createdAt
    }
  }
`;

const GET_MY_TRANSACTIONS = gql`
  query {
    getMyTransactions {
      _id
      amount
      type
      createdAt
    }
  }
`;

const GET_ME = gql`
  query {
    whoAmI {
      balance
    }
  }
`;

const ITEMS_PER_PAGE = 10;

const Transaction = () => {
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<'DEPOSIT' | 'WITHDRAW'>('DEPOSIT');
  const [currentPage, setCurrentPage] = useState(1);
  const [logoutSuccess, setLogoutSuccess] = useState('');
  const navigate = useNavigate();

  const { data: balanceData, refetch: refetchBalance } = useQuery(GET_ME);
  const { data: transactionsData, loading: queryLoading, error } = useQuery(GET_MY_TRANSACTIONS);

  const [createTransaction, { loading: mutationLoading }] = useMutation(CREATE_TRANSACTION, {
    refetchQueries: [{ query: GET_MY_TRANSACTIONS }, { query: GET_ME }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      alert('Amount must be greater than zero');
      return;
    }

    try {
      await createTransaction({
        variables: { input: { amount: Math.round(amount * 100) / 100, type } },
      });
      await refetchBalance();
      setAmount(0);
    } catch (err: any) {
      alert(err?.message || 'Transaction failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLogoutSuccess('You have successfully logged out!');
    setTimeout(() => {
      setLogoutSuccess('');
      navigate('/');
    }, 1500);
  };

  const transactions = transactionsData?.getMyTransactions || [];
  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE);
  const paginatedTransactions = transactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <h2 style={styles.title}>Transactions</h2>

        <h3 style={styles.balance}>
          Balance: ₦
          {balanceData?.whoAmI?.balance?.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }) ?? '0.00'}
        </h3>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Amount"
            value={amount}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val)) setAmount(val);
            }}
            style={styles.input}
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as 'DEPOSIT' | 'WITHDRAW')}
            style={styles.select}
          >
            <option value="DEPOSIT">Deposit</option>
            <option value="WITHDRAW">Withdraw</option>
          </select>
          <button
            type="submit"
            disabled={mutationLoading || amount <= 0}
            style={styles.button}
          >
            {mutationLoading ? 'Processing...' : 'Submit'}
          </button>
        </form>

        <h3 style={{ marginTop: 20 }}>Transaction History</h3>

        {queryLoading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
        {transactions.length === 0 && <p>No transactions yet.</p>}

        <ul style={styles.list}>
          {paginatedTransactions.map((txn: any) => (
            <li
              key={txn._id}
              style={{
                ...styles.listItem,
                borderLeft: `4px solid ${txn.type === 'DEPOSIT' ? 'green' : 'red'}`,
              }}
            >
              <span style={{ fontWeight: 600, color: txn.type === 'DEPOSIT' ? 'green' : 'red' }}>
                {txn.type}
              </span>{' '}
              - ₦
              {txn.amount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{' '}
              on {new Date(txn.createdAt).toLocaleString()}
            </li>
          ))}
        </ul>

        {totalPages > 1 && (
          <div style={styles.pagination}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              style={styles.pageButton}
            >
              ← Prev
            </button>
            <span style={styles.pageInfo}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              style={styles.pageButton}
            >
              Next →
            </button>
          </div>
        )}

        <div style={styles.footerActions}>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            ← Back
          </button>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>

        {logoutSuccess && <p style={styles.success}>{logoutSuccess}</p>}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  pageWrapper: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',   // center horizontally
    alignItems: 'center',       // center vertically
    padding: '0.5rem',
    boxSizing: 'border-box',
    background: '#f2f4f8',
    overflow: 'hidden',
  },
  container: {
    width: '100%',
    maxWidth: 360,
    maxHeight: '90vh',          // limit container height
    overflowY: 'auto',          // scroll if content too tall
    padding: '1rem',
    background: '#ffffff',
    borderRadius: 8,
    boxShadow: '0 0 8px rgba(0,0,0,0.06)',
    boxSizing: 'border-box',
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#003366',
    fontSize: '1.4rem',
  },
  balance: {
    textAlign: 'center',
    color: '#333',
    marginBottom: 15,
    fontSize: '1rem',
  },
  form: {
    display: 'flex',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  input: {
    padding: 8,
    fontSize: 14,
    borderRadius: 5,
    border: '1px solid #ccc',
    width: '110px',
  },
  select: {
    padding: 8,
    fontSize: 14,
    borderRadius: 5,
    border: '1px solid #ccc',
  },
  button: {
    backgroundColor: '#003366',
    color: 'white',
    padding: '8px 14px',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    marginTop: 15,
    maxHeight: '35vh',
    overflowY: 'auto',
  },
  listItem: {
    padding: 10,
    background: '#fff',
    borderRadius: 6,
    marginBottom: 8,
    borderLeft: '4px solid #ccc',
    fontSize: 14,
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
    flexWrap: 'wrap',
  },
  pageButton: {
    backgroundColor: '#003366',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: 5,
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  pageInfo: {
    fontSize: '0.85rem',
    fontWeight: 'bold',
  },
  footerActions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 24,
    flexWrap: 'wrap',
    gap: 8,
  },
  backButton: {
    backgroundColor: '#ccc',
    border: 'none',
    padding: '6px 12px',
    borderRadius: 5,
    cursor: 'pointer',
  },
  logoutButton: {
    backgroundColor: '#e60000',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: 5,
    cursor: 'pointer',
  },
  success: {
    color: 'green',
    textAlign: 'center',
    fontSize: '0.9rem',
    marginTop: 20,
  },
};

export default Transaction;
