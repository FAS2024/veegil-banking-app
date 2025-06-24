// src/pages/Dashboard.tsx
import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { setToken } = useContext(AuthContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/login');
  };

  return (
    <>
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
          backgroundColor: '#282c34',
          color: '#fff',
        }}
      >
        <div>
          <Link to="/dashboard" style={{ color: 'white', marginRight: '15px' }}>Dashboard</Link>
          <Link to="/transactions" style={{ color: 'white' }}>Transactions</Link>
        </div>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#61dafb',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
            color: '#000',
          }}
        >
          Logout
        </button>
      </nav>

      <div style={{ padding: '20px' }}>
        <h2>Welcome to Your Dashboard</h2>
        <p>You are successfully logged in.</p>
        <p>Use the navigation bar above to view transactions or log out.</p>
      </div>
    </>
  );
};

export default Dashboard;



// // src/pages/Dashboard.tsx
// import React from 'react';

// const Dashboard: React.FC = () => {
//   return (
//     <div className="p-6 text-center">
//       <h2 className="text-2xl font-semibold mb-4">Welcome to Your Dashboard</h2>
//       <p className="mb-2">You are successfully logged in.</p>
//       <p>Use the navigation bar above to view your transactions or log out.</p>
//     </div>
//   );
// };

// export default Dashboard;
