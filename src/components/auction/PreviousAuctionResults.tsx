import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, ArrowLeft, AlertCircle, ChevronRight, Star, Users, DollarSign } from 'lucide-react';
import { getAuctionResults } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../LoadingSpinner';
import type { Team } from './types';

interface PreviousAuctionResultsProps {
  onBack: () => void;
}

const PreviousAuctionResults: React.FC<PreviousAuctionResultsProps> = ({ onBack }) => {
  const { user } = useAuth();
  const [results, setResults] = useState<Record<string, Team> | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const data = await getAuctionResults(user.uid);
        setResults(data);
        if (data) {
          setSelectedTeamId(Object.keys(data)[0]);
        }
      } catch (error) {
        console.error('Error fetching auction results:', error);
        setResults(null);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [user]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!results || Object.keys(results).length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center text-purple-200 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Selection
          </button>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20 text-center">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">No Previous Results</h2>
            <p className="text-purple-200">
              You haven't completed any mock auctions yet. Start a new auction to build your dream team!
            </p>
            <button
              onClick={onBack}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
            >
              Start New Auction
            </button>
          </div>
        </div>
      </div>
    );
  }

  const selectedTeam = selectedTeamId ? results[selectedTeamId] : null;
  if (!selectedTeam) return null;

  const getPlayersByRole = (players: any[], role: string) => {
    return players
      .filter(p => {
        if (role === 'BATTER/WK') {
          return p.role === 'BATTER' || p.role === 'WICKETKEEPER';
        }
        return p.role === role;
      })
      .sort((a, b) => {
        // Sort by new acquisitions first
        if (a.isNewBuy && !b.isNewBuy) return -1;
        if (!a.isNewBuy && b.isNewBuy) return 1;
        // Then by price (if available)
        if (a.price && b.price) return b.price - a.price;
        if (a.price) return -1;
        if (b.price) return 1;
        // Finally by name
        return a.name.localeCompare(b.name);
      });
  };

  const roleCategories = [
    {
      title: 'Batters & Wicket-keepers',
      role: 'BATTER/WK',
      icon: <Star className="h-5 w-5 text-yellow-400" />
    },
    {
      title: 'All-rounders',
      role: 'ALL-ROUNDER',
      icon: <Trophy className="h-5 w-5 text-purple-400" />
    },
    {
      title: 'Bowlers',
      role: 'BOWLER',
      icon: <Users className="h-5 w-5 text-blue-400" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center text-purple-200 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Selection
        </button>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/20">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className={`w-16 h-16 bg-gradient-to-r ${selectedTeam.color} rounded-xl flex items-center justify-center`}>
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">{selectedTeam.name}</h2>
                <p className="text-purple-200">IPL 2024 Squad</p>
              </div>
            </div>
          </div>

          {/* Team Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-center space-x-3 mb-2">
                <Users className="h-6 w-6 text-purple-400" />
                <h3 className="text-xl font-semibold text-white">Squad Size</h3>
              </div>
              <p className="text-3xl font-bold text-white">{selectedTeam.currentPlayers.length}/25</p>
              <div className="mt-2 text-sm text-purple-200">
                Overseas: {selectedTeam.currentPlayers.filter(p => p.type === 'Overseas').length}/8
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
              <div className="flex items-center space-x-3 mb-2">
                <DollarSign className="h-6 w-6 text-green-400" />
                <h3 className="text-xl font-semibold text-white">Remaining Budget</h3>
              </div>
              <p className="text-3xl font-bold text-white">₹{(selectedTeam.budget / 10000000).toFixed(1)}Cr</p>
            </div>
          </div>

          {/* Squad Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {roleCategories.map(({ title, role, icon }) => {
              const players = getPlayersByRole(selectedTeam.currentPlayers, role);
              return (
                <div key={role} className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
                  <div className="flex items-center space-x-2 mb-4">
                    {icon}
                    <h3 className="text-xl font-semibold text-white">{title}</h3>
                    <span className="ml-auto bg-white/20 px-2 py-1 rounded-full text-sm text-purple-200">
                      {players.length}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {players.map((player, index) => (
                      <div
                        key={index}
                        className={`${
                          player.isNewBuy
                            ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
                            : 'bg-white/5'
                        } rounded-lg p-4 border border-purple-500/20 transition-all duration-300 hover:bg-white/10`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-white flex items-center">
                              {player.name}
                              {player.isNewBuy && (
                                <Star className="h-4 w-4 ml-2 text-yellow-400" />
                              )}
                            </h4>
                            <p className="text-sm text-purple-200">{player.type}</p>
                          </div>
                          {player.price && (
                            <span className="text-green-400 text-sm font-semibold">
                              ₹{(player.price / 10000000).toFixed(1)}Cr
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Team Selector */}
          <div className="mt-8 flex flex-wrap gap-2">
            {Object.entries(results).map(([id, team]) => (
              <button
                key={id}
                onClick={() => setSelectedTeamId(id)}
                className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                  selectedTeamId === id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'bg-white/10 text-purple-200 hover:bg-white/20'
                }`}
              >
                <span>{team.name}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviousAuctionResults;