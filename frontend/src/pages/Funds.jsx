import React from 'react';
import { Wallet, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import '../pages/Dashboard.css';

const Funds = () => {
  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">FUNDS & MARGIN</h1>
          <p className="dashboard-subtitle">Account balance and available trading capital</p>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="neo-card metric-card">
          <div className="metric-header">Available Margin</div>
          <div className="metric-value text-green">₹1,50,000.00</div>
          <div className="metric-footer">Cash Balance: ₹1,50,000.00</div>
        </div>
        <div className="neo-card metric-card">
          <div className="metric-header">Used Margin</div>
          <div className="metric-value text-yellow">₹45,210.00</div>
          <div className="metric-footer">Holdings Margin: ₹45,210.00</div>
        </div>
        <div className="neo-card metric-card">
          <div className="metric-header">Total Account Value</div>
          <div className="metric-value">₹1,95,210.00</div>
        </div>
      </div>

      <div className="hero-actions" style={{ marginTop: '1rem' }}>
        <button className="neo-btn neo-btn-primary"><ArrowDownRight size={18} /> Add Funds</button>
        <button className="neo-btn neo-btn-secondary"><ArrowUpRight size={18} /> Withdraw</button>
      </div>
    </div>
  );
};

export default Funds;
