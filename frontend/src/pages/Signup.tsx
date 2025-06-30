import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const SIGNUP_MUTATION = gql`
  mutation Signup($input: CreateUserInput!) {
    signup(input: $input) {
      token
      user {
        _id
        fullName
      }
    }
  }
`;

const Signup = () => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();
  const [signup, { loading, error }] = useMutation(SIGNUP_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{11}$/.test(phoneNumber)) {
      setValidationError('Phone number must be exactly 11 digits');
      return;
    }

    try {
      const response = await signup({
        variables: {
          input: { fullName, phoneNumber, password },
        },
      });

      const { token } = response.data.signup;
      localStorage.setItem('token', token);

      setSuccessMessage('Signup successful!');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      console.error('Signup error:', err);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h2 style={styles.heading}>Create Your Account</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="text"
            placeholder="Phone Number (e.g. 08012345678)"
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
            {loading ? 'Signing up...' : 'Signup'}
          </button>
        </form>

        {validationError && <p style={styles.warning}>{validationError}</p>}
        {error && <p style={styles.error}>Error: {error.message}</p>}
        {successMessage && <p style={styles.success}>{successMessage}</p>}

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
    backgroundColor: '#f5f5f5',
    padding: '1rem',
    boxSizing: 'border-box',
  },
  container: {
    width: '100%',
    maxWidth: '400px',
    backgroundColor: '#fff',
    padding: '2rem 1.5rem',
    borderRadius: '10px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
    textAlign: 'center',
    boxSizing: 'border-box',
  },
  heading: {
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
    boxSizing: 'border-box',
    width: '100%',
  },
  button: {
    padding: '0.75rem',
    fontSize: '1rem',
    backgroundColor: '#003366',
    color: '#fff',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
  },
  warning: {
    color: 'orange',
    marginTop: '0.8rem',
    fontSize: '0.9rem',
  },
  error: {
    color: 'red',
    marginTop: '0.8rem',
    fontSize: '0.9rem',
    wordBreak: 'break-word',
  },
  success: {
    color: 'green',
    marginTop: '0.8rem',
    fontSize: '0.9rem',
  },
  back: {
    marginTop: '1.5rem',
    fontSize: '0.9rem',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#003366',
    cursor: 'pointer',
  },
};

export default Signup;
