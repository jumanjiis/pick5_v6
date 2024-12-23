import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';

interface LiveTickerProps {
  messages: string[];
}

const LiveTicker: React.FC<LiveTickerProps> = ({ messages }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm h-16 border-t border-purple-500/20 z-10">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
        <div className="flex items-center h-full">
          <div className="bg-red-500 px-4 h-full flex items-center text-white font-bold">
            LIVE
          </div>
          <div className="overflow-hidden flex-1 ml-4">
            <motion.div 
              className="space-y-1"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              {messages.slice(0, 2).map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center text-white"
                >
                  <DollarSign className="h-4 w-4 mr-2 text-yellow-400" />
                  {message}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTicker;