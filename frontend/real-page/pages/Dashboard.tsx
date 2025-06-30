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
        <div style={styles.linkGroup}>
          <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
          <Link to="/transactions" style={styles.navLink}>Transactions</Link>
        </div>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Logout
        </button>
      </nav>

      <div style={styles.centerContainer}>
        <div style={styles.innerBox}>
          <h2 style={styles.heading}>Welcome to Your Dashboard</h2>
          <p style={styles.message}>You are successfully logged in.</p>
          <p style={styles.message}>Use the navigation bar above to view transactions or log out.</p>

          {logoutSuccess && <p style={styles.success}>{logoutSuccess}</p>}
          {logoutError && <p style={styles.error}>{logoutError}</p>}
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  pageWrapper: {
    width: '100vw',
    height: '100vh',
    backgroundColor: '#f4f6f9',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 16px',
    backgroundColor: '#282c34',
    color: '#fff',
    width: '100%',           // full width
    boxSizing: 'border-box',// include padding in width calc
  },
  linkGroup: {
    display: 'flex',
    gap: '12px',
  },
  navLink: {
    color: '#61dafb',
    fontSize: '0.9rem',
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  logoutButton: {
    backgroundColor: '#61dafb',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    color: '#000',
    fontSize: '0.9rem',
  },
  centerContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',  // center horizontally
    alignItems: 'center',      // center vertically
    padding: '1rem',
    textAlign: 'center',
    width: '100%',             // full width to match nav
    boxSizing: 'border-box',
  },
  innerBox: {
    maxWidth: '320px',
    width: '100%',
    padding: '1rem',
    background: '#fff',
    borderRadius: 8,
    boxShadow: '0 0 8px rgba(0,0,0,0.05)',
  },
  heading: {
    fontSize: '1.4rem',
    marginBottom: '1rem',
    color: '#003366',
  },
  message: {
    fontSize: '0.9rem',
    marginBottom: '0.6rem',
    color: '#333',
  },
  success: {
    color: 'green',
    fontSize: '0.9rem',
    marginTop: '1rem',
  },
  error: {
    color: 'red',
    fontSize: '0.9rem',
    marginTop: '1rem',
  },
};

export default Dashboard;
