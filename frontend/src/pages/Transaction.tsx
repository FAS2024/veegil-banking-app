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


const Transaction = () => {
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<'DEPOSIT' | 'WITHDRAW'>('DEPOSIT');
  const navigate = useNavigate();

  const { data: balanceData, refetch: refetchBalance } = useQuery(GET_ME);
  const { data: transactionsData, loading: queryLoading, error } = useQuery(GET_MY_TRANSACTIONS);

  const [createTransaction, { loading: mutationLoading }] = useMutation(CREATE_TRANSACTION, {
    refetchQueries: [
      { query: GET_MY_TRANSACTIONS },
      { query: GET_ME },
    ],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      alert('Amount must be greater than zero');
      return;
    }

    try {
      await createTransaction({ variables: { input: { amount: Math.round(amount * 100) / 100, type } } });
      await refetchBalance();
      setAmount(0);
    } catch (err: any) {
      alert(err?.message || 'Transaction failed');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Transactions</h2>

      <h3 style={styles.balance}>
        Current Balance: ₦{balanceData?.whoAmI?.balance?.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) ?? '0.00'}
      </h3>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Enter amount"
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

      <h3 style={{ marginTop: 30 }}>Transaction History</h3>

      {queryLoading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error.message}</p>}

      <ul style={styles.list}>
        {transactionsData?.getMyTransactions?.length === 0 && <p>No transactions yet.</p>}
        {transactionsData?.getMyTransactions?.map((txn: any) => (
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
            - ₦{txn.amount.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{' '}
            on {new Date(txn.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>

      <button onClick={() => navigate(-1)} style={styles.backButton}>
        ← Back
      </button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: 650,
    margin: 'auto',
    padding: 30,
    background: '#f4f9ff',
    borderRadius: 10,
    boxShadow: '0 0 10px rgba(0,0,0,0.08)',
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#003366',
  },
  balance: {
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  form: {
    display: 'flex',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    flexWrap: 'wrap',
  },
  input: {
    padding: 10,
    fontSize: 16,
    borderRadius: 6,
    border: '1px solid #ccc',
    width: '150px',
  },
  select: {
    padding: 10,
    fontSize: 16,
    borderRadius: 6,
    border: '1px solid #ccc',
  },
  button: {
    backgroundColor: '#003366',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    marginTop: 20,
  },
  listItem: {
    padding: 12,
    background: '#fff',
    borderRadius: 6,
    marginBottom: 10,
    borderLeft: '4px solid #ccc',
    fontSize: 15,
  },
  backButton: {
    marginTop: 30,
    backgroundColor: '#ccc',
    border: 'none',
    padding: '8px 16px',
    borderRadius: 6,
    cursor: 'pointer',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
};

export default Transaction;
