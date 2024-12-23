import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

interface BiddingControlsProps {
  currentBid: number;
  onBid: (amount: number) => void;
  disabled: boolean;
  userBudget: number;
  isFinalBid?: boolean;
  onBuy?: () => void;
}

const BiddingControls: React.FC<BiddingControlsProps> = ({
  currentBid,
  isFinalBid = false,
  userBudget,
  onBuy
}) => {
  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/70 backdrop-blur-lg rounded-xl p-4 border border-purple-500/20 flex items-center space-x-4"
      >
        <div className="text-center">
          <p className="text-purple-200 text-sm mb-1">
            {isFinalBid ? 'Final Price' : 'Current Bid'}
          </p>
          <div className="text-white font-bold text-xl">
            ₹{(currentBid / 10000000).toFixed(1)}Cr
          </div>
        </div>

        {isFinalBid && onBuy && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBuy}
            disabled={userBudget < currentBid}
            className={`px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 ${
              userBudget >= currentBid
                ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:from-yellow-600 hover:to-orange-700'
                : 'bg-gray-500/50 text-gray-300 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="h-5 w-5" />
            <span>Buy Now</span>
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default BiddingControls;