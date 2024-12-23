import React from 'react';
import { Heart, DollarSign, Clock } from 'lucide-react';
import type { AuctionPlayer } from '../../data/auctionPlayers';

interface InterestedPlayersPanelProps {
  players: AuctionPlayer[];
  interestedPlayerIds: string[];
  currentPlayerId?: string;
  soldPlayers: Record<string, { amount: number; team: string }>;
}

const InterestedPlayersPanel: React.FC<InterestedPlayersPanelProps> = ({
  players,
  interestedPlayerIds,
  currentPlayerId,
  soldPlayers
}) => {
  const interestedPlayers = players.filter(p => p.id && interestedPlayerIds.includes(p.id));

  return (
    <div className="fixed right-4 top-24 w-80 bg-black/60 backdrop-blur-lg rounded-xl border border-purple-500/20 p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Heart className="h-5 w-5 text-pink-500" />
        <h3 className="text-lg font-semibold text-white">Players of Interest</h3>
        <span className="ml-auto bg-white/20 px-2 py-1 rounded-full text-sm text-purple-200">
          {interestedPlayers.length}
        </span>
      </div>

      <div className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
        {interestedPlayers.map((player) => {
          const isCurrent = player.id === currentPlayerId;
          const soldInfo = player.id && soldPlayers[player.id];
          
          return (
            <div
              key={player.id}
              className={`${
                isCurrent
                  ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30'
                  : soldInfo
                  ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30'
                  : 'bg-white/10'
              } rounded-lg p-4 border border-purple-500/20`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-white">{player.name}</h4>
                  <p className="text-sm text-purple-200">{player.role}</p>
                </div>
                {isCurrent && (
                  <div className="px-2 py-1 bg-yellow-500/20 rounded-full">
                    <Clock className="h-4 w-4 text-yellow-400" />
                  </div>
                )}
              </div>

              <div className="mt-2 flex justify-between items-center text-sm">
                <span className="text-purple-200">Base: ₹{(player.basePrice / 10000000).toFixed(1)}Cr</span>
                {soldInfo && (
                  <div className="flex items-center text-green-400">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span>₹{(soldInfo.amount / 10000000).toFixed(1)}Cr</span>
                  </div>
                )}
              </div>

              {soldInfo && (
                <div className="mt-2 text-sm text-green-200">
                  Sold to {soldInfo.team}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InterestedPlayersPanel;