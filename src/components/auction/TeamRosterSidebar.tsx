import React from 'react';
import { Users, DollarSign } from 'lucide-react';

interface TeamRosterSidebarProps {
  teams: any;
  selectedTeam: string;
}

const TeamRosterSidebar: React.FC<TeamRosterSidebarProps> = ({ teams, selectedTeam }) => {
  return (
    <div className="bg-purple-900/40 backdrop-blur-lg rounded-2xl border border-purple-300/20 p-6">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <Users className="h-6 w-6 mr-2 text-purple-400" />
        Team Rosters
      </h2>

      <div className="space-y-4">
        {Object.entries(teams).map(([id, team]: [string, any]) => {
          const overseasCount = team.currentPlayers.filter((p: any) => p.type === 'Overseas').length;
          const newBuys = team.currentPlayers.filter((p: any) => p.isNewBuy).length;

          return (
            <div
              key={id}
              className={`bg-purple-800/30 rounded-xl p-4 transition-all duration-300 ${
                id === selectedTeam ? 'border-2 border-purple-400' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className={`font-bold ${team.textColor}`}>{team.name}</h3>
                <div className="flex items-center text-green-400">
                  <DollarSign className="h-4 w-4" />
                  <span>₹{(team.budget / 10000000).toFixed(1)}Cr</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                <div className="text-purple-200">
                  Squad: {team.currentPlayers.length}/25
                </div>
                <div className="text-purple-200">
                  Overseas: {overseasCount}/8
                </div>
              </div>

              {team.currentPlayers.length > 0 && (
                <div className="mt-2 max-h-32 overflow-y-auto space-y-1">
                  {team.currentPlayers.map((player: any, index: number) => (
                    <div
                      key={index}
                      className={`text-sm p-2 rounded ${
                        player.isNewBuy
                          ? 'bg-purple-700/30 text-purple-200'
                          : 'bg-purple-800/20 text-purple-300'
                      }`}
                    >
                      <div className="flex justify-between">
                        <span>{player.name}</span>
                        {player.price && (
                          <span className="text-green-400">
                            ₹{(player.price / 10000000).toFixed(1)}Cr
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamRosterSidebar;