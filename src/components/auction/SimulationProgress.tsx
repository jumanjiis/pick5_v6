import React from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

interface SimulationProgressProps {
  currentPlayer: any;
  totalPlayers: number;
  currentIndex: number;
}

const SimulationProgress: React.FC<SimulationProgressProps> = ({
  currentPlayer,
  totalPlayers,
  currentIndex,
}) => {
  const progress = ((currentIndex + 1) / totalPlayers) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 rounded-xl p-6 max-w-md w-full border border-purple-500/20">
        <div className="flex items-center justify-center mb-4">
          <Loader className="h-8 w-8 text-purple-400 animate-spin" />
        </div>
        
        <h3 className="text-xl font-bold text-white text-center mb-2">
          Simulating Auction
        </h3>
        
        <p className="text-purple-200 text-center mb-4">
          Currently auctioning: {currentPlayer?.name}
        </p>

        <div className="w-full bg-white/10 rounded-full h-2 mb-2">
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <p className="text-sm text-center text-purple-200">
          {currentIndex + 1} of {totalPlayers} players
        </p>
      </div>
    </div>
  );
};

export default SimulationProgress;