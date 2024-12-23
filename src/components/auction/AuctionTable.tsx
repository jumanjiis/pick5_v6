import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

interface Team {
  id: string;
  name: string;
  color: string;
  textColor: string;
  budget: number;
}

interface AuctionTableProps {
  teams: Team[];
  currentBidder?: string;
  selectedTeam?: string;
  onSelectTeam?: (team: Team) => void;
}

const AuctionTable: React.FC<AuctionTableProps> = ({ teams, currentBidder, selectedTeam, onSelectTeam }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {teams.map((team) => (
        <motion.div
          key={team.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => onSelectTeam && onSelectTeam(team)}
          className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 border-2 transition-all duration-300 cursor-pointer hover:bg-white/20 ${
            currentBidder === team.name
              ? 'border-green-500/50 scale-105'
              : team.id === selectedTeam
              ? 'border-yellow-500/50'
              : 'border-transparent'
          }`}
        >
          <div className="flex flex-col items-center text-center">
            <div className={`w-20 h-20 bg-gradient-to-r ${team.color} rounded-full flex items-center justify-center mb-4`}>
              <Users className={`h-10 w-10 ${team.id === selectedTeam ? 'text-yellow-400' : 'text-white'}`} />
            </div>
            <h3 className={`text-xl font-bold mb-2 ${team.textColor}`}>{team.name}</h3>
            <div className="flex items-center text-base text-purple-200">
              <span>₹{(team.budget / 10000000).toFixed(1)}Cr</span>
            </div>
            {currentBidder === team.name && (
              <div className="mt-3 bg-green-500/20 px-4 py-2 rounded-full">
                <span className="text-green-400">Current Bidder</span>
              </div>
            )}
            {!selectedTeam && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
              >
                Select Team
              </motion.button>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default AuctionTable;