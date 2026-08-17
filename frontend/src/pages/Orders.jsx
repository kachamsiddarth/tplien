import React from 'react';
import { ShoppingCart } from 'lucide-react';
import '../pages/Dashboard.css';

const Orders = () => {
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">ORDERS</h1>
          <p className="dashboard-subtitle">Executed and pending trade order books</p>
        </div>
      </div>

      <div className="neo-card" style={{ padding: '4rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,209,102,0.15)', padding: '1rem', borderRadius: '50%', border: '2px solid var(--accent-yellow-bright)' }}>
          <ShoppingCart size={36} color="var(--accent-yellow-bright)" />
        </div>
        <h2>Order Execution Service</h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px' }}>
          Trade placement interface is ready. Connect your backend order endpoints to start routing live market orders.
        </p>
        <span className="neo-badge neo-badge-neutral">UI Terminal Ready</span>
      </div>
    </div>
  );
};

export default Orders;
