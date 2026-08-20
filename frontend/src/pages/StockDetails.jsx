import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStockDetails, placeOrder } from '../services/api';
import { RefreshCw, ArrowLeft, Building2, CheckCircle, AlertCircle, Minus, Plus } from 'lucide-react';
import '../pages/Dashboard.css';

const StockDetails = () => {
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Order state
  const [qty, setQty] = useState(1);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderResult, setOrderResult] = useState(null); // { success, message, mode }

  const fetchStock = async () => {
    try {
      setLoading(true);
      setError(null);
      setOrderResult(null);
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

  const handleOrder = async (mode) => {
    if (qty < 1) return;
    const price = stock.nsePrice || stock.bsePrice || 0;
    setOrderLoading(true);
    setOrderResult(null);
    try {
      await placeOrder({ name: stock.symbol, qty: Number(qty), price, mode });
      setOrderResult({ success: true, mode, message: `${mode} order placed: ${qty} × ${stock.symbol} @ ₹${price}` });
    } catch (err) {
      setOrderResult({ success: false, mode, message: `Order failed: ${err.response?.data?.message || err.message}` });
    } finally {
      setOrderLoading(false);
    }
  };

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

  const nsePrice = stock.nsePrice;
  const bsePrice = stock.bsePrice;
  const displayPrice = nsePrice || bsePrice;
  const pct = parseFloat(stock.percentChange || 0);

  return (
    <div className="dashboard-page">
      <Link to="/dashboard" className="neo-btn neo-btn-outline" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
        <ArrowLeft size={16} /> Back
      </Link>

      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span className="neo-badge neo-badge-neutral">NSE / BSE</span>
            <h1 className="dashboard-title">{stock.symbol || symbol}</h1>
          </div>
          <p className="dashboard-subtitle">
            {stock.companyName || symbol}
            {stock.industry ? ` · ${stock.industry}` : ''}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          {displayPrice != null ? (
            <>
              <div className="metric-value" style={{ fontSize: '2.5rem', color: pct >= 0 ? 'var(--neo-green, #00E699)' : '#ff4d4d' }}>
                ₹{Number(displayPrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <span className={`neo-badge ${pct >= 0 ? 'neo-badge-green' : 'neo-badge-red'}`}>
                {pct >= 0 ? '+' : ''}{pct.toFixed(2)}%
              </span>
            </>
          ) : (
            <span className="neo-badge neo-badge-neutral">Price unavailable</span>
          )}
        </div>
      </div>

      {/* PRICE CARDS — only show data that exists */}
      <div className="metrics-grid" style={{ marginBottom: '2rem' }}>
        {nsePrice != null && (
          <div className="neo-card metric-card metric-card-yellow">
            <div className="metric-header">NSE Price</div>
            <div className="metric-value">₹{Number(nsePrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="metric-footer">National Stock Exchange</div>
          </div>
        )}
        {bsePrice != null && (
          <div className="neo-card metric-card metric-card-green">
            <div className="metric-header">BSE Price</div>
            <div className="metric-value">₹{Number(bsePrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="metric-footer">Bombay Stock Exchange</div>
          </div>
        )}
        {stock.industry && (
          <div className="neo-card metric-card metric-card-purple">
            <div className="metric-header"><Building2 size={16} style={{ display: 'inline', marginRight: '4px' }} />Industry</div>
            <div className="metric-value" style={{ fontSize: '1.2rem', wordBreak: 'break-word' }}>{stock.industry}</div>
            <div className="metric-footer">{stock.companyName}</div>
          </div>
        )}
      </div>

      {/* ORDER PANEL */}
      <div className="neo-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1.25rem', fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.2rem' }}>
          PLACE ORDER · {stock.symbol}
        </h3>

        {/* Qty control */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 700 }}>Quantity:</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
            <button
              className="neo-btn neo-btn-outline"
              style={{ padding: '0.5rem 0.85rem', borderRadius: '8px 0 0 8px', minWidth: 'unset' }}
              onClick={() => setQty(q => Math.max(1, q - 1))}
            >
              <Minus size={14} />
            </button>
            <input
              id="order-qty"
              type="number"
              min="1"
              value={qty}
              onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
              style={{
                width: '70px',
                textAlign: 'center',
                border: '2px solid var(--black, #111)',
                borderLeft: 'none',
                borderRight: 'none',
                padding: '0.5rem',
                fontWeight: 800,
                fontSize: '1rem',
                background: 'transparent',
                color: 'inherit',
                outline: 'none',
              }}
            />
            <button
              className="neo-btn neo-btn-outline"
              style={{ padding: '0.5rem 0.85rem', borderRadius: '0 8px 8px 0', minWidth: 'unset' }}
              onClick={() => setQty(q => q + 1)}
            >
              <Plus size={14} />
            </button>
          </div>
          {displayPrice != null && (
            <span style={{ color: '#555', fontWeight: 600, fontSize: '0.9rem' }}>
              Est. Total: ₹{(qty * displayPrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          )}
        </div>

        {/* BUY / SELL buttons */}
        <div className="hero-actions" style={{ flexWrap: 'wrap' }}>
          <button
            id="btn-buy"
            className="neo-btn neo-btn-green"
            style={{ padding: '1rem 2.5rem', opacity: orderLoading ? 0.6 : 1 }}
            disabled={orderLoading}
            onClick={() => handleOrder('BUY')}
          >
            {orderLoading ? <RefreshCw className="spin-icon" size={16} /> : null}
            BUY {stock.symbol}
          </button>
          <button
            id="btn-sell"
            className="neo-btn neo-btn-secondary"
            style={{ padding: '1rem 2.5rem', opacity: orderLoading ? 0.6 : 1 }}
            disabled={orderLoading}
            onClick={() => handleOrder('SELL')}
          >
            {orderLoading ? <RefreshCw className="spin-icon" size={16} /> : null}
            SELL {stock.symbol}
          </button>
        </div>

        {/* Order result banner */}
        {orderResult && (
          <div style={{
            marginTop: '1.25rem',
            padding: '1rem 1.25rem',
            border: `2px solid ${orderResult.success ? '#00E699' : '#ff4d4d'}`,
            borderRadius: '8px',
            background: orderResult.success ? 'rgba(0,230,153,0.08)' : 'rgba(255,77,77,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontWeight: 700,
          }}>
            {orderResult.success
              ? <CheckCircle size={20} color="#00E699" />
              : <AlertCircle size={20} color="#ff4d4d" />}
            {orderResult.message}
            {orderResult.success && (
              <Link to="/orders" style={{ marginLeft: 'auto', textDecoration: 'underline', fontWeight: 800, fontSize: '0.85rem' }}>
                View Orders →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StockDetails;
