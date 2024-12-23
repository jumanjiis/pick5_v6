import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, DollarSign, Star, X } from 'lucide-react';
import type { Team } from './types';

interface AuctionSummaryProps {
  teams: Record<string, Team>;
  userTeam: string;
  onClose: () => void;
}

const AuctionSummary: React.FC<AuctionSummaryProps> = ({ teams, userTeam, onClose }) => {
  const [selectedTeamId, setSelectedTeamId] = useState(userTeam);
  const selectedTeam = teams[selectedTeamId];

  const getPlayersByRole = (players: any[], role: string, isNewBuy: boolean | undefined = undefined) => {
    return players
      .filter(p => {
        if (isNewBuy !== undefined && p.isNewBuy !== isNewBuy) return false;
        if (role === 'BATTER/WK') {
          return p.role === 'BATTER' || p.role === 'WICKETKEEPER';
        }
        return p.role === role;
      })
      .sort((a, b) => {
        if (a.price && b.price) return b.price - a.price;
        if (a.price) return -1;
        if (b.price) return 1;
        return a.name.localeCompare(b.name);
      });
  };

  const calculateTeamStrength = (team: Team) => {
    const roleDistribution = team.currentPlayers.reduce((acc: Record<string, number>, player) => {
      acc[player.role] = (acc[player.role] || 0) + 1;
      return acc;
    }, {});

    const hasKeyRoles = 
      ((roleDistribution['BATTER'] || 0) + (roleDistribution['WICKETKEEPER'] || 0)) >= 6 &&
      (roleDistribution['BOWLER'] || 0) >= 6 &&
      (roleDistribution['ALL-ROUNDER'] || 0) >= 3;

    const budgetEfficiency = ((team.initialBudget - team.budget) / team.initialBudget) * 100;

    if (hasKeyRoles && budgetEfficiency < 90) return 'Excellent';
    if (hasKeyRoles && budgetEfficiency < 95) return 'Good';
    if (hasKeyRoles) return 'Balanced';
    return 'Needs Improvement';
  };

  const roleCategories = [
    { title: 'Batters & Wicket-keepers', role: 'BATTER/WK' },
    { title: 'All-rounders', role: 'ALL-ROUNDER' },
    { title: 'Bowlers', role: 'BOWLER' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 rounded-2xl p-8 max-w-7xl w-full border border-purple-500/20 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 bg-gradient-to-r ${selectedTeam.color} rounded-xl flex items-center justify-center`}>
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">{selectedTeam.name}</h2>
              <p className="text-purple-200">IPL 2024 Squad</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Squad Size</h3>
            </div>
            <p className="text-3xl font-bold text-white">{selectedTeam.currentPlayers.length}/25</p>
            <div className="mt-2 text-sm">
              <p className="text-purple-200">
                New: {selectedTeam.currentPlayers.filter(p => p.isNewBuy).length}
              </p>
              <p className="text-purple-200">
                Retained: {selectedTeam.currentPlayers.filter(p => !p.isNewBuy).length}
              </p>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Team Strength</h3>
            </div>
            <p className="text-3xl font-bold text-white">{calculateTeamStrength(selectedTeam)}</p>
          </div>

          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-5 w-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Total Spent</h3>
            </div>
            <p className="text-3xl font-bold text-white">
              ₹{((selectedTeam.initialBudget - selectedTeam.budget) / 10000000).toFixed(1)}Cr
            </p>
          </div>

          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Purse Remaining</h3>
            </div>
            <p className="text-3xl font-bold text-white">₹{(selectedTeam.budget / 10000000).toFixed(1)}Cr</p>
          </div>
        </div>

        {/* Squad Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {roleCategories.map(({ title, role }) => (
            <div key={role} className="bg-white/10 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>

              {/* New Acquisitions */}
              <div className="mb-6">
                <h4 className="text-yellow-400 font-semibold mb-3 flex items-center">
                  <Star className="h-4 w-4 mr-2" />
                  New Acquisitions
                </h4>
                <div className="space-y-3">
                  {getPlayersByRole(selectedTeam.currentPlayers, role, true).map((player, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-4 border border-yellow-500/30"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-white">{player.name}</h4>
                          <p className="text-sm text-purple-200">{player.type}</p>
                        </div>
                        {player.price && (
                          <span className="text-green-400 text-sm font-semibold">
                            ₹{(player.price / 10000000).toFixed(1)}Cr
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Retained Players */}
              <div>
                <h4 className="text-purple-400 font-semibold mb-3">Retained Players</h4>
                <div className="space-y-3">
                  {getPlayersByRole(selectedTeam.currentPlayers, role, false).map((player, index) => (
                    <div
                      key={index}
                      className="bg-white/10 rounded-lg p-4 border border-purple-500/20"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-white">{player.name}</h4>
                          <p className="text-sm text-purple-200">{player.type}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Team Selector */}
        <div className="mt-8 flex flex-wrap gap-2">
          {Object.entries(teams).map(([id, team]) => (
            <button
              key={id}
              onClick={() => setSelectedTeamId(id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedTeamId === id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                  : 'bg-white/10 text-purple-200 hover:bg-white/20'
              }`}
            >
              {team.name}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AuctionSummary;