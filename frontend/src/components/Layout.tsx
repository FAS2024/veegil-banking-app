import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  center?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, center = false }) => {
  return (
    <div style={styles.pageWrapper}>
      {/* Full-width Header with centered inner content */}
      <header style={styles.header}>
        <div style={styles.inner}>
          <h1 style={styles.headerText}>🏦 Veegil Bank</h1>
        </div>
      </header>

      {/* Main content */}
      <main style={center ? styles.centerMain : styles.main}>
        {children}
      </main>

      {/* Full-width Footer with centered inner content */}
      <footer style={styles.footer}>
        <div style={styles.inner}>
          <p>© {new Date().getFullYear()} <strong>Fatai Sunmonu</strong></p>
          <p>
            🔗 <a href="https://github.com/FAS2024" target="_blank" rel="noreferrer">GitHub: FAS2024</a> |{" "}
            🔗 <a href="https://www.linkedin.com/in/fatai-sunmonu" target="_blank" rel="noreferrer">LinkedIn</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  pageWrapper: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#f9f9f9',
    color: '#1b1b1b',
  },
  header: {
    width: '100%',
    backgroundColor: '#003366',
    color: 'white',
    padding: '15px 0',
  },
  headerText: {
    margin: 0,
    fontSize: '22px',
  },
  main: {
    flex: 1,
    padding: '30px 20px',
    maxWidth: 960,
    width: '100%',
    boxSizing: 'border-box',
    margin: '0 auto',
  },
  centerMain: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '30px 20px',
    width: '100%',
    boxSizing: 'border-box',
  },
  footer: {
    width: '100%',
    backgroundColor: '#f1f1f1',
    textAlign: 'center',
    padding: '15px 0',
    borderTop: '1px solid #ccc',
  },
  inner: {
    maxWidth: 960,
    margin: '0 auto',
    padding: '0 20px',
    boxSizing: 'border-box',
  },
};

export default Layout;
