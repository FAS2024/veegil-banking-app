// src/components/Layout.tsx
import React from 'react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerText}>🏦 Veegil Bank</h1>
      </header>

      <main style={styles.main}>
        {children}
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
    backgroundColor: '#f9f9f9', // neutral background
    color: '#1b1b1b',
  },
  header: {
    padding: '15px 30px',
    backgroundColor: '#003366',
    color: 'white',
    textAlign: 'left',
  },
  headerText: {
    margin: 0,
    fontSize: '22px',
  },
  main: {
    flex: 1,
    padding: '30px 20px',
    maxWidth: '960px',
    width: '100%',
    margin: '0 auto',
  },
  footer: {
    backgroundColor: '#f1f1f1',
    textAlign: 'center',
    padding: '15px',
    fontSize: '14px',
    borderTop: '1px solid #ccc',
  },
};

export default Layout;
