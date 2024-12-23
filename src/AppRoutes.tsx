import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PlayMatch from './pages/PlayMatch';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoutes from './pages/admin';
import AdminRoute from './components/AdminRoute';
import Leaderboard from './pages/Leaderboard';
import Stats from './pages/Stats';
import HowToPlay from './pages/HowToPlay';
import Contact from './pages/Contact';
import IPLAuction from './pages/IPLAuction';

const AppRoutes: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/how-to-play" element={<HowToPlay />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/ipl-auction" element={<IPLAuction />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <AdminRoutes />
            </AdminRoute>
          }
        />
        <Route
          path="/play/:matchId"
          element={
            <ProtectedRoute>
              <PlayMatch />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default AppRoutes;