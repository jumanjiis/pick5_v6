import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, DollarSign, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface TeamSelectorProps {
  teams: Record<string, Team>;
  onSelect: (teamId: string) => void;
}

const TeamSelector: React.FC<TeamSelectorProps> = ({ teams, onSelect }) => {
  const { user } = useAuth();

  const handleTeamSelect = async (teamId: string) => {
    if (!user) return;

    try {
      // Fetch all auction players
      const playersSnapshot = await getDocs(collection(db, 'auctionPlayers'));
      const players = playersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Adjust max prices with random factor
      const adjustedPlayers = players.map(player => {
        const randomFactor = 0.7 + Math.random() * 0.6; // Random between 0.7 and 1.3
        return {
          ...player,
          maxExpectedPrice: Math.round(player.maxExpectedPrice * randomFactor)
        };
      });

      // Store in user's mock collection (this will overwrite if document exists)
      await setDoc(doc(db, 'userMocks', user.uid), {
        selectedTeam: teamId,
        players: adjustedPlayers,
        timestamp: new Date(),
        status: 'pending'
      }, { merge: false }); // merge: false ensures complete overwrite

      onSelect(teamId);
    } catch (error) {
      console.error('Error storing auction data:', error);
    }
  };

  const getTeamStats = (team: Team) => {
    const overseasCount = team.currentPlayers.filter(p => p.type === 'Overseas').length;
    const indianCount = team.currentPlayers.filter(p => p.type === 'Indian').length;
    const remainingOverseasSlots = 8 - overseasCount;
    const remainingSquadSlots = 25 - team.currentPlayers.length;

    return {
      overseasCount,
      indianCount,
      remainingOverseasSlots,
      remainingSquadSlots
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
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
          <p className="text-xl text-purple-200">Select your team to begin</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(teams).map(([id, team], index) => {
            const stats = getTeamStats(team);
            
            return (
              <motion.button
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: index * 0.1 }
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTeamSelect(id)}
                className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-left hover:border-purple-500/30 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
                
                <div className="relative">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${team.color} rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300`}>
                      <Star className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold ${team.textColor} group-hover:text-white transition-colors`}>
                        {team.name}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-purple-200">
                        <Users className="h-5 w-5 mr-2" />
                        <span>Squad: {team.currentPlayers.length}/25</span>
                      </div>
                      <div className="flex items-center text-green-400">
                        <DollarSign className="h-5 w-5 mr-1" />
                        <span className="font-semibold">₹{(team.budget / 10000000).toFixed(1)}Cr</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-purple-200">Overseas: {stats.overseasCount}/8</span>
                      <span className="text-purple-200">Indian: {stats.indianCount}</span>
                    </div>

                    {team.neededRoles && team.neededRoles.length > 0 && (
                      <div className="bg-purple-500/20 rounded-lg p-2">
                        <p className="text-purple-200 text-sm">
                          Needs: {team.neededRoles.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg py-2 text-center text-white font-semibold group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-300">
                    Select Team
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TeamSelector;