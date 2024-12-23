import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FastForward, AlertCircle, DollarSign, Timer } from 'lucide-react';

interface FastForwardModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  predictedWinner: {
    team: string;
    amount: number;
  };
}

const FastForwardModal: React.FC<FastForwardModalProps> = ({
  onConfirm,
  onCancel,
  predictedWinner,
}) => {
  const [simulatedBids, setSimulatedBids] = useState<Array<{ team: string; amount: number }>>([]);
  const [isSimulating, setIsSimulating] = useState(true);
  const [decisionTimer, setDecisionTimer] = useState(5); // Reduced from 10 to 5 seconds

  useEffect(() => {
    // Simulate bidding process
    const bids = [];
    let currentAmount = predictedWinner.amount * 0.7;
    
    while (currentAmount < predictedWinner.amount) {
      currentAmount += Math.random() * 2000000 + 1000000;
      bids.push({
        team: ['Mumbai Indians', 'Chennai Super Kings', 'Royal Challengers Bangalore'][Math.floor(Math.random() * 3)],
        amount: currentAmount
      });
    }
    
    bids.push(predictedWinner);
    
    // Faster animation - show bids every 100ms
    let index = 0;
    const interval = setInterval(() => {
      setSimulatedBids(bids.slice(0, index + 1));
      index++;
      
      if (index >= bids.length) {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 100); // Reduced from 200ms to 100ms

    return () => clearInterval(interval);
  }, [predictedWinner]);

  // Start timer after simulation
  useEffect(() => {
    if (!isSimulating && decisionTimer > 0) {
      const timer = setInterval(() => {
        setDecisionTimer(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (decisionTimer === 0) {
      onCancel(); // Auto-pass when timer runs out
    }
  }, [isSimulating, decisionTimer, onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 rounded-xl p-6 max-w-md w-full border border-purple-500/20"
      >
        {isSimulating ? (
          <>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <FastForward className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Quick Simulation</h3>
                <p className="text-purple-200">Teams are bidding...</p>
              </div>
            </div>

            <div className="bg-black/30 rounded-lg p-4 mb-6 max-h-60 overflow-y-auto">
              {simulatedBids.map((bid, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between py-2 border-b border-purple-500/10 last:border-0"
                >
                  <span className="text-white">{bid.team}</span>
                  <div className="flex items-center text-green-400">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span>₹{(bid.amount / 10000000).toFixed(1)}Cr</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <Timer className="h-6 w-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Final Decision</h3>
                  <p className="text-purple-200">{decisionTimer}s remaining</p>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center text-2xl font-bold text-white">
                {decisionTimer}
              </div>
            </div>

            <div className="bg-yellow-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <span className="text-yellow-400 font-semibold">Current Highest Bid</span>
              </div>
              <div className="flex items-center justify-between text-white">
                <span>{predictedWinner.team}</span>
                <div className="flex items-center text-green-400">
                  <DollarSign className="h-5 w-5 mr-1" />
                  <span className="text-lg font-bold">
                    ₹{(predictedWinner.amount / 10000000).toFixed(1)}Cr
                  </span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCancel}
                className="flex-1 py-3 rounded-lg bg-red-500/20 text-red-400 font-semibold hover:bg-red-500/30 transition-colors"
              >
                Pass
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onConfirm}
                className="flex-1 py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:from-green-600 hover:to-emerald-700 transition-colors"
              >
                Buy Now
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default FastForwardModal;