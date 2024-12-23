import React from 'react';
import PlayerList from './PlayerList';
import type { Player } from './types';

interface SquadSectionProps {
  title: string;
  existingPlayers: Player[];
  newPlayers: Player[];
}

const SquadSection: React.FC<SquadSectionProps> = ({ title, existingPlayers, newPlayers }) => (
  <div className="bg-white/10 rounded-xl p-6">
    <h3 className="text-xl font-semibold text-white mb-4 flex items-center justify-between">
      <span>{title}</span>
      <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
        {existingPlayers.length + newPlayers.length}
      </span>
    </h3>

    <PlayerList 
      title="New Acquisitions" 
      players={newPlayers} 
      isNew={true} 
    />
    
    <PlayerList 
      title="Retained Players" 
      players={existingPlayers} 
    />
  </div>
);

export default SquadSection;