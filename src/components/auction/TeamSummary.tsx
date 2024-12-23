import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, DollarSign, Star } from 'lucide-react';

interface TeamSummaryProps {
  team: {
    name: string;
    color: string;
    budget: number;
  };
  players: Array<{
    name: string;
    role: string;
    soldPrice: number;
  }>;
  onClose: () => void;
}

const TeamSummary: React.FC<TeamSummaryProps> = ({ team, players, onClose }) => {
  const totalSpent = players.reduce((acc, player) => acc + player.soldPrice, 0);
  const roleDistribution = players.reduce((acc, player) => {
    acc[player.role] = (acc[player.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const calculateTeamStrength = () => {
    const hasKeyRoles = roleDistribution['Batsman'] >= 6 && 
                       roleDistribution['Bowler'] >= 6 && 
                       roleDistribution['All-rounder'] >= 3;
    const budgetEfficiency = (totalSpent / team.budget) * 100;
    
    if (hasKeyRoles && budgetEfficiency < 90) return 'Excellent';
    if (hasKeyRoles && budgetEfficiency < 95) return 'Good';
    if (hasKeyRoles) return 'Balanced';
    return 'Needs Improvement';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 rounded-2xl p-8 max-w-4xl w-full border border-purple-500/20"
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 bg-gradient-to-r ${team.color} rounded-xl flex items-center justify-center`}>
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">{team.name}</h2>
              <p className="text-purple-200">Team Summary</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-purple-200">Remaining Budget</p>
            <p className="text-2xl font-bold text-white">₹{((team.budget - totalSpent) / 10000000).toFixed(1)}Cr</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Squad Size</h3>
            </div>
            <p className="text-3xl font-bold text-white">{players.length}/25</p>
          </div>

          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-5 w-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Total Spent</h3>
            </div>
            <p className="text-3xl font-bold text-white">₹{(totalSpent / 10000000).toFixed(1)}Cr</p>
          </div>

          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Team Strength</h3>
            </div>
            <p className="text-3xl font-bold text-white">{calculateTeamStrength()}</p>
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Role Distribution</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(roleDistribution).map(([role, count]) => (
              <div key={role} className="bg-white/10 rounded-lg p-3">
                <p className="text-purple-200 text-sm">{role}s</p>
                <p className="text-2xl font-bold text-white">{count}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 rounded-xl text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-colors"
          >
            Continue Auction
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default TeamSummary;