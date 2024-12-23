import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import CreateMatch from './CreateMatch';
import ManageMatches from './ManageMatches';
import ManagePlayers from './ManagePlayers';
import MatchPredictions from './MatchPredictions';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="matches/create" element={<CreateMatch />} />
      <Route path="matches" element={<ManageMatches />} />
      <Route path="players" element={<ManagePlayers />} />
      <Route path="match-predictions" element={<MatchPredictions />} />
    </Routes>
  );
};

export default AdminRoutes;