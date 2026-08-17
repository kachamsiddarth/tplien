import React, { useEffect, useState } from 'react';
import { getPositions } from '../services/api';
import { RefreshCw } from 'lucide-react';
import '../pages/Dashboard.css';

const Positions = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPositionsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPositions();
      setPositions(data);
    } catch (err) {
      console.error("Failed to load positions:", err);
      setError("Unable to load positions from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositionsData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <RefreshCw className="spin-icon" size={32} />
        <h2>Fetching Positions...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">POSITIONS</h1>
          <p className="dashboard-subtitle">Active derivative and intraday market positions</p>
        </div>
        <button onClick={fetchPositionsData} className="neo-btn neo-btn-outline">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="neo-card table-card">
        <div className="table-wrapper">
          <table className="tepline-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Instrument</th>
                <th>Qty</th>
                <th>Avg. Price</th>
                <th>LTP</th>
                <th>P&L</th>
                <th>Chg%</th>
              </tr>
            </thead>
            <tbody>
              {positions.length > 0 ? (
                positions.map((p, i) => {
                  const pnl = ((p.price || 0) - (p.avg || 0)) * (p.qty || 0);
                  return (
                    <tr key={i}>
                      <td><span className="neo-badge neo-badge-neutral">{p.product || 'MIS'}</span></td>
                      <td className="font-bold">{p.name}</td>
                      <td>{p.qty}</td>
                      <td>₹{p.avg}</td>
                      <td>₹{p.price}</td>
                      <td className={pnl >= 0 ? 'text-green font-bold' : 'text-red font-bold'}>
                        {pnl >= 0 ? '+' : ''}₹{pnl.toFixed(2)}
                      </td>
                      <td><span className="neo-badge neo-badge-success">{p.day || '0%'}</span></td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No active positions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Positions;
