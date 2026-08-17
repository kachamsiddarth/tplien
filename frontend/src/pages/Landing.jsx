import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, BarChart3, ShieldCheck, ChevronRight, ArrowUpRight } from 'lucide-react';
import TradingScene from '../three/TradingScene';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="hero-badge neo-badge neo-badge-cyan">
              ⚡ PURE NEOBRUTALIST TRADING TERMINAL
            </div>
            <h1 className="hero-title">
              TRADE. <br />
              TRACK. <br />
              <span className="highlight-box">BUILD.</span>
            </h1>
            <p className="hero-description">
              Zerodha-inspired portfolio dashboard built with an ultra-tactile neobrutalist design system, Three.js visuals, and real Express/MongoDB backend integration.
            </p>
            <div className="hero-actions">
              <Link to="/dashboard" className="neo-btn neo-btn-green">
                OPEN DASHBOARD <ArrowRight size={18} />
              </Link>
              <Link to="/holdings" className="neo-btn neo-btn-yellow">
                EXPLORE MARKETS
              </Link>
            </div>
          </motion.div>

          <div className="hero-3d-wrapper">
            <TradingScene />
            {/* Floating Neobrutalist Cards */}
            <motion.div 
              className="floating-card fc-1"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            >
              <div className="fc-symbol">NIFTY 50</div>
              <div className="fc-price">+1.42% <ArrowUpRight size={16} /></div>
            </motion.div>

            <motion.div 
              className="floating-card fc-2"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 1 }}
            >
              <div className="fc-symbol">RELIANCE</div>
              <div className="fc-price">₹1,310.00</div>
            </motion.div>

            <motion.div 
              className="floating-card fc-3"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut', delay: 0.5 }}
            >
              <div className="fc-symbol">TCS</div>
              <div className="fc-price">₹3,450.00</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MARKET STATS BANNER */}
      <section className="stats-banner">
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-value">₹12.4M+</span>
            <span className="stat-label">Daily Volume</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">&lt; 15ms</span>
            <span className="stat-label">Order Latency</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-value">100%</span>
            <span className="stat-label">MongoDB Backed</span>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">WHY TEPLINE?</h2>
          <p className="section-subtitle">Engineered for extreme performance and bold readability</p>
        </div>

        <div className="features-grid">
          <div className="neo-card feature-card">
            <div className="feature-icon bg-green"><Zap size={26} color="#111" /></div>
            <h3>Real-Time Engine</h3>
            <p>Live Express & MongoDB synchronization for instant holdings, positions, and live stock market quotes.</p>
          </div>

          <div className="neo-card feature-card">
            <div className="feature-icon bg-yellow"><BarChart3 size={26} color="#111" /></div>
            <h3>Portfolio Intelligence</h3>
            <p>Comprehensive yield tracking with automated P&L calculations, day changes, and asset allocation doughnut charts.</p>
          </div>

          <div className="neo-card feature-card">
            <div className="feature-icon bg-purple"><ShieldCheck size={26} color="#111" /></div>
            <h3>Pure Neobrutalism</h3>
            <p>High-contrast, tactile off-white theme with chunky 3px black borders, vibrant accents, and editorial typography.</p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="neo-card cta-card">
          <h2>ENTER THE TERMINAL</h2>
          <p>Launch your terminal now and manage your MongoDB portfolio instantly.</p>
          <Link to="/dashboard" className="neo-btn neo-btn-green" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
            OPEN DASHBOARD NOW <ChevronRight size={20} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="tepline-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <h3>TEPLINE<span className="logo-dot">.</span></h3>
            <p>© 2026 Tepline Stock Trading Platform. Pure Neobrutalist Edition.</p>
          </div>
          <div className="footer-links">
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/holdings">Holdings</Link>
            <Link to="/positions">Positions</Link>
            <Link to="/orders">Orders</Link>
            <Link to="/funds">Funds</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
