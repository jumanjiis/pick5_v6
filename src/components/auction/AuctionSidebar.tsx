import React from 'react';
import { DollarSign, Trophy, Users } from 'lucide-react';
import CollapsibleSection from './CollapsibleSection';

interface AuctionSidebarProps {
  team: any;
  currentBid: number;
  currentBidder: string;
}

const AuctionSidebar: React.FC<AuctionSidebarProps> = ({
  team,
  currentBid,
  currentBidder
}) => {
  const topPicks = team.currentPlayers
    .filter((p: any) => p.isNewBuy)
    .sort((a: any, b: any) => (b.price || 0) - (a.price || 0))
    .slice(0, 5);

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-black/60 backdrop-blur-lg border-l border-purple-500/20 p-4 space-y-4 overflow-y-auto">
      <CollapsibleSection
        title="Budget Overview"
        icon={<DollarSign className="h-5 w-5 text-green-400" />}
      >
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-purple-200">Initial Budget</span>
            <span className="text-white font-bold">₹{(team.initialBudget / 10000000).toFixed(1)}Cr</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-purple-200">Spent</span>
            <span className="text-red-400 font-bold">
              ₹{((team.initialBudget - team.budget) / 10000000).toFixed(1)}Cr
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-purple-200">Remaining</span>
            <span className="text-green-400 font-bold">₹{(team.budget / 10000000).toFixed(1)}Cr</span>
          </div>
          {currentBidder === team.name && (
            <div className="bg-yellow-500/20 rounded-lg p-3 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-yellow-400">Current Bid</span>
                <span className="text-yellow-400 font-bold">
                  ₹{(currentBid / 10000000).toFixed(1)}Cr
                </span>
              </div>
            </div>
          )}
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Top Picks"
        icon={<Trophy className="h-5 w-5 text-yellow-400" />}
      >
        {topPicks.length > 0 ? (
          <div className="space-y-3">
            {topPicks.map((player: any, index: number) => (
              <div
                key={index}
                className="bg-white/10 rounded-lg p-3 flex justify-between items-center"
              >
                <div>
                  <p className="text-white font-semibold">{player.name}</p>
                  <p className="text-sm text-purple-200">{player.role}</p>
                </div>
                <span className="text-green-400">₹{(player.price / 10000000).toFixed(1)}Cr</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-purple-200 text-center">No players bought yet</p>
        )}
      </CollapsibleSection>

      <CollapsibleSection
        title="Squad Overview"
        icon={<Users className="h-5 w-5 text-blue-400" />}
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-purple-200 text-sm">Total Players</p>
              <p className="text-2xl font-bold text-white">{team.currentPlayers.length}/25</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-purple-200 text-sm">Overseas</p>
              <p className="text-2xl font-bold text-white">
                {team.currentPlayers.filter((p: any) => p.type === 'Overseas').length}/8
              </p>
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-3">
            <p className="text-purple-200 text-sm mb-2">Role Distribution</p>
            {Object.entries(
              team.currentPlayers.reduce((acc: any, player: any) => {
                acc[player.role] = (acc[player.role] || 0) + 1;
                return acc;
              }, {})
            ).map(([role, count]: [string, any]) => (
              <div key={role} className="flex justify-between items-center mb-1 last:mb-0">
                <span className="text-white">{role}</span>
                <span className="text-purple-200">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
};

export default AuctionSidebar;