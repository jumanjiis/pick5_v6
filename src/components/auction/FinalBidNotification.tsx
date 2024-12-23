import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, DollarSign, ShoppingCart } from 'lucide-react';

interface FinalBidNotificationProps {
  player: {
    name: string;
    role: string;
  };
  currentBid: number;
  currentBidder: string;
  onPlaceBid: () => void;
  onPass: () => void;
}

const FinalBidNotification: React.FC<FinalBidNotificationProps> = ({
  player,
  currentBid,
  currentBidder,
  onPlaceBid: buyPlayer,
  onPass
}) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 rounded-xl p-6 max-w-md w-full border border-purple-500/20"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-yellow-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Player of Interest!</h3>
            <p className="text-purple-200">{player.name} is up for auction</p>
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-purple-200">Current Price</span>
            <div className="flex items-center text-green-400">
              <DollarSign className="h-5 w-5 mr-1" />
              <span className="text-lg font-bold">₹{(currentBid / 10000000).toFixed(1)}Cr</span>
            </div>
          </div>
          <p className="text-sm text-purple-200">Last Bidder: {currentBidder}</p>
        </div>

        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onPass}
            className="flex-1 py-3 rounded-lg bg-red-500/20 text-red-400 font-semibold hover:bg-red-500/30 transition-colors"
          >
            Pass
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={buyPlayer}
            className="flex-1 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:from-green-600 hover:to-emerald-700 transition-colors flex items-center justify-center"
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Buy Player
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default FinalBidNotification;