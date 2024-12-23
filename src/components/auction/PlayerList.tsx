import React from 'react';
import { Sparkles, Clock } from 'lucide-react';
import type { Player } from './types';

interface PlayerListProps {
  title: string;
  players: Player[];
  isNew?: boolean;
}

const PlayerList: React.FC<PlayerListProps> = ({ title, players, isNew }) => {
  if (players.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center space-x-2 mb-3">
        {isNew ? (
          <Sparkles className="h-4 w-4 text-yellow-400" />
        ) : (
          <Clock className="h-4 w-4 text-purple-400" />
        )}
        <h4 className={`${isNew ? 'text-yellow-400' : 'text-purple-400'} font-semibold`}>
          {title}
        </h4>
      </div>
      <div className="space-y-3">
        {players.map((player, index) => (
          <div 
            key={`${player.name}-${index}`}
            className={`${
              isNew 
                ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30' 
                : 'bg-white/5'
            } rounded-lg p-4 border border-purple-500/20`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-white flex items-center">
                  {player.name}
                  {isNew && <Sparkles className="h-4 w-4 ml-2 text-yellow-400" />}
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
};

export default PlayerList;