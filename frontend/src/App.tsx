// src/App.tsx
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transaction from './pages/Transaction';
import Layout from './components/Layout';
import { AuthContext } from './context/AuthContext';

function App() {
  const { token } = useContext(AuthContext);
  const isLoggedIn = !!token;

  return (
    <Router>
      <Routes>
        {/* Home is standalone */}
        <Route path="/" element={<Home />} />

        {/* Signup and Login use centered layout */}
        <Route
          path="/signup"
          element={
            <Layout center>
              <Signup />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout center>
              <Login />
            </Layout>
          }
        />

        {/* Dashboard and Transactions use regular layout */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <Layout>
                <Dashboard />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/transactions"
          element={
            isLoggedIn ? (
              <Layout>
                <Transaction />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
