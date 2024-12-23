import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Save, ArrowLeft, DollarSign, Filter, Trash2 } from 'lucide-react';
import { initializeAuctionPlayers } from '../../data/auctionPlayers';

const AuctionAdmin = () => {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSet, setFilterSet] = useState<string>('all');
  const [initializing, setInitializing] = useState(false);
  const [editedPrices, setEditedPrices] = useState<Record<string, {
    base: number;
    min: number;
    max: number;
  }>>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const playersSnapshot = await getDocs(collection(db, 'auctionPlayers'));
      const playersData = playersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPlayers(playersData);
      
      const initialPrices: Record<string, { base: number; min: number; max: number }> = {};
      playersData.forEach(player => {
        if (player.id) {
          initialPrices[player.id] = {
            base: player.basePrice / 1000000, // Convert to Cr
            min: player.minExpectedPrice / 1000000,
            max: player.maxExpectedPrice / 1000000
          };
        }
      });
      setEditedPrices(initialPrices);
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInitializePlayers = async () => {
    try {
      setInitializing(true);
      await initializeAuctionPlayers();
      await fetchPlayers();
    } catch (error) {
      console.error('Error initializing players:', error);
    } finally {
      setInitializing(false);
    }
  };

  const handlePriceChange = (playerId: string, type: 'base' | 'min' | 'max', value: string) => {
    const numValue = parseFloat(value);
    setEditedPrices(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [type]: numValue
      }
    }));
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      await Promise.all(
        Object.entries(editedPrices).map(([playerId, prices]) => 
          updateDoc(doc(db, 'auctionPlayers', playerId), {
            basePrice: prices.base * 1000000,
            minExpectedPrice: prices.min * 1000000,
            maxExpectedPrice: prices.max * 1000000
          })
        )
      );
      await fetchPlayers();
    } catch (error) {
      console.error('Error saving prices:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAllPlayers = async () => {
    if (!window.confirm('Are you sure you want to delete all players? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(true);
      const playersSnapshot = await getDocs(collection(db, 'auctionPlayers'));
      await Promise.all(
        playersSnapshot.docs.map(doc => deleteDoc(doc.ref))
      );
      setPlayers([]);
      setEditedPrices({});
    } catch (error) {
      console.error('Error deleting players:', error);
    } finally {
      setDeleting(false);
    }
  };

  const filteredPlayers = players
    .filter(player => filterType === 'all' || player.type === filterType)
    .filter(player => filterSet === 'all' || player.set === filterSet);

  const uniqueSets = [...new Set(players.map(player => player.set))].filter(Boolean).sort();

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

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-purple-500/20">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white flex items-center">
              <DollarSign className="h-6 w-6 mr-2 text-pink-400" />
              Price Management
            </h1>

            <div className="flex items-center space-x-4">
              <button
                onClick={handleDeleteAllPlayers}
                disabled={deleting || players.length === 0}
                className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-red-600 hover:to-pink-700 transition-all duration-300 disabled:opacity-50 flex items-center"
              >
                <Trash2 className="h-5 w-5 mr-2" />
                {deleting ? 'Deleting...' : 'Delete All Players'}
              </button>

              <button
                onClick={handleInitializePlayers}
                disabled={initializing}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50"
              >
                {initializing ? 'Initializing...' : 'Initialize Players'}
              </button>

              <button
                onClick={handleSaveAll}
                disabled={saving}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 flex items-center disabled:opacity-50"
              >
                <Save className="h-5 w-5 mr-2" />
                {saving ? 'Saving...' : 'Save All Changes'}
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-purple-200" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-white/10 border border-purple-500/20 rounded-lg px-4 py-2 text-white"
              >
                <option value="all">All Types</option>
                <option value="India">India</option>
                <option value="Overseas">Overseas</option>
                <option value="Uncapped">Uncapped</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-purple-200" />
              <select
                value={filterSet}
                onChange={(e) => setFilterSet(e.target.value)}
                className="bg-white/10 border border-purple-500/20 rounded-lg px-4 py-2 text-white"
              >
                <option value="all">All Sets</option>
                {uniqueSets.map(set => (
                  <option key={set} value={set}>{set}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Grid Header */}
          <div className="grid grid-cols-9 gap-4 mb-4 text-sm font-semibold text-purple-200 px-4">
            <div className="col-span-2">Player</div>
            <div>Type</div>
            <div>Base Price (Cr)</div>
            <div>Start Bid (Cr)</div>
            <div>Max Price (Cr)</div>
            <div>IPL Caps</div>
            <div>Role</div>
            <div>Set</div>
          </div>

          {/* Players Grid */}
          <div className="space-y-2">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
              </div>
            ) : (
              filteredPlayers.map(player => (
                <div 
                  key={player.id}
                  className="grid grid-cols-9 gap-4 bg-white/5 rounded-lg p-4 items-center hover:bg-white/10 transition-colors"
                >
                  <div className="col-span-2">
                    <p className="font-semibold text-white">{player.name}</p>
                    <p className="text-sm text-purple-200">{player.batting}, {player.bowling}</p>
                  </div>
                  
                  <div>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      player.type === 'Overseas' 
                        ? 'bg-yellow-500/20 text-yellow-200'
                        : player.type === 'India'
                        ? 'bg-green-500/20 text-green-200'
                        : 'bg-blue-500/20 text-blue-200'
                    }`}>
                      {player.type}
                    </span>
                  </div>

                  <div>
                    <input
                      type="number"
                      value={editedPrices[player.id]?.base || 0}
                      onChange={(e) => handlePriceChange(player.id, 'base', e.target.value)}
                      className="w-full bg-white/10 border border-purple-500/20 rounded-lg px-3 py-1 text-white"
                      step="0.1"
                      min="0"
                    />
                  </div>

                  <div>
                    <input
                      type="number"
                      value={editedPrices[player.id]?.min || 0}
                      onChange={(e) => handlePriceChange(player.id, 'min', e.target.value)}
                      className="w-full bg-white/10 border border-purple-500/20 rounded-lg px-3 py-1 text-white"
                      step="0.1"
                      min={editedPrices[player.id]?.base || 0}
                    />
                  </div>

                  <div>
                    <input
                      type="number"
                      value={editedPrices[player.id]?.max || 0}
                      onChange={(e) => handlePriceChange(player.id, 'max', e.target.value)}
                      className="w-full bg-white/10 border border-purple-500/20 rounded-lg px-3 py-1 text-white"
                      step="0.1"
                      min={editedPrices[player.id]?.min || 0}
                    />
                  </div>

                  <div className="text-white">
                    {player.iplCaps}
                  </div>

                  <div className="text-white">
                    {player.role}
                  </div>

                  <div className="text-purple-200">
                    {player.set}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionAdmin;