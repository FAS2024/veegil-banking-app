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
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Segoe UI, sans-serif',
    background: 'linear-gradient(to right, #1c92d2, #97d7e7)',
    color: '#1b1b1b',
    margin: 0,
    padding: 0,
  },
  header: {
    padding: '1rem',
    backgroundColor: '#003366',
    color: 'white',
    textAlign: 'center',
    flexShrink: 0,
  },
  headerText: {
    margin: 0,
    fontSize: '2rem',
  },
  main: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    textAlign: 'center',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '1.1rem',
    marginBottom: '2rem',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '1rem',
    justifyContent: 'center',
  },
  primaryBtn: {
    backgroundColor: '#003366',
    color: 'white',
    padding: '0.75rem 2rem',
    fontSize: '1rem',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    minWidth: '120px',
  },
  secondaryBtn: {
    backgroundColor: '#ffffff',
    color: '#003366',
    padding: '0.75rem 2rem',
    fontSize: '1rem',
    border: '2px solid #003366',
    borderRadius: '6px',
    cursor: 'pointer',
    minWidth: '120px',
  },
  footer: {
    backgroundColor: '#f1f1f1',
    textAlign: 'center',
    padding: '1rem 0.5rem',
    fontSize: '0.9rem',
    borderTop: '1px solid #ccc',
    flexShrink: 0,
  },
};

export default Home;
