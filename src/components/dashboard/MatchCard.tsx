import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Calendar, ArrowRight, AlertCircle, X, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import type { Match, Player } from '../../types';

interface MatchCardProps {
  match: Match & { players: Player[] };
  prediction: any;
  status: string;
  timeStatus: string;
  correctPredictions: number;
}

const MatchCard: React.FC<MatchCardProps> = ({
  match,
  prediction,
  status,
  timeStatus,
  correctPredictions
}) => {
  const getPlayerTarget = (player: Player) => {
    return player.matchTargets[match.id];
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-purple-500/20 overflow-hidden">
      <div className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-400" />
              <h2 className="text-lg font-bold text-white">{match.team1} vs {match.team2}</h2>
            </div>
            <div className="flex items-center text-sm text-purple-200">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="truncate">{format(match.timestamp, 'PPp')}</span>
            </div>
          </div>

          {status === 'upcoming' ? (
            <div className="flex flex-col items-end">
              <div className="flex flex-col items-end mb-2">
                <div className="text-sm line-through text-gray-400">₹10 Entry Fee</div>
                <div className="text-green-400 font-semibold text-sm">FREE ENTRY!</div>
              </div>
              <Link
                to={`/play/${match.id}`}
                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:from-pink-600 hover:to-purple-700 transition-all duration-300"
              >
                {prediction ? 'Update Team' : 'Pick Team'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          ) : prediction ? (
            <Link
              to={`/play/${match.id}`}
              className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-yellow-500 to-orange-600 text-white hover:from-yellow-600 hover:to-orange-700 transition-all duration-300"
            >
              <Trophy className="h-4 w-4 mr-2" />
              View Result ({correctPredictions}/5)
            </Link>
          ) : (
            <div className="inline-flex items-center text-yellow-400 bg-yellow-400/10 px-3 py-1.5 rounded-lg text-sm">
              <AlertCircle className="h-4 w-4 mr-1" />
              <span>No selection</span>
            </div>
          )}
        </div>

        {prediction && prediction.selectedPlayers && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-2">
            {prediction.selectedPlayers.map((playerId: string, index: number) => {
              const player = match.players.find(p => p.id === playerId);
              if (!player) return null;
              const target = getPlayerTarget(player);
              
              return (
                <div key={index} className="bg-white/5 rounded-lg p-2 relative text-sm">
                  {status !== 'upcoming' && target.actualPoints !== undefined && (
                    <div className="absolute -top-1 -right-1">
                      {target.actualPoints >= target.target ? (
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-3 w-3 text-white" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                          <X className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                  )}
                  <p className="text-white font-medium truncate">{player.name}</p>
                  <p className="text-xs text-purple-200">Target: {target.target} {target.type}</p>
                  {status !== 'upcoming' && target.actualPoints !== undefined && (
                    <p className={`text-xs ${
                      target.actualPoints >= target.target ? 'text-green-400' : 'text-red-400'
                    }`}>
                      Actual: {target.actualPoints}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchCard;