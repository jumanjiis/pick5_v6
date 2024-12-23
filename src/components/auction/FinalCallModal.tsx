import React from 'react';
import { motion } from 'framer-motion';
import { Gavel, AlertCircle } from 'lucide-react';

interface FinalCallModalProps {
  player: {
    name: string;
    role: string;
  };
  currentBid: number;
  currentBidder: string;
  nextBidAmount: number;
  onResponse: (willBid: boolean) => void;
}

const FinalCallModal: React.FC<FinalCallModalProps> = ({
  player,
  currentBid,
  currentBidder,
  nextBidAmount,
  onResponse,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 max-w-md w-full border border-purple-500/20"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
            <Gavel className="h-6 w-6 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Final Call!</h3>
            <p className="text-purple-200">Last chance to bid on {player.name}</p>
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            <span className="text-yellow-400 font-semibold">Current Status</span>
          </div>
          <p className="text-white mb-2">
            Highest Bid: ₹{(currentBid / 10000000).toFixed(1)}Cr by {currentBidder}
          </p>
          <p className="text-white">
            Next Bid Amount: ₹{(nextBidAmount / 10000000).toFixed(1)}Cr
          </p>
        </div>

        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onResponse(false)}
            className="flex-1 py-3 rounded-lg bg-red-500/20 text-red-400 font-semibold hover:bg-red-500/30 transition-colors"
          >
            Pass
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onResponse(true)}
            className="flex-1 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:from-green-600 hover:to-emerald-700 transition-colors"
          >
            Place Bid
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default FinalCallModal;