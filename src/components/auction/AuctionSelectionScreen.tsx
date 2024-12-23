import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Eye, Trophy, ArrowRight } from 'lucide-react';

type AuctionMode = 'selection' | 'new' | 'view';

interface AuctionSelectionScreenProps {
  onSelect: (mode: AuctionMode) => void;
}

const AuctionSelectionScreen: React.FC<AuctionSelectionScreenProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Trophy className="h-12 w-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-white font-bold animate-bounce">
              24
            </div>
          </div>
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 mb-4">
            IPL Auction 2024
          </h1>
          <p className="text-xl text-purple-200">Choose your auction experience</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('new')}
            className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-left hover:border-green-500/30 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
            
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 mb-4">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">New Mock Auction</h3>
              <p className="text-purple-200">Start a fresh auction simulation with all teams and players</p>
              
              <div className="mt-4 inline-flex items-center text-green-400">
                <span>Start Auction</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect('view')}
            className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-left hover:border-blue-500/30 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
            
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 mb-4">
                <Eye className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">View Previous Results</h3>
              <p className="text-purple-200">Check the results of your last auction simulation</p>
              
              <div className="mt-4 inline-flex items-center text-blue-400">
                <span>View Results</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default AuctionSelectionScreen;