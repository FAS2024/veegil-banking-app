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
      <div style={styles.container}>
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#f0f2f5',
    padding: '1rem',
    boxSizing: 'border-box',
  },
  container: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#fff',
    padding: '2rem 1.5rem',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    boxSizing: 'border-box',
    textAlign: 'center',
  },
  title: {
    marginBottom: '1.5rem',
    fontSize: '1.75rem',
    color: '#003366',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  input: {
    padding: '0.75rem',
    fontSize: '1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    width: '100%',
    boxSizing: 'border-box',
  },
  button: {
    padding: '0.75rem',
    fontSize: '1rem',
    backgroundColor: '#003366',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  success: {
    color: 'green',
    marginTop: '1rem',
    fontSize: '0.9rem',
  },
  error: {
    color: 'red',
    marginTop: '1rem',
    fontSize: '0.9rem',
    wordBreak: 'break-word',
  },
  back: {
    marginTop: '1.5rem',
    fontSize: '0.9rem',
    color: '#003366',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
  },
};

export default Login;
