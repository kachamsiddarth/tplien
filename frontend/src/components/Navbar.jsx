import React from 'react';
import { NavLink } from 'react-router-dom';
import { TrendingUp, LayoutDashboard, Briefcase, Layers, ShoppingCart, Wallet } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="tepline-navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-logo">
          <div className="logo-icon">
            <TrendingUp size={24} color="#111" />
          </div>
          <span className="logo-text">TEPLINE<span className="logo-dot">.</span></span>
        </NavLink>

        <div className="navbar-links">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            Home
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            Dashboard
          </NavLink>
          <NavLink to="/holdings" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            Holdings
          </NavLink>
          <NavLink to="/positions" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            Positions
          </NavLink>
          <NavLink to="/orders" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            Orders
          </NavLink>
          <NavLink to="/funds" className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}>
            Funds
          </NavLink>
        </div>

        <div className="navbar-actions">
          <NavLink to="/dashboard" className="neo-btn neo-btn-green">
            LAUNCH TERMINAL
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
