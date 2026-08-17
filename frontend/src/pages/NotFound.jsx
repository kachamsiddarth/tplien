import React from 'react';
import { Link } from 'react-router-dom';
import '../pages/Dashboard.css';

const NotFound = () => {
  return (
    <div className="dashboard-page" style={{ textAlign: 'center', paddingTop: '6rem' }}>
      <h1 style={{ fontSize: '6rem', fontWeight: '800', color: 'var(--accent-yellow-bright)' }}>404</h1>
      <h2>PAGE NOT FOUND</h2>
      <p style={{ color: 'var(--text-secondary)', margin: '1rem 0 2rem 0' }}>
        The trading page or symbol route you requested does not exist.
      </p>
      <Link to="/dashboard" className="neo-btn neo-btn-primary">Return to Terminal</Link>
    </div>
  );
};

export default NotFound;
