import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Search, Filter, Heart, Loader } from 'lucide-react';
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useAuctionStore } from '../../store/auctionStore';

interface PlayerSelectionScreenProps {
  onComplete: () => void;
  teamName: string;
}

const PlayerSelectionScreen: React.FC<PlayerSelectionScreenProps> = ({
  onComplete,
  teamName,
}) => {
  const { user } = useAuth();
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const mockDoc = await getDoc(doc(db, 'userMocks', user.uid));
        if (mockDoc.exists()) {
          const mockData = mockDoc.data();
          setPlayers(mockData.players || []);
        }
      } catch (error) {
        console.error('Error fetching players:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [user]);

  const handleComplete = async () => {
    if (!user) return;

    try {
      const mockDoc = await getDoc(doc(db, 'userMocks', user.uid));
      if (mockDoc.exists()) {
        const mockData = mockDoc.data();
        const updatedPlayers = mockData.players.map((player: any) => ({
          ...player,
          isInterested: selectedPlayers.includes(player.id)
        }));

        await setDoc(doc(db, 'userMocks', user.uid), {
          ...mockData,
          players: updatedPlayers
        });

        onComplete();
      }
    } catch (error) {
      console.error('Error updating user mock data:', error);
    }
  };

  const togglePlayerSelection = (playerId: string) => {
    setSelectedPlayers(prev => 
      prev.includes(playerId) 
        ? prev.filter(id => id !== playerId)
        : [...prev, playerId]
    );
  };

  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || player.type === filterType;
    const matchesRole = filterRole === 'all' || player.role === filterRole;
    return matchesSearch && matchesType && matchesRole;
  });

  const uniqueRoles = Array.from(new Set(players.map(p => p.role)));
  const types = ['India', 'Overseas', 'Uncapped'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader className="h-8 w-8 text-purple-400 animate-spin mb-4" />
          <p className="text-purple-200">Loading players...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Select Players of Interest</h2>
            <p className="text-purple-200">
              {teamName} • {selectedPlayers.length} players selected
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleComplete}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center space-x-2"
          >
            <span>Start Auction</span>
            <Star className="h-5 w-5" />
          </motion.button>
        </div>

        {/* Filters */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-8 border border-purple-500/20">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-300" />
              <input
                type="text"
                placeholder="Search players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/10 border border-purple-500/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-purple-300"
              />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-300" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full bg-white/10 border border-purple-500/20 rounded-lg pl-10 pr-4 py-2 text-white"
              >
                <option value="all">All Types</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Role Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-300" />
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full bg-white/10 border border-purple-500/20 rounded-lg pl-10 pr-4 py-2 text-white"
              >
                <option value="all">All Roles</option>
                {uniqueRoles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPlayers.map((player) => (
            <motion.div
              key={player.id}
              whileHover={{ scale: 1.02 }}
              className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 border transition-all duration-300 cursor-pointer
                ${selectedPlayers.includes(player.id) 
                  ? 'border-pink-500/50 bg-white/20' 
                  : 'border-purple-500/20 hover:bg-white/20'}`}
              onClick={() => togglePlayerSelection(player.id)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{player.name}</h3>
                  <p className="text-sm text-purple-200">{player.role}</p>
                </div>
                <Heart 
                  className={`h-6 w-6 transition-colors ${
                    selectedPlayers.includes(player.id) 
                      ? 'text-pink-500 fill-pink-500' 
                      : 'text-purple-300'
                  }`} 
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-200">Base Price</span>
                  <span className="text-white">₹{(player.basePrice / 10000000).toFixed(1)}Cr</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-purple-200">Type</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    player.type === 'Overseas' 
                      ? 'bg-yellow-500/20 text-yellow-200'
                      : player.type === 'India'
                      ? 'bg-green-500/20 text-green-200'
                      : 'bg-blue-500/20 text-blue-200'
                  }`}>
                    {player.type}
                  </span>
                </div>

                {player.specialization && (
                  <div className="text-sm text-purple-200">
                    {player.specialization}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerSelectionScreen;