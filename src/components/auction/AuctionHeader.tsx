import React from 'react';
import { Volume2, VolumeX, Timer, Users, Book } from 'lucide-react';
import { motion } from 'framer-motion';

interface AuctionHeaderProps {
  team?: {
    name: string;
    textColor?: string;
    budget: number;
  };
  isSoundEnabled: boolean;
  toggleSound: () => void;
  squadCount: number;
  onShowRules: () => void;
}

const AuctionHeader: React.FC<AuctionHeaderProps> = ({
  team,
  isSoundEnabled,
  toggleSound,
  squadCount,
  onShowRules,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-purple-900/40 backdrop-blur-lg rounded-xl border border-purple-300/20 p-4 max-w-3xl mx-auto"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSound}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
          >
            {isSoundEnabled ? (
              <Volume2 className="h-6 w-6 text-white" />
            ) : (
              <VolumeX className="h-6 w-6 text-white" />
            )}
          </button>

          <button
            onClick={onShowRules}
            className="flex items-center space-x-2 px-4 py-2 bg-yellow-500/20 rounded-lg hover:bg-yellow-500/30 transition-colors"
          >
            <Book className="h-5 w-5 text-yellow-400" />
            <span className="text-white">Auction Rules</span>
          </button>

          {team && (
            <div className={`text-2xl font-bold ${team.textColor || 'text-white'}`}>
              {team.name}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="bg-white/10 px-4 py-2 rounded-lg flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-400" />
            <span className="text-white font-bold">{squadCount}/25</span>
          </div>

          {team && (
            <div className="bg-white/10 px-4 py-2 rounded-lg flex items-center space-x-2">
              <span className="text-green-400">₹</span>
              <span className="text-white font-bold">{(team.budget / 10000000).toFixed(1)}Cr</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AuctionHeader;