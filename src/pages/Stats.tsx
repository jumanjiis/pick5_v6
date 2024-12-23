import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BarChart, Calendar, Users, Trophy, TrendingUp, Star, ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { format } from 'date-fns';
import type { Match, Player } from '../types';

interface MatchStats {
  match: Match & { id: string };
  predictionsCount: number;
  uniqueUsers: number;
  averageCorrect: number;
  playerStats: PlayerStats[];
}

interface PlayerStats {
  player: Player;
  selectionCount: number;
  selectionPercentage: number;
  successCount: number;
  successRate: number;
}

const Stats = () => {
  const [loading, setLoading] = useState(true);
  const [matchStats, setMatchStats] = useState<MatchStats[]>([]);
  const [totalPredictions, setTotalPredictions] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch matches
      const matchesSnapshot = await getDocs(collection(db, 'matches'));
      const matches = matchesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      })) as (Match & { id: string })[];

      // Fetch all players once
      const playersSnapshot = await getDocs(collection(db, 'players'));
      const playersMap = new Map(
        playersSnapshot.docs.map(doc => [
          doc.id,
          { id: doc.id, ...doc.data() } as Player
        ])
      );

      // Fetch predictions for each match
      const stats = await Promise.all(
        matches.map(async (match) => {
          const predictionsQuery = query(
            collection(db, 'predictions'),
            where('matchId', '==', match.id)
          );
          const predictionsSnapshot = await getDocs(predictionsQuery);
          const predictions = predictionsSnapshot.docs.map(doc => doc.data());
          
          // Calculate unique users
          const uniqueUsers = new Set(predictions.map(p => p.userId)).size;
          
          // Calculate player stats
          const playerStatsMap = new Map<string, { selections: number; successes: number }>();
          
          predictions.forEach(pred => {
            (pred.selectedPlayers || []).forEach((playerId: string) => {
              const current = playerStatsMap.get(playerId) || { selections: 0, successes: 0 };
              current.selections++;
              
              const player = playersMap.get(playerId);
              if (player?.matchTargets?.[match.id]) {
                const target = player.matchTargets[match.id];
                if (target.actualPoints !== undefined && target.actualPoints >= target.target) {
                  current.successes++;
                }
              }
              
              playerStatsMap.set(playerId, current);
            });
          });

          // Convert player stats map to array
          const playerStats = Array.from(playerStatsMap.entries()).map(([playerId, stats]) => {
            const player = playersMap.get(playerId);
            if (!player) return null;
            
            return {
              player,
              selectionCount: stats.selections,
              selectionPercentage: (stats.selections / predictions.length) * 100,
              successCount: stats.successes,
              successRate: stats.selections > 0 ? (stats.successes / stats.selections) * 100 : 0
            };
          })
          .filter((stat): stat is PlayerStats => stat !== null)
          .sort((a, b) => b.selectionPercentage - a.selectionPercentage);

          // Calculate average correct predictions
          const totalCorrect = predictions.reduce((acc, pred) => {
            const correctCount = (pred.selectedPlayers || []).reduce((count: number, playerId: string) => {
              const player = playersMap.get(playerId);
              if (!player?.matchTargets?.[match.id]) return count;
              const target = player.matchTargets[match.id];
              if (target.actualPoints !== undefined && target.actualPoints >= target.target) {
                return count + 1;
              }
              return count;
            }, 0);
            return acc + correctCount;
          }, 0);

          const averageCorrect = predictions.length > 0 
            ? (totalCorrect / (predictions.length * 5)) * 100 
            : 0;

          return {
            match,
            predictionsCount: predictions.length,
            uniqueUsers,
            averageCorrect,
            playerStats
          };
        })
      );

      // Calculate totals
      const totalPreds = stats.reduce((acc, stat) => acc + stat.predictionsCount, 0);
      const uniqueUserSet = new Set(
        stats.flatMap(stat => Array(stat.uniqueUsers).fill(null))
      );

      setMatchStats(stats.sort((a, b) => b.match.timestamp.getTime() - a.match.timestamp.getTime()));
      setTotalPredictions(totalPreds);
      setTotalUsers(uniqueUserSet.size);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  const selectedMatchStats = selectedMatch 
    ? matchStats.find(stat => stat.match.id === selectedMatch)
    : null;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Trophy className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-purple-200">Total Predictions</p>
                <h3 className="text-2xl font-bold text-white">{totalPredictions}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-pink-400" />
              </div>
              <div>
                <p className="text-purple-200">Total Users</p>
                <h3 className="text-2xl font-bold text-white">{totalUsers}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <BarChart className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-purple-200">Avg. Predictions/Match</p>
                <h3 className="text-2xl font-bold text-white">
                  {matchStats.length > 0 
                    ? Math.round(totalPredictions / matchStats.length) 
                    : 0}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {selectedMatchStats ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-purple-500/20 overflow-hidden">
            <div className="p-6">
              <button
                onClick={() => setSelectedMatch(null)}
                className="flex items-center text-purple-200 hover:text-white mb-4 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to All Matches
              </button>
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {selectedMatchStats.match.team1} vs {selectedMatchStats.match.team2}
                  </h2>
                  <p className="text-purple-200 flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    {format(selectedMatchStats.match.timestamp, 'PPp')}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="px-4 py-2 bg-purple-500/20 rounded-lg">
                    <p className="text-sm text-purple-200">Total Predictions</p>
                    <p className="text-lg font-bold text-white">{selectedMatchStats.predictionsCount}</p>
                  </div>
                  <div className="px-4 py-2 bg-green-500/20 rounded-lg">
                    <p className="text-sm text-green-200">Success Rate</p>
                    <p className="text-lg font-bold text-white">{selectedMatchStats.averageCorrect.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">Player</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-purple-200">Selection %</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-purple-200">Times Selected</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-purple-200">Success Rate</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">Target</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-500/10">
                  {selectedMatchStats.playerStats.map((stat, index) => (
                    <tr 
                      key={stat.player.id}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                            <Star className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-white">{stat.player.name}</p>
                            <p className="text-sm text-purple-200">{stat.player.team}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <div className="w-full max-w-[100px] bg-purple-500/20 rounded-full h-2 mr-2">
                            <div 
                              className="bg-purple-500 h-2 rounded-full"
                              style={{ width: `${stat.selectionPercentage}%` }}
                            />
                          </div>
                          <span className="text-purple-200">{stat.selectionPercentage.toFixed(1)}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-500/20 text-pink-200">
                          {stat.selectionCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          stat.successRate >= 60
                            ? 'bg-green-500/20 text-green-200'
                            : stat.successRate >= 40
                            ? 'bg-yellow-500/20 text-yellow-200'
                            : 'bg-red-500/20 text-red-200'
                        }`}>
                          {stat.successRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-purple-200">
                          {stat.player.matchTargets?.[selectedMatchStats.match.id]?.target || 0}{' '}
                          {stat.player.matchTargets?.[selectedMatchStats.match.id]?.type}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Match Stats Table */
          <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-purple-500/20 overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                <TrendingUp className="h-6 w-6 mr-2 text-purple-400" />
                Match Statistics
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">Match</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-purple-200">Date</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-purple-200">Predictions</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-purple-200">Unique Users</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-purple-200">Avg. Success Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-500/10">
                  {matchStats.map((stat, index) => (
                    <tr 
                      key={stat.match.id}
                      className="hover:bg-white/5 transition-colors cursor-pointer"
                      onClick={() => setSelectedMatch(stat.match.id)}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-white">
                            {stat.match.team1} vs {stat.match.team2}
                          </p>
                          <p className="text-sm text-purple-200">{stat.match.venue}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-purple-200">
                          <Calendar className="h-4 w-4 mr-2" />
                          {format(stat.match.timestamp, 'PPp')}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-500/20 text-purple-200">
                          {stat.predictionsCount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-pink-500/20 text-pink-200">
                          {stat.uniqueUsers}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          stat.averageCorrect >= 60
                            ? 'bg-green-500/20 text-green-200'
                            : stat.averageCorrect >= 40
                            ? 'bg-yellow-500/20 text-yellow-200'
                            : 'bg-red-500/20 text-red-200'
                        }`}>
                          {stat.averageCorrect.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stats;