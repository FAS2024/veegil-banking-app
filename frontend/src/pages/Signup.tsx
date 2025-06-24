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
          input: {
            fullName,
            phoneNumber,
            password,
          },
        },
      });

      // Extract token and user from response
      const { token, user } = response.data.signup;

      // Store the token locally
      localStorage.setItem('token', token);

      // Optional: log user for debugging
      console.log('User signed up:', user);

      alert('Signup successful!');
      navigate('/login');
    } catch (err) {
      console.error('Signup error:', err);
    }
  };

  return (
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

      <button onClick={() => navigate(-1)} style={styles.backButton}>
        ← Back
      </button>
    </div>
  );
};

// Styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: 20,
    maxWidth: 400,
    margin: 'auto',
    marginTop: 80,
    textAlign: 'center',
    background: '#fffdf8',
    borderRadius: 10,
    boxShadow: '0 0 12px rgba(0,0,0,0.08)',
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
  warning: {
    color: 'orange',
    marginTop: 10,
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

export default Signup;
