import React, { useEffect, useState } from 'react';
import { getHoldings } from '../services/api';
import { RefreshCw, Search } from 'lucide-react';
import '../pages/Dashboard.css';

const Holdings = () => {
  const [holdings, setHoldings] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHoldingsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getHoldings();
      setHoldings(data);
    } catch (err) {
      console.error("Failed to load holdings:", err);
      setError("Unable to load holdings from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoldingsData();
  }, []);

  const filteredHoldings = holdings.filter(h => 
    (h.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalInvestment = holdings.reduce((sum, h) => sum + ((h.avg || 0) * (h.qty || 0)), 0);
  const currentValue = holdings.reduce((sum, h) => sum + ((h.price || 0) * (h.qty || 0)), 0);
  const totalPnl = currentValue - totalInvestment;

  if (loading) {
    return (
      <div className="dashboard-loading">
        <RefreshCw className="spin-icon" size={32} />
        <h2>Fetching Holdings...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">HOLDINGS</h1>
          <p className="dashboard-subtitle">Your active equity & asset holdings from MongoDB</p>
        </div>
        <button onClick={fetchHoldingsData} className="neo-btn neo-btn-outline">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <div className="metrics-grid">
        <div className="neo-card metric-card">
          <div className="metric-header">Total Investment</div>
          <div className="metric-value">₹{totalInvestment.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
        </div>
        <div className="neo-card metric-card">
          <div className="metric-header">Current Value</div>
          <div className="metric-value">₹{currentValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
        </div>
        <div className="neo-card metric-card">
          <div className="metric-header">Total P&L</div>
          <div className={`metric-value ${totalPnl >= 0 ? 'text-green' : 'text-red'}`}>
            {totalPnl >= 0 ? '+' : ''}₹{totalPnl.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div className="neo-card table-card">
        <div className="table-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#080B0A', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <Search size={16} color="var(--text-secondary)" />
            <input 
              type="text" 
              placeholder="Search symbol..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', outline: 'none' }}
            />
          </div>
        </div>

        <div className="table-wrapper">
          <table className="tepline-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Qty</th>
                <th>Avg. Price</th>
                <th>LTP</th>
                <th>Cur. Val</th>
                <th>P&L</th>
                <th>Net Chg</th>
                <th>Day Chg</th>
              </tr>
            </thead>
            <tbody>
              {filteredHoldings.length > 0 ? (
                filteredHoldings.map((h, i) => {
                  const curVal = (h.price || 0) * (h.qty || 0);
                  const invVal = (h.avg || 0) * (h.qty || 0);
                  const pnl = curVal - invVal;
                  return (
                    <tr key={i}>
                      <td className="font-bold">{h.name}</td>
                      <td>{h.qty}</td>
                      <td>₹{h.avg}</td>
                      <td>₹{h.price}</td>
                      <td>₹{curVal.toFixed(2)}</td>
                      <td className={pnl >= 0 ? 'text-green font-bold' : 'text-red font-bold'}>
                        {pnl >= 0 ? '+' : ''}₹{pnl.toFixed(2)}
                      </td>
                      <td><span className="neo-badge neo-badge-neutral">{h.net || '0%'}</span></td>
                      <td><span className="neo-badge neo-badge-success">{h.day || '0%'}</span></td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No holdings found matching your search.
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

export default Holdings;
