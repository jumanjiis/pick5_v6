import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface NextPlayerButtonProps {
  onClick: () => void;
  playerName: string;
}

const NextPlayerButton: React.FC<NextPlayerButtonProps> = ({ onClick, playerName }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center space-x-3 shadow-lg"
    >
      <span className="text-lg">Next Player: {playerName}</span>
      <ChevronRight className="h-6 w-6" />
    </motion.button>
  );
};

export default NextPlayerButton;