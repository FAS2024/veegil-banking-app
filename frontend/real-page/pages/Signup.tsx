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
      <div style={styles.box}>
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
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#f5f5f5',
    boxSizing: 'border-box',
    overflow: 'hidden',
  },
  box: {
    width: '100%',
    maxWidth: 400,
    minWidth: 280,
    padding: '2rem 1.5rem',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    boxShadow: '0 0 10px rgba(0,0,0,0.06)',
    textAlign: 'center',
    boxSizing: 'border-box',
  },
  heading: {
    marginBottom: '1rem',
    fontSize: '1.4rem',
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
    backgroundColor: '#003366',
    color: 'white',
    padding: '0.65rem',
    fontSize: '0.95rem',
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer',
  },
  warning: {
    color: 'orange',
    fontSize: '0.85rem',
    marginTop: '0.6rem',
  },
  error: {
    color: 'red',
    fontSize: '0.85rem',
    marginTop: '0.6rem',
    wordBreak: 'break-word',
  },
  success: {
    color: 'green',
    fontSize: '0.85rem',
    marginTop: '0.6rem',
  },
  back: {
    marginTop: '1.2rem',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#003366',
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
};

export default Signup;
