

// src/pages/Home.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerText}>🏦 Veegil Bank</h1>
      </header>

      <main style={styles.main}>
        <h2 style={styles.title}>Welcome to Veegil Bank</h2>
        <p style={styles.subtitle}>Secure banking made simple.</p>
        <div style={styles.buttonGroup}>
          <button style={styles.primaryBtn} onClick={() => navigate('/signup')}>
            Sign Up
          </button>
          <button style={styles.secondaryBtn} onClick={() => navigate('/login')}>
            Login
          </button>
        </div>
      </main>

      <footer style={styles.footer}>
        <p>© {new Date().getFullYear()} <strong>Fatai Sunmonu</strong></p>
        <p>
          🔗 <a href="https://github.com/FAS2024" target="_blank" rel="noreferrer">GitHub: FAS2024</a> |{" "}
          🔗 <a href="https://www.linkedin.com/in/fatai-sunmonu" target="_blank" rel="noreferrer">LinkedIn</a>
        </p>
      </footer>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Segoe UI, sans-serif',
    background: 'linear-gradient(to right, #1c92d2,rgb(151, 215, 231))',
    color: '#1b1b1b',
  },
  header: {
    padding: '20px',
    backgroundColor: '#003366',
    color: 'white',
    textAlign: 'center',
  },
  headerText: {
    margin: 0,
    fontSize: '28px',
  },
  main: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: '32px',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '18px',
    marginBottom: '30px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
  },
  primaryBtn: {
    backgroundColor: '#003366',
    color: 'white',
    padding: '10px 25px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  secondaryBtn: {
    backgroundColor: '#ffffff',
    color: '#003366',
    padding: '10px 25px',
    fontSize: '16px',
    border: '2px solid #003366',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  footer: {
    backgroundColor: '#f1f1f1',
    textAlign: 'center',
    padding: '15px',
    fontSize: '14px',
    borderTop: '1px solid #ccc',
  },
};

export default Home;
