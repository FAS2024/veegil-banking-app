import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);

  const [logoutSuccess, setLogoutSuccess] = useState('');
  const [logoutError, setLogoutError] = useState('');

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      setToken(null);
      setLogoutSuccess('You have successfully logged out!');
      setTimeout(() => {
        setLogoutSuccess('');
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error(err);
      setLogoutError('Something went wrong while logging out.');
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <nav style={styles.nav}>
        <div style={styles.logo}>🏦 Veegil Bank</div>
        <div style={styles.links}>
          <Link to="/dashboard" style={styles.link}>Dashboard</Link>
          <Link to="/transactions" style={styles.link}>Transactions</Link>
        </div>
        <button onClick={handleLogout} style={styles.logout}>Logout</button>
      </nav>

      <main style={styles.content}>
        <div style={styles.card}>
          <h2 style={styles.heading}>Welcome to Your Dashboard</h2>
          <p style={styles.text}>You are successfully logged in.</p>
          <p style={styles.text}>Use the navigation above to manage your banking.</p>

          {logoutSuccess && <p style={styles.success}>{logoutSuccess}</p>}
          {logoutError && <p style={styles.error}>{logoutError}</p>}
        </div>
      </main>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  pageWrapper: {
    height: '100dvh', // mobile-friendly full height
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#f4f6f9',
  },
  nav: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#003366',
    color: '#fff',
    flexShrink: 0,
  },
  logo: {
    fontSize: '1.25rem',
    fontWeight: 600,
  },
  links: {
    display: 'flex',
    gap: '1.25rem',
    flexWrap: 'wrap',
  },
  link: {
    color: '#61dafb',
    textDecoration: 'none',
    fontSize: '1rem',
  },
  logout: {
    backgroundColor: '#61dafb',
    color: '#000',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    marginTop: '0.5rem',
  },
  content: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start', 
    paddingTop: '5vh',
    paddingBottom: '2rem',
    boxSizing: 'border-box',
    overflowY: 'auto',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: '2rem',
    width: '100%',
    maxWidth: '600px',
    textAlign: 'center',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
    marginBottom: '3rem', 
  },
  heading: {
    fontSize: '1.8rem',
    marginBottom: '1rem',
    color: '#003366',
  },
  text: {
    fontSize: '1rem',
    marginBottom: '0.75rem',
    color: '#333',
  },
  success: {
    color: 'green',
    marginTop: '1rem',
  },
  error: {
    color: 'red',
    marginTop: '1rem',
  },
};

export default Dashboard;
