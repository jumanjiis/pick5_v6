import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gavel, Timer } from 'lucide-react';

interface FinalBidModalProps {
  player: {
    name: string;
    role: string;
  };
  currentBid: number;
  currentBidder: string;
  userBudget: number;
  onBuy: () => void;
  onPass: () => void;
}

const FinalBidModal: React.FC<FinalBidModalProps> = ({
  player,
  currentBid,
  currentBidder,
  userBudget,
  onBuy,
  onPass
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleBuy = () => {
    if (userBudget < currentBid || isProcessing) return;
    setIsProcessing(true);
    onBuy();
  };

  const handlePass = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    onPass();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" data-final-bid-modal>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 rounded-xl p-6 max-w-md w-full border border-purple-500/20"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <Gavel className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{player.name}</h3>
              <p className="text-purple-200">{player.role}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-4 mb-6">
          <div className="text-center">
            <p className="text-purple-200 mb-2">Current Highest Bid</p>
            <div className="flex items-center justify-center text-3xl font-bold text-white">
              <span>₹{(currentBid / 10000000).toFixed(1)}Cr</span>
            </div>
            <p className="text-sm text-purple-200 mt-2">by {currentBidder}</p>
          </div>
        </div>

        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBuy}
            disabled={userBudget < currentBid || isProcessing}
            className={`w-full py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 ${
              userBudget >= currentBid && !isProcessing
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                : 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
            }`}
          >
            <span>
              {isProcessing ? 'Processing...' : `Buy for ₹${(currentBid / 10000000).toFixed(1)}Cr`}
            </span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePass}
            disabled={isProcessing}
            className={`w-full py-3 rounded-lg font-semibold ${
              isProcessing
                ? 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
                : 'bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors'
            }`}
          >
            {isProcessing ? 'Processing...' : 'Pass'}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default FinalBidModal;