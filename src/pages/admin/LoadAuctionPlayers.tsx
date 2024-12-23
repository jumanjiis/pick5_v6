import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import { initializeAuctionPlayers } from '../../data/auctionPlayers';

const LoadAuctionPlayers = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoadPlayers = async () => {
    if (!window.confirm('Are you sure you want to load all players into the database? This will overwrite any existing data.')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await initializeAuctionPlayers();
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/admin"
          className="inline-flex items-center text-purple-200 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Admin Dashboard
        </Link>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
          <h1 className="text-2xl font-bold text-white mb-6">Load Auction Players</h1>

          <div className="space-y-6">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
              <p className="text-yellow-200">
                This action will load all predefined auction players into the database. 
                Any existing player data will be overwritten.
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-200">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <p className="text-green-200">
                  Players successfully loaded into the database!
                </p>
              </div>
            )}

            <button
              onClick={handleLoadPlayers}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
            >
              <Upload className="h-5 w-5 mr-2" />
              {loading ? 'Loading Players...' : 'Load Players into Database'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadAuctionPlayers;