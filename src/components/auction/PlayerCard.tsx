import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, DollarSign } from 'lucide-react';

interface PlayerCardProps {
  player: {
    name: string;
    role: string;
    country: string;
    type: string;
    stats: {
      avg: number;
      sr: number;
    };
    caps?: {
      test?: number;
      odi?: number;
    };
    specialization: string;
    basePrice: number;
    minExpectedPrice: number;
  };
  currentBid: number;
  currentBidder: string;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  currentBid,
  currentBidder
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-purple-900/40 backdrop-blur-lg rounded-2xl border border-purple-300/20 p-6 w-full"
    >
      {/* Player Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Trophy className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{player.name}</h2>
            <div className="flex space-x-2">
              <span className="px-2 py-1 bg-purple-700/50 rounded-full text-sm text-purple-200">
                {player.role}
              </span>
              <span className="px-2 py-1 bg-purple-700/50 rounded-full text-sm text-purple-200">
                {player.country}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Base Price & Current Bid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-purple-800/30 rounded-xl p-4">
          <p className="text-purple-200 text-sm mb-1">Base Price</p>
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-purple-400 mr-1" />
            <p className="text-xl font-bold text-white">
              ₹{(player.basePrice / 10000000).toFixed(1)}Cr
            </p>
          </div>
        </div>

        <div className="bg-purple-800/30 rounded-xl p-4">
          <p className="text-purple-200 text-sm mb-1">Current Bid</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-green-400 mr-1" />
              <p className="text-xl font-bold text-white">
                ₹{(currentBid / 10000000).toFixed(1)}Cr
              </p>
            </div>
            {currentBidder && (
              <span className="text-green-400 text-sm font-semibold">{currentBidder}</span>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-purple-800/30 rounded-xl p-4">
          <p className="text-purple-200 text-sm mb-2">Career Stats</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-purple-200 text-xs">Average</p>
              <p className="text-lg font-bold text-white">{player.stats.avg}</p>
            </div>
            <div>
              <p className="text-purple-200 text-xs">Strike Rate</p>
              <p className="text-lg font-bold text-white">{player.stats.sr}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-800/30 rounded-xl p-4">
          <p className="text-purple-200 text-sm mb-2">Experience</p>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-purple-200 text-xs">Test</p>
              <p className="text-lg font-bold text-white">{player.caps?.test || 0}</p>
            </div>
            <div>
              <p className="text-purple-200 text-xs">ODI</p>
              <p className="text-lg font-bold text-white">{player.caps?.odi || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlayerCard;