import React from 'react';
import { motion } from 'framer-motion';
import { FastForward } from 'lucide-react';

interface SkipButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

const SkipButton: React.FC<SkipButtonProps> = ({ onClick, disabled }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`fixed bottom-32 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 ${
        disabled
          ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
          : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600'
      }`}
    >
      <FastForward className="h-5 w-5" />
      <span>Skip to Final Bid</span>
    </motion.button>
  );
};

export default SkipButton;