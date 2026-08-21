import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import AIChat from './components/AIChat/AIChat';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Holdings from './pages/Holdings';
import Positions from './pages/Positions';
import Orders from './pages/Orders';
import Funds from './pages/Funds';
import StockDetails from './pages/StockDetails';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            
            <Route path="/positions" element={<Positions />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/funds" element={<Funds />} />
            <Route path="/stock/:symbol" element={<StockDetails />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <AIChat />
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;
