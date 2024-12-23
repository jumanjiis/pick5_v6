import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface WarningModalProps {
  team: string;
  player: string;
  onClose: () => void;
  onPlaceBid: () => void;
}

const WarningModal: React.FC<WarningModalProps> = ({ team, player, onClose, onPlaceBid }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-br from-red-900/90 to-orange-900/90 rounded-xl p-6 max-w-md w-full border border-red-500/20"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Warning!</h3>
            <p className="text-red-200">{team} is likely to buy {player}</p>
          </div>
        </div>

        <p className="text-white mb-6">
          Would you like to place a bid before they secure the player?
        </p>

        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="flex-1 py-3 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors"
          >
            Skip
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPlaceBid}
            className="flex-1 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:from-green-600 hover:to-emerald-700 transition-colors"
          >
            Place Bid
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default WarningModal;