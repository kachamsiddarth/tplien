import React, { useEffect, useState } from 'react';
import { getHoldings, getPositions } from '../services/api';
import { Wallet, Activity, PieChart, RefreshCw, ArrowUpRight } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import './Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const Dashboard = () => {
  const [holdings, setHoldings] = useState([]);
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [holdingsData, positionsData] = await Promise.all([
        getHoldings(),
        getPositions()
      ]);
      setHoldings(holdingsData);
      setPositions(positionsData);
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError("Unable to connect to backend server at http://localhost:3002. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Dynamic Portfolio Calculations from backend holdings
  const totalInvestment = holdings.reduce((sum, h) => sum + ((h.avg || 0) * (h.qty || 0)), 0);
  const currentValue = holdings.reduce((sum, h) => sum + ((h.price || 0) * (h.qty || 0)), 0);
  const totalPnl = currentValue - totalInvestment;
  const pnlPercentage = totalInvestment > 0 ? (totalPnl / totalInvestment) * 100 : 0;

  // Doughnut Chart Data (Neobrutalist palette)
  const doughnutData = {
    labels: holdings.map(h => h.name),
    datasets: [
      {
        data: holdings.map(h => (h.price || 0) * (h.qty || 0)),
        backgroundColor: ['#FFE14A', '#00E699', '#C8A7FF', '#FF8FD8', '#FF8A3D', '#65B7FF'],
        borderColor: '#111111',
        borderWidth: 3,
      },
    ],
  };

  const lineData = {
    labels: ['Start', '9:30', '11:30', '1:30', '3:30', 'Close'],
    datasets: [
      {
        label: 'Portfolio Value Trend',
        data: [totalInvestment, totalInvestment * 1.02, totalInvestment * 0.98, currentValue * 0.99, currentValue],
        borderColor: '#111111',
        backgroundColor: '#00E699',
        tension: 0.2,
        borderWidth: 4,
        pointBackgroundColor: '#FFE14A',
        pointBorderColor: '#111111',
        pointRadius: 6,
      },
    ],
  };

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
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">TRADING TERMINAL</h1>
          <p className="dashboard-subtitle">Overview of your real-time holdings and market positions</p>
        </div>
        <button onClick={fetchData} className="neo-btn neo-btn-yellow">
          <RefreshCw size={16} /> REFRESH
        </button>
      </div>

      {/* METRIC CARDS GRID */}
      <div className="metrics-grid">
        <div className="neo-card metric-card metric-card-yellow">
          <div className="metric-header">
            <span>Portfolio Value</span>
            <Wallet size={24} color="#111" />
          </div>
          <div className="metric-value">₹{currentValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
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

      {/* CHARTS & PREVIEW GRID */}
      <div className="dashboard-charts-grid">
        <div className="neo-card chart-card">
          <h3>PORTFOLIO PERFORMANCE TREND</h3>
          <div className="chart-wrapper">
            <Line data={lineData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="neo-card chart-card">
          <h3>ASSET ALLOCATION</h3>
          <div className="chart-wrapper">
            {holdings.length > 0 ? (
              <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
            ) : (
              <p className="no-data">No active holdings to chart.</p>
            )}
          </div>
        </div>
      </div>

      {/* TOP HOLDINGS PREVIEW TABLE */}
      <div className="neo-card table-card">
        <div className="table-card-header">
          <h3>TOP HOLDINGS SUMMARY</h3>
          <Link to="/holdings" className="neo-btn neo-btn-cyan">VIEW ALL ({holdings.length})</Link>
        </div>
        <div className="table-wrapper">
          <table className="tepline-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Qty</th>
                <th>Avg. Price</th>
                <th>Current Price</th>
                <th>Current Value</th>
                <th>P&L</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {holdings.slice(0, 5).map((h, i) => {
                const inv = (h.avg || 0) * (h.qty || 0);
                const cur = (h.price || 0) * (h.qty || 0);
                const pnl = cur - inv;
                return (
                  <tr key={i}>
                    <td className="font-bold">{h.name}</td>
                    <td>{h.qty}</td>
                    <td>₹{h.avg}</td>
                    <td>₹{h.price}</td>
                    <td>₹{cur.toFixed(2)}</td>
                    <td className={pnl >= 0 ? 'text-green' : 'text-red'}>
                      {pnl >= 0 ? '+' : ''}₹{pnl.toFixed(2)}
                    </td>
                    <td>
                      <Link to={`/stock/${h.name}`} className="neo-badge neo-badge-yellow" style={{ textDecoration: 'none' }}>
                        VIEW <ArrowUpRight size={14} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
