import React, { useEffect, useState } from 'react';
import { getHoldings, getPositions, getTrending } from '../services/api';
import {
  Wallet, Activity, PieChart, RefreshCw, ArrowUpRight,
  TrendingUp, TrendingDown, Flame
} from 'lucide-react';
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale,
  BarElement, Title
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import './Dashboard.css';

ChartJS.register(
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale,
  BarElement, Title
);

const NEO_COLORS = ['#FFE14A', '#00E699', '#C8A7FF', '#FF8FD8', '#FF8A3D', '#65B7FF', '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181'];

const Dashboard = () => {
  const [holdings, setHoldings] = useState([]);
  const [positions, setPositions] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [holdingsData, positionsData, trendingRaw] = await Promise.all([
        getHoldings(),
        getPositions(),
        getTrending()
      ]);

      setHoldings(holdingsData);
      setPositions(positionsData);

      // ── REAL API SHAPE ──────────────────────────────────────────────────────
      // { "trending_stocks": { "top_gainers": [...], "top_losers": [...], ... } }
      // ────────────────────────────────────────────────────────────────────────
      let stocks = [];

      if (Array.isArray(trendingRaw)) {
        stocks = trendingRaw;
      } else if (trendingRaw?.trending_stocks) {
        const ts = trendingRaw.trending_stocks;
        // Merge all sub-lists (top_gainers, top_losers, etc.)
        stocks = [
          ...(ts.top_gainers || []),
          ...(ts.top_losers || []),
          ...(ts.most_active || []),
          ...(ts.trending || []),
        ];
      } else {
        // Fallback: try common key names
        stocks =
          trendingRaw?.data ||
          trendingRaw?.stocks ||
          trendingRaw?.trending ||
          trendingRaw?.top_gainers ||
          [];
      }

      console.log('[Dashboard] Trending stocks extracted:', stocks.length, stocks[0]);
      setTrending(stocks);

    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Unable to connect to backend server at http://localhost:3002. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ── Portfolio Calculations ────────────────────────────────────────────────
  const totalInvestment = holdings.reduce((sum, h) => sum + ((h.avg || 0) * (h.qty || 0)), 0);
  const currentValue    = holdings.reduce((sum, h) => sum + ((h.price || 0) * (h.qty || 0)), 0);
  const totalPnl        = currentValue - totalInvestment;
  const pnlPercentage   = totalInvestment > 0 ? (totalPnl / totalInvestment) * 100 : 0;

  // ── CHART 1: Trending % Change Bar Chart ─────────────────────────────────
  // Shows percent_change for each trending stock
  const chartStocks = trending.slice(0, 10); // cap at 10 for readability
  const barData = {
    // ticker_id is a numeric BSE code — use company_name for readable labels
    labels: chartStocks.map(s => s.company_name || s.companyName || s.ticker_id || s.symbol || '?'),
    datasets: [{
      label: '% Change',
      data: chartStocks.map(s => parseFloat(s.percent_change || s.percentChange || 0)),
      backgroundColor: chartStocks.map((s) => {
        const pct = parseFloat(s.percent_change || s.percentChange || 0);
        return pct >= 0 ? 'rgba(0,230,153,0.85)' : 'rgba(255,77,77,0.85)';
      }),
      borderColor: '#111111',
      borderWidth: 2,
      borderRadius: 4,
    }],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.parsed.y >= 0 ? '+' : ''}${ctx.parsed.y.toFixed(2)}%`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#333', font: { weight: '700', size: 11 } },
        grid: { display: false },
      },
      y: {
        ticks: {
          color: '#333',
          callback: (v) => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`,
        },
        grid: { color: 'rgba(0,0,0,0.07)' },
      },
    },
  };

  // ── CHART 2: Trending Volume Doughnut ─────────────────────────────────────
  // Shows volume distribution among trending stocks (falls back to holdings if no trending)
  const doughnutStocks = trending.length > 0 ? trending.slice(0, 8) : null;

  const doughnutData = doughnutStocks
    ? {
        labels: doughnutStocks.map(s => s.company_name || s.companyName || s.ticker_id || '?'),
        datasets: [{
          data: doughnutStocks.map(s => parseFloat(s.volume || 0)),
          backgroundColor: NEO_COLORS.slice(0, doughnutStocks.length),
          borderColor: '#111111',
          borderWidth: 2,
        }],
      }
    : {
        labels: holdings.map(h => h.name),
        datasets: [{
          data: holdings.map(h => (h.price || 0) * (h.qty || 0)),
          backgroundColor: NEO_COLORS.slice(0, holdings.length),
          borderColor: '#111111',
          borderWidth: 3,
        }],
      };

  // ── Trend Badge ───────────────────────────────────────────────────────────
  const getTrendBadge = (trend) => {
    if (!trend) return <span className="neo-badge neo-badge-neutral">—</span>;
    const t = String(trend).toLowerCase();
    if (t.includes('bull') || t.includes('up') || t.includes('strong') || t.includes('positive') || t.includes('buy')) {
      return (
        <span className="neo-badge neo-badge-green" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
          <TrendingUp size={11} /> {trend}
        </span>
      );
    }
    if (t.includes('bear') || t.includes('down') || t.includes('weak') || t.includes('negative') || t.includes('sell')) {
      return (
        <span className="neo-badge neo-badge-red" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
          <TrendingDown size={11} /> {trend}
        </span>
      );
    }
    return <span className="neo-badge neo-badge-neutral">{trend}</span>;
  };

  // ── Loading / Error ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="dashboard-loading">
        <RefreshCw className="spin-icon" size={36} />
        <h2>LOADING TEPLINE TERMINAL...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error neo-card" style={{ padding: '3rem', maxWidth: '600px', margin: '4rem auto' }}>
        <h2>BACKEND CONNECTION OFFLINE</h2>
        <p style={{ margin: '1rem 0' }}>{error}</p>
        <button onClick={fetchData} className="neo-btn neo-btn-green">RETRY CONNECTION</button>
      </div>
    );
  }

  return (
    <div className="dashboard-page">

      {/* PAGE HEADER */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">TRADING TERMINAL</h1>
          <p className="dashboard-subtitle">Real-time market trends and portfolio overview</p>
        </div>
        <button onClick={fetchData} className="neo-btn neo-btn-yellow">
          <RefreshCw size={16} /> REFRESH
        </button>
      </div>

      {/* METRIC CARDS */}
      <div className="metrics-grid">
        <div className="neo-card metric-card metric-card-yellow">
          <div className="metric-header">
            <span>Portfolio Value</span>
            <Wallet size={24} color="#111" />
          </div>
          <div className="metric-value">
            ₹{currentValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
          <div className="metric-footer">
            Invested: ₹{totalInvestment.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="neo-card metric-card metric-card-green">
          <div className="metric-header">
            <span>Total P&L</span>
            <Activity size={24} color="#111" />
          </div>
          <div className="metric-value">
            {totalPnl >= 0 ? '+' : ''}₹{totalPnl.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
          <div className="metric-footer">
            <span className={`neo-badge ${totalPnl >= 0 ? 'neo-badge-green' : 'neo-badge-red'}`}>
              {totalPnl >= 0 ? '+' : ''}{pnlPercentage.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="neo-card metric-card metric-card-purple">
          <div className="metric-header">
            <span>Active Holdings</span>
            <PieChart size={24} color="#111" />
          </div>
          <div className="metric-value">{holdings.length}</div>
          <div className="metric-footer">
            <Link to="/holdings" className="link-text">Manage Holdings →</Link>
          </div>
        </div>
      </div>

      {/* CHARTS — driven by trending data */}
      <div className="dashboard-charts-grid">

        {/* BAR CHART: Trending % Change */}
        <div className="neo-card chart-card">
          <h3>
            TRENDING STOCKS — % CHANGE
            {chartStocks.length > 0 && (
              <span style={{ fontWeight: 600, fontSize: '0.8rem', marginLeft: '0.5rem', color: '#555' }}>
                (top {chartStocks.length})
              </span>
            )}
          </h3>
          <div className="chart-wrapper">
            {chartStocks.length > 0 ? (
              <Bar data={barData} options={barOptions} />
            ) : (
              <p className="no-data">No trending data loaded yet.</p>
            )}
          </div>
        </div>

        {/* DOUGHNUT: Volume distribution */}
        <div className="neo-card chart-card">
          <h3>
            {doughnutStocks ? 'TRENDING VOLUME SHARE' : 'ASSET ALLOCATION'}
          </h3>
          <div className="chart-wrapper">
            {(doughnutStocks ? doughnutStocks.length : holdings.length) > 0 ? (
              <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
            ) : (
              <p className="no-data">No data to display.</p>
            )}
          </div>
        </div>
      </div>

      {/* TRENDING STOCKS TABLE */}
      <div className="neo-card table-card">
        <div className="table-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Flame size={20} color="#111" />
            <h3 style={{ margin: 0 }}>
              TRENDING STOCKS
              {trending.length > 0 && (
                <span style={{ fontWeight: 600, fontSize: '0.85rem', marginLeft: '0.5rem', color: '#555' }}>
                  ({trending.length} stocks)
                </span>
              )}
            </h3>
          </div>
          <span className="neo-badge neo-badge-yellow">LIVE MARKET DATA</span>
        </div>

        <div className="table-wrapper">
          <table className="tepline-table">
            <thead>
              <tr>
                <th>Stock / Company</th>
                <th>Price</th>
                <th>Change %</th>
                <th>Net Change</th>
                <th>Volume</th>
                <th>Short Trend</th>
                <th>Long Trend</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {trending.length > 0 ? (
                trending.map((s, i) => {
                  const pct      = parseFloat(s.percent_change || s.percentChange || 0);
                  const net      = parseFloat(s.net_change     || s.netChange     || 0);
                  const rawPrice = s.price || s.currentPrice   || s.last_price;
                  const priceDisplay = rawPrice != null
                    ? `₹${Number(rawPrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : '—';
                  const volume   = s.volume
                    ? Number(s.volume).toLocaleString('en-IN')
                    : '—';

                  // ticker_id is a numeric BSE code — company_name is the real identifier
                  // The backend /api/stocks/:symbol expects the company name (e.g. 'HCL Technologies')
                  const company  = s.company_name || s.companyName || '';
                  const bseCode  = s.ticker_id    || s.symbol      || '';
                  const navSymbol = encodeURIComponent(company || bseCode);

                  return (
                    <tr key={`${bseCode}-${i}`}>
                      <td>
                        <div className="font-bold">{company || bseCode}</div>
                        {bseCode && company && (
                          <div style={{ fontSize: '0.75rem', color: '#888', fontWeight: 600 }}>BSE: {bseCode}</div>
                        )}
                      </td>
                      <td className="font-bold">{priceDisplay}</td>
                      <td className={pct >= 0 ? 'text-green font-bold' : 'text-red font-bold'}>
                        {pct >= 0 ? '+' : ''}{pct.toFixed(2)}%
                      </td>
                      <td className={net >= 0 ? 'text-green' : 'text-red'}>
                        {net >= 0 ? '+' : ''}{net.toFixed(2)}
                      </td>
                      <td>{volume}</td>
                      <td>{getTrendBadge(s.short_term_trends || s.shortTermTrend)}</td>
                      <td>{getTrendBadge(s.long_term_trends  || s.longTermTrend)}</td>
                      <td>
                        {navSymbol ? (
                          <Link
                            to={`/stock/${navSymbol}`}
                            className="neo-badge neo-badge-yellow"
                            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                          >
                            VIEW <ArrowUpRight size={13} />
                          </Link>
                        ) : '—'}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2.5rem', color: '#555' }}>
                    No trending data available. Check backend / API key.
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

export default Dashboard;
