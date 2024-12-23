import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ArrowLeft, Calendar, Users, Trophy, AlertCircle } from 'lucide-react';
import LoadingSpinner from '../../components/LoadingSpinner';
import { format } from 'date-fns';

interface MatchPrediction {
  userId: string;
  userEmail: string;
  selectedPlayers: string[];
  createdAt: string;
  status: string;
}

interface MatchDetails {
  team1: string;
  team2: string;
  description?: string;
  timestamp: Date;
  venue: string;
}

const MatchPredictions = () => {
  const [matches, setMatches] = useState<(MatchDetails & { id: string })[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<MatchPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playerNames, setPlayerNames] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const matchesRef = collection(db, 'matches');
      const snapshot = await getDocs(matchesRef);
      const matchesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate()
      })) as (MatchDetails & { id: string })[];

      setMatches(matchesData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
      if (matchesData.length > 0) {
        setSelectedMatch(matchesData[0].id);
        await fetchPredictions(matchesData[0].id);
      }
    } catch (err) {
      setError('Error fetching matches');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlayerName = async (playerId: string) => {
    if (playerNames[playerId]) return playerNames[playerId];

    try {
      const playerDoc = await getDoc(doc(db, 'players', playerId));
      if (playerDoc.exists()) {
        const name = playerDoc.data().name;
        setPlayerNames(prev => ({ ...prev, [playerId]: name }));
        return name;
      }
      return playerId;
    } catch (error) {
      console.error('Error fetching player name:', error);
      return playerId;
    }
  };

  const fetchPredictions = async (matchId: string) => {
    try {
      setLoading(true);
      setError(null);

      const predictionsRef = collection(db, 'predictions');
      const predictionsQuery = query(predictionsRef, where('matchId', '==', matchId));
      const snapshot = await getDocs(predictionsQuery);
      
      const predictionsData = snapshot.docs.map(doc => ({
        ...doc.data()
      })) as MatchPrediction[];

      // Fetch player names for all predictions
      for (const prediction of predictionsData) {
        await Promise.all(prediction.selectedPlayers.map(fetchPlayerName));
      }

      setPredictions(predictionsData);
      setSelectedMatch(matchId);
    } catch (err) {
      setError('Error fetching predictions');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectedMatchDetails = selectedMatch ? matches.find(m => m.id === selectedMatch) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/admin"
          className="inline-flex items-center text-purple-200 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Admin Dashboard
        </Link>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-2xl font-bold text-white">Match Predictions</h1>
            
            <select
              value={selectedMatch || ''}
              onChange={(e) => fetchPredictions(e.target.value)}
              className="w-full sm:w-auto bg-white/10 border border-purple-500/20 rounded-lg px-4 py-2 text-white"
            >
              {matches.map(match => (
                <option key={match.id} value={match.id}>
                  {match.description || `${match.team1} vs ${match.team2}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        ) : selectedMatchDetails ? (
          <div>
            {/* Match Details */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 mb-6">
              <div className="flex items-center space-x-4">
                <Trophy className="h-8 w-8 text-yellow-400" />
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {selectedMatchDetails.team1} vs {selectedMatchDetails.team2}
                  </h2>
                  <div className="flex items-center text-purple-200 mt-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{format(selectedMatchDetails.timestamp, 'PPp')}</span>
                    <span className="mx-2">•</span>
                    <span>{selectedMatchDetails.venue}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Predictions Grid */}
            <div className="grid grid-cols-1 gap-4">
              {predictions.length > 0 ? (
                predictions.map((prediction, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-white">{prediction.userEmail}</h3>
                        <p className="text-sm text-purple-200">
                          Predicted: {new Date(prediction.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-purple-500/20 px-3 py-1 rounded-full">
                        <span className="text-purple-200 text-sm">{prediction.status}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      {prediction.selectedPlayers.map((playerId, idx) => (
                        <div
                          key={idx}
                          className="bg-white/5 rounded-lg p-3 text-center"
                        >
                          <span className="text-white text-sm">
                            {playerNames[playerId] || 'Loading...'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20 text-center">
                  <Users className="h-12 w-12 text-purple-400 mx-auto mb-3" />
                  <p className="text-lg text-white">No predictions found for this match</p>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default MatchPredictions;