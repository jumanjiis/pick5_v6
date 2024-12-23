import React from 'react';
import { motion } from 'framer-motion';
import { FastForward } from 'lucide-react';

interface SimulateAuctionButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const SimulateAuctionButton: React.FC<SimulateAuctionButtonProps> = ({ onClick, disabled }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`fixed bottom-32 left-1/2 -translate-x-1/2 px-8 py-4 rounded-xl font-semibold flex items-center space-x-3 ${
        disabled
          ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
          : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg'
      }`}
    >
      <FastForward className="h-6 w-6" />
      <span>Simulate Rest of Auction</span>
    </motion.button>
  );
};

export default SimulateAuctionButton;