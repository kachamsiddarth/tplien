import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStockDetails } from '../services/api';
import { RefreshCw, ArrowLeft, TrendingUp, Building } from 'lucide-react';
import '../pages/Dashboard.css';

const StockDetails = () => {
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStock = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getStockDetails(symbol);
      setStock(data);
    } catch (err) {
      console.error(`Failed to fetch stock ${symbol}:`, err);
      setError(`Unable to fetch live stock data for ${symbol} from backend.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, [symbol]);

  if (loading) {
    return (
      <div className="dashboard-loading">
        <RefreshCw className="spin-icon" size={32} />
        <h2>Fetching Market Data for {symbol}...</h2>
      </div>
    );
  }

  if (error || !stock) {
    return (
      <div className="dashboard-error neo-card" style={{ maxWidth: '600px', margin: '4rem auto' }}>
        <h2>Stock Not Found</h2>
        <p>{error || `No data returned for ${symbol}`}</p>
        <Link to="/dashboard" className="neo-btn neo-btn-primary"><ArrowLeft size={16} /> Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <Link to="/dashboard" className="neo-btn neo-btn-outline" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
        <ArrowLeft size={16} /> Back
      </Link>

      <div className="dashboard-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span className="neo-badge neo-badge-neutral">{stock.exchange || 'NSE'}</span>
            <h1 className="dashboard-title">{stock.symbol || symbol}</h1>
          </div>
          <p className="dashboard-subtitle">{stock.companyName || stock.name || symbol} - Market Quote</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="metric-value text-green" style={{ fontSize: '2.5rem' }}>₹{stock.price || '0.00'}</div>
          <span className="neo-badge neo-badge-success">{stock.change || '+0.00%'}</span>
        </div>
      </div>

      <div className="metrics-grid" style={{ marginBottom: '2rem' }}>
        <div className="neo-card metric-card">
          <div className="metric-header">Open Price</div>
          <div className="metric-value">₹{stock.open || stock.price || '0'}</div>
        </div>
        <div className="neo-card metric-card">
          <div className="metric-header">High</div>
          <div className="metric-value text-green">₹{stock.high || stock.price || '0'}</div>
        </div>
        <div className="neo-card metric-card">
          <div className="metric-header">Low</div>
          <div className="metric-value text-red">₹{stock.low || stock.price || '0'}</div>
        </div>
      </div>

      <div className="hero-actions">
        <button className="neo-btn neo-btn-primary" style={{ padding: '1rem 2.5rem' }}>BUY {symbol}</button>
        <button className="neo-btn neo-btn-secondary" style={{ padding: '1rem 2.5rem' }}>SELL {symbol}</button>
      </div>
    </div>
  );
};

export default StockDetails;
