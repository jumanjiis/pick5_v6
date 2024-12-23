import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, DollarSign, Users, Clock } from 'lucide-react';

interface AuctionRulesProps {
  onClose: () => void;
}

const AuctionRules: React.FC<AuctionRulesProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 rounded-xl p-6 max-w-2xl w-full border border-purple-500/20"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">IPL Auction Rules</h2>
        </div>

        <div className="space-y-6">
          <RuleSection
            icon={<DollarSign className="h-6 w-6 text-green-400" />}
            title="Bidding Rules"
            rules={[
              "Minimum bid increment is ₹1.0 Cr",
              "Base price is set for each player",
              "Teams can't exceed their total budget",
              "10 seconds to decide on final bids"
            ]}
          />

          <RuleSection
            icon={<Users className="h-6 w-6 text-blue-400" />}
            title="Squad Composition"
            rules={[
              "Maximum 25 players per squad",
              "Minimum 8 overseas players",
              "Maximum 8 overseas players",
              "Minimum 17 Indian players"
            ]}
          />

          <RuleSection
            icon={<Clock className="h-6 w-6 text-purple-400" />}
            title="Auction Process"
            rules={[
              "Each player presented individually",
              "Teams can bid multiple times",
              "Final call before player is sold",
              "Auction ends when all players are sold"
            ]}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold"
        >
          Got it!
        </motion.button>
      </motion.div>
    </div>
  );
};

const RuleSection: React.FC<{
  icon: React.ReactNode;
  title: string;
  rules: string[];
}> = ({ icon, title, rules }) => (
  <div className="bg-white/5 rounded-xl p-4">
    <div className="flex items-center space-x-2 mb-3">
      {icon}
      <h3 className="text-lg font-semibold text-white">{title}</h3>
    </div>
    <ul className="space-y-2">
      {rules.map((rule, index) => (
        <li key={index} className="flex items-center text-purple-200">
          <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2" />
          {rule}
        </li>
      ))}
    </ul>
  </div>
);

export default AuctionRules;