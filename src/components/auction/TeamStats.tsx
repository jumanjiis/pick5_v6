import React from 'react';
import { Users, Star, DollarSign } from 'lucide-react';
import type { Team } from './types';

interface TeamStatsProps {
  team: Team;
  teamStrength: string;
}

const TeamStats: React.FC<TeamStatsProps> = ({ team, teamStrength }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
    <div className="bg-white/10 rounded-xl p-4">
      <div className="flex items-center space-x-2 mb-2">
        <Users className="h-5 w-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Squad Size</h3>
      </div>
      <p className="text-3xl font-bold text-white">{team.currentPlayers.length}/25</p>
      <div className="mt-2 text-sm">
        <p className="text-purple-200">
          New: {team.currentPlayers.filter(p => p.isNewBuy).length}
        </p>
        <p className="text-purple-200">
          Retained: {team.currentPlayers.filter(p => !p.isNewBuy).length}
        </p>
      </div>
    </div>

    <div className="bg-white/10 rounded-xl p-4">
      <div className="flex items-center space-x-2 mb-2">
        <Star className="h-5 w-5 text-yellow-400" />
        <h3 className="text-lg font-semibold text-white">Team Strength</h3>
      </div>
      <p className="text-3xl font-bold text-white">{teamStrength}</p>
    </div>

    <div className="bg-white/10 rounded-xl p-4">
      <div className="flex items-center space-x-2 mb-2">
        <DollarSign className="h-5 w-5 text-green-400" />
        <h3 className="text-lg font-semibold text-white">Total Spent</h3>
      </div>
      <p className="text-3xl font-bold text-white">
        ₹{((team.initialBudget - team.budget) / 10000000).toFixed(1)}Cr
      </p>
    </div>

    <div className="bg-white/10 rounded-xl p-4">
      <div className="flex items-center space-x-2 mb-2">
        <DollarSign className="h-5 w-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Purse Remaining</h3>
      </div>
      <p className="text-3xl font-bold text-white">₹{(team.budget / 10000000).toFixed(1)}Cr</p>
    </div>
  </div>
)

export default TeamStats;