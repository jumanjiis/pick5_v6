import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Calendar, Trophy, Settings } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8 border border-purple-500/20">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-purple-200">Manage matches, players, and monitor predictions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Create Match Card */}
          <Link
            to="/admin/matches/create"
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 hover:bg-white/20 transition-all duration-300 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Calendar className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Create Match</h2>
                <p className="text-purple-200">Set up new matches and targets</p>
              </div>
            </div>
          </Link>

          {/* Manage Matches Card */}
          <Link
            to="/admin/matches"
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 hover:bg-white/20 transition-all duration-300 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Settings className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Manage Matches</h2>
                <p className="text-purple-200">Edit or delete existing matches</p>
              </div>
            </div>
          </Link>

          {/* Manage Players Card */}
          <Link
            to="/admin/players"
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 hover:bg-white/20 transition-all duration-300 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Manage Players</h2>
                <p className="text-purple-200">Add and update player information</p>
              </div>
            </div>
          </Link>

          {/* Match Predictions Card */}
          <Link
            to="/admin/match-predictions"
            className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 hover:bg-white/20 transition-all duration-300 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Trophy className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Match Predictions</h2>
                <p className="text-purple-200">View predictions by match</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;