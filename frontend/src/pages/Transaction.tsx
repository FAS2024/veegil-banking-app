import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

type TransactionItem = {
  _id: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAW';
  createdAt: string;
};

type GetMeQuery = {
  whoAmI: {
    balance: number;
  };
};

type GetMyTransactionsQuery = {
  getMyTransactions: TransactionItem[];
};

type CreateTransactionMutation = {
  createTransaction: TransactionItem;
};

type CreateTransactionVariables = {
  input: {
    amount: number;
    type: 'DEPOSIT' | 'WITHDRAW';
  };
};

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
  const [transactionSuccess, setTransactionSuccess] = useState('');
  const navigate = useNavigate();

  const { data: balanceData, refetch: refetchBalance } = useQuery<GetMeQuery>(GET_ME);
  const {
    data: transactionsData,
    loading: queryLoading,
    error,
  } = useQuery<GetMyTransactionsQuery>(GET_MY_TRANSACTIONS);

  const [createTransaction, { loading: mutationLoading }] = useMutation<
    CreateTransactionMutation,
    CreateTransactionVariables
  >(CREATE_TRANSACTION, {
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
      setTransactionSuccess(`✅ ${type} of ₦${amount.toFixed(2)} was successful!`);
      setAmount(0);
      setTimeout(() => setTransactionSuccess(''), 2000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Transaction failed';
      alert(errorMessage);
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

  // Inject responsive styles
  useEffect(() => {
    const responsiveStyles = `
      @media (max-width: 480px), (orientation: landscape) and (max-height: 480px) {
        .pagination button {
          padding: 6px 8px !important;
          font-size: 12px !important;
          min-width: 60px !important;
        }
        .pagination {
          flex-wrap: nowrap !important;
          justify-content: space-around !important;
        }
      }
    `;
    const styleTag = document.createElement('style');
    styleTag.innerHTML = responsiveStyles;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <div style={styles.topButtons}>
          <button onClick={() => navigate(-1)} style={styles.backButton}>← Back</button>
          <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
        </div>

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

        {transactionSuccess && <p style={styles.success}>{transactionSuccess}</p>}

        <h3 style={{ marginTop: 20 }}>Transaction History</h3>

        {queryLoading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}
        {transactions.length === 0 && <p>No transactions yet.</p>}

        <ul style={styles.list}>
          {paginatedTransactions.map((txn) => (
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
          <div style={styles.pagination} className="pagination">
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

        {logoutSuccess && <p style={styles.success}>{logoutSuccess}</p>}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  pageWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f2f4f8',
    padding: '1rem',
    boxSizing: 'border-box',
  },
  container: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: 10,
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: 960,
    boxSizing: 'border-box',
    margin: '0 auto',
  },
  topButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  backButton: {
    backgroundColor: '#ccc',
    border: 'none',
    padding: '8px 14px',
    borderRadius: 5,
    cursor: 'pointer',
  },
  logoutButton: {
    backgroundColor: '#e60000',
    color: 'white',
    border: 'none',
    padding: '8px 14px',
    borderRadius: 5,
    cursor: 'pointer',
  },
  title: {
    textAlign: 'center',
    marginBottom: '1rem',
    color: '#003366',
  },
  balance: {
    textAlign: 'center',
    color: '#444',
    marginBottom: '1rem',
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  },
  input: {
    padding: '10px',
    borderRadius: 5,
    border: '1px solid #ccc',
    width: '120px',
  },
  select: {
    padding: '10px',
    borderRadius: 5,
    border: '1px solid #ccc',
  },
  button: {
    backgroundColor: '#003366',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: 5,
    cursor: 'pointer',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    maxHeight: '35vh',
    overflowY: 'auto',
  },
  listItem: {
    padding: '10px',
    marginBottom: '10px',
    borderLeft: '4px solid #ccc',
    backgroundColor: '#f9f9f9',
    borderRadius: '6px',
    fontSize: '0.95rem',
  },
  pagination: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.75rem',
    marginTop: '1.5rem',
    textAlign: 'center',
  },
  pageButton: {
    backgroundColor: '#003366',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: 5,
    cursor: 'pointer',
    minWidth: '90px',
    textAlign: 'center',
    fontSize: '14px',
  },
  pageInfo: {
    fontWeight: 'bold',
    textAlign: 'center',
    minWidth: '120px',
  },
  success: {
    color: 'green',
    textAlign: 'center',
    marginTop: '1rem',
  },
};

export default Transaction;
