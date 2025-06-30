import React, { useState, useContext } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginUserInput!) {
    login(input: $input) {
      token
      user {
        _id
        fullName
      }
    }
  }
`;

const Login = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { setToken, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ variables: { input: { phoneNumber, password } } });
      const { token, user } = res.data.login;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      setSuccessMessage('Login successful!');
      setTimeout(() => {
        setSuccessMessage('');
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.box}>
        <h2 style={styles.title}>Login</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Phone"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {successMessage && <p style={styles.success}>{successMessage}</p>}
        {error && <p style={styles.error}>Error: {error.message}</p>}

        <button onClick={() => navigate(-1)} style={styles.back}>
          ← Back
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    backgroundColor: '#f0f2f5',
    boxSizing: 'border-box',
  },
  box: {
    width: '100%',
    maxWidth: 400,
    minWidth: 260,
    padding: '2rem 1.5rem',
    backgroundColor: '#fff',
    borderRadius: 8,
    boxShadow: '0 0 12px rgba(0,0,0,0.06)',
    boxSizing: 'border-box',
    textAlign: 'center',
  },
  title: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: '#003366',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  input: {
    padding: '0.6rem 0.75rem',
    fontSize: '0.95rem',
    borderRadius: 6,
    border: '1px solid #ccc',
    width: '100%',
    boxSizing: 'border-box',
  },
  button: {
    padding: '0.6rem',
    fontSize: '0.95rem',
    backgroundColor: '#003366',
    color: '#fff',
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer',
  },
  success: {
    color: 'green',
    fontSize: '0.9rem',
    marginTop: '0.75rem',
  },
  error: {
    color: 'red',
    fontSize: '0.85rem',
    marginTop: '0.75rem',
    wordBreak: 'break-word',
  },
  back: {
    marginTop: '1rem',
    fontSize: '0.85rem',
    color: '#003366',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
};

export default Login;
