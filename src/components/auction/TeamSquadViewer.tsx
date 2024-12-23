import React from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Star, X } from 'lucide-react';

interface TeamSquadViewerProps {
  team: any;
  onClose: () => void;
}

const TeamSquadViewer: React.FC<TeamSquadViewerProps> = ({ team, onClose }) => {
  const overseasCount = team.currentPlayers.filter((p: any) => p.type === 'Overseas').length;
  const indianCount = team.currentPlayers.filter((p: any) => p.type === 'Indian').length;
  const newBuys = team.currentPlayers.filter((p: any) => p.isNewBuy);
  const existingPlayers = team.currentPlayers.filter((p: any) => !p.isNewBuy);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 rounded-2xl p-8 max-w-4xl w-full border border-purple-500/20 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 bg-gradient-to-r ${team.color} rounded-xl flex items-center justify-center`}>
              <Star className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className={`text-3xl font-bold ${team.textColor}`}>{team.name}</h2>
              <p className="text-purple-200">Team Squad</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Squad Size</h3>
            </div>
            <p className="text-3xl font-bold text-white">{team.currentPlayers.length}/25</p>
          </div>

          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-5 w-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Remaining Budget</h3>
            </div>
            <p className="text-3xl font-bold text-white">₹{(team.budget / 10000000).toFixed(1)}Cr</p>
          </div>

          <div className="bg-white/10 rounded-xl p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Player Types</h3>
            </div>
            <div className="space-y-1">
              <p className="text-blue-200">Overseas: {overseasCount}/8</p>
              <p className="text-green-200">Indian: {indianCount}</p>
            </div>
          </div>
        </div>

        {newBuys.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Star className="h-6 w-6 mr-2 text-yellow-400" />
              New Acquisitions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {newBuys.map((player: any, index: number) => (
                <div key={index} className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
                  <h4 className="font-semibold text-white mb-1">{player.name}</h4>
                  <p className="text-yellow-200 text-sm mb-2">{player.role}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200 text-sm">{player.type}</span>
                    {player.price && (
                      <span className="text-green-400">₹{(player.price / 10000000).toFixed(1)}Cr</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Existing Squad</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {existingPlayers.map((player: any, index: number) => (
              <div key={index} className="bg-white/10 rounded-xl p-4">
                <h4 className="font-semibold text-white mb-1">{player.name}</h4>
                <p className="text-purple-200 text-sm mb-2">{player.role}</p>
                <span className="text-purple-200 text-sm">{player.type}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TeamSquadViewer;