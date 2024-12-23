import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';
import { useAuctionStore } from '../../store/auctionStore';

const BiddingPanel: React.FC = () => {
  const { currentBid, currentBidder, buyPlayer } = useAuctionStore();

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/70 backdrop-blur-lg rounded-xl p-4 border border-purple-500/20 flex items-center space-x-4"
      >
        <div className="text-center">
          <p className="text-purple-200 text-sm mb-1">Current Bid</p>
          <div className="text-white font-bold text-xl">
            ₹{(currentBid / 10000000).toFixed(1)}Cr
          </div>
          {currentBidder && (
            <p className="text-sm text-purple-200 mt-1">by {currentBidder}</p>
          )}
        </div>

        <button
          onClick={buyPlayer}
          className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center space-x-2"
        >
          <DollarSign className="h-5 w-5" />
          <span>Buy Now</span>
        </button>
      </motion.div>
    </div>
  );
};

export default BiddingPanel;