import React, { useEffect, useState } from 'react';
import { getOrders } from '../services/api';
import { RefreshCw, ShoppingCart, TrendingUp, TrendingDown } from 'lucide-react';
import '../pages/Dashboard.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
      setError('Unable to load orders from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const buyCount = orders.filter(o => o.mode === 'BUY').length;
  const sellCount = orders.filter(o => o.mode === 'SELL').length;
  const totalOrders = orders.length;

  if (loading) {
    return (
      <div className="dashboard-loading">
        <RefreshCw className="spin-icon" size={32} />
        <h2>Fetching Orders...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">ORDERS</h1>
          <p className="dashboard-subtitle">Executed trade order book from MongoDB</p>
        </div>
        <button onClick={fetchOrders} className="neo-btn neo-btn-outline">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="metrics-grid">
        <div className="neo-card metric-card metric-card-yellow">
          <div className="metric-header">
            <span>Total Orders</span>
            <ShoppingCart size={24} color="#111" />
          </div>
          <div className="metric-value">{totalOrders}</div>
          <div className="metric-footer">All time executions</div>
        </div>

        <div className="neo-card metric-card metric-card-green">
          <div className="metric-header">
            <span>BUY Orders</span>
            <TrendingUp size={24} color="#111" />
          </div>
          <div className="metric-value">{buyCount}</div>
          <div className="metric-footer">Long positions placed</div>
        </div>

        <div className="neo-card metric-card metric-card-pink">
          <div className="metric-header">
            <span>SELL Orders</span>
            <TrendingDown size={24} color="#111" />
          </div>
          <div className="metric-value">{sellCount}</div>
          <div className="metric-footer">Exit orders placed</div>
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="neo-card table-card">
        <div className="table-card-header">
          <h3>ORDER BOOK</h3>
        </div>

        {error && (
          <div style={{ padding: '1rem', color: '#ff4d4d', fontWeight: 700 }}>{error}</div>
        )}

        <div className="table-wrapper">
          <table className="tepline-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Symbol</th>
                <th>Mode</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total Value</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((o, i) => {
                  const total = (o.qty || 0) * (o.price || 0);
                  const isBuy = o.mode === 'BUY';
                  return (
                    <tr key={o._id || i}>
                      <td style={{ color: '#777', fontWeight: 600 }}>{i + 1}</td>
                      <td className="font-bold">{o.name}</td>
                      <td>
                        <span className={`neo-badge ${isBuy ? 'neo-badge-green' : 'neo-badge-red'}`}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          {isBuy ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                          {o.mode}
                        </span>
                      </td>
                      <td>{o.qty}</td>
                      <td>₹{Number(o.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="font-bold">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: '#555' }}>
                    No orders found. Place a BUY or SELL order from the stock detail page.
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

export default Orders;
