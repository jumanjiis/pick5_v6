import React from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface TurnIndicatorProps {
  currentTeam: string;
  isYourTurn: boolean;
  timeLeft: number;
}

const TurnIndicator: React.FC<TurnIndicatorProps> = ({
  currentTeam,
  isYourTurn,
  timeLeft,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed top-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full backdrop-blur-lg border ${
        isYourTurn ? 'bg-green-500/20 border-green-500/40' : 'bg-white/10 border-purple-500/20'
      }`}
    >
      <div className="flex items-center space-x-3">
        <Clock className={`h-5 w-5 ${isYourTurn ? 'text-green-400' : 'text-purple-400'}`} />
        <div className="text-white">
          <span className="font-semibold">{currentTeam}'s Turn</span>
          <span className="mx-2">•</span>
          <span>{timeLeft}s</span>
        </div>
      </div>
    </motion.div>
  );
};

export default TurnIndicator;