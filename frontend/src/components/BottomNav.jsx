import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Layers, ShoppingCart, Wallet } from 'lucide-react';
import './BottomNav.css';

const BottomNav = () => {
  return (
    <nav className="tepline-bottom-nav">
      <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'bnav-item active' : 'bnav-item')}>
        <LayoutDashboard size={20} />
        <span>Dashboard</span>
      </NavLink>
      <NavLink to="/holdings" className={({ isActive }) => (isActive ? 'bnav-item active' : 'bnav-item')}>
        <Briefcase size={20} />
        <span>Holdings</span>
      </NavLink>
      <NavLink to="/positions" className={({ isActive }) => (isActive ? 'bnav-item active' : 'bnav-item')}>
        <Layers size={20} />
        <span>Positions</span>
      </NavLink>
      <NavLink to="/orders" className={({ isActive }) => (isActive ? 'bnav-item active' : 'bnav-item')}>
        <ShoppingCart size={20} />
        <span>Orders</span>
      </NavLink>
      <NavLink to="/funds" className={({ isActive }) => (isActive ? 'bnav-item active' : 'bnav-item')}>
        <Wallet size={20} />
        <span>Funds</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
