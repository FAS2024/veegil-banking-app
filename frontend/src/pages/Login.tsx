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
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Login to Your Account</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Phone Number"
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
      {error && <p style={styles.error}>Error: {error.message}</p>}

      <button onClick={() => navigate(-1)} style={styles.backButton}>
        ← Back
      </button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: 20,
    maxWidth: 400,
    margin: 'auto',
    marginTop: 80,
    textAlign: 'center',
    background: '#f4f9ff',
    borderRadius: 10,
    boxShadow: '0 0 12px rgba(0,0,0,0.1)',
  },
  heading: {
    marginBottom: 20,
    color: '#003366',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 15,
  },
  input: {
    padding: 12,
    fontSize: 16,
    borderRadius: 6,
    border: '1px solid #ccc',
  },
  button: {
    backgroundColor: '#003366',
    color: 'white',
    padding: 12,
    borderRadius: 6,
    fontSize: 16,
    border: 'none',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  backButton: {
    marginTop: 20,
    backgroundColor: 'transparent',
    border: 'none',
    color: '#003366',
    fontSize: '14px',
    cursor: 'pointer',
  },
};

export default Login;
