import React from 'react';
import { motion } from 'framer-motion';
import { Play, FastForward } from 'lucide-react';

interface SimulationControlsProps {
  isSimulating: boolean;
  isPaused: boolean;
  onSimulate: () => void;
  onResume: () => void;
  disabled?: boolean;
}

const SimulationControls: React.FC<SimulationControlsProps> = ({
  isSimulating,
  isPaused,
  onSimulate,
  onResume,
  disabled
}) => {
  if (isSimulating && !isPaused) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-20 left-1/2 -translate-x-1/2 flex space-x-4 z-[90]"
    >
      {isPaused ? (
        <button
          onClick={onResume}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center space-x-2"
        >
          <Play className="h-5 w-5" />
          <span>Resume Auction</span>
        </button>
      ) : (
        <button
          onClick={onSimulate}
          disabled={disabled}
          className={`px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 ${
            disabled
              ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
          }`}
        >
          <FastForward className="h-5 w-5" />
          <span>Simulate Auction</span>
        </button>
      )}
    </motion.div>
  );
};

export default SimulationControls;