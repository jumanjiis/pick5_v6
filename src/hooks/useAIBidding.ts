import { useState, useEffect, useCallback } from 'react';
import { Team } from '../types/auction';

interface AIBiddingProps {
  teams: Team[];
  currentBid: number;
  currentBidder: string;
  basePrice: number;
  playerRole: string;
  playerName: string;
  onBid: (teamId: string, amount: number) => void;
}

export const useAIBidding = ({
  teams,
  currentBid,
  currentBidder,
  basePrice,
  playerRole,
  playerName,
  onBid,
}: AIBiddingProps) => {
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [consecutiveNoBids, setConsecutiveNoBids] = useState(0);

  const calculateNextBid = (currentBid: number): number => {
    if (currentBid < 20000000) return currentBid + 1000000; // 10L increments
    if (currentBid < 50000000) return currentBid + 2000000; // 20L increments
    return currentBid + 5000000; // 50L increments
  };

  const shouldTeamBid = useCallback((team: Team, nextBidAmount: number): boolean => {
    if (team.budget < nextBidAmount) return false;
    
    const budgetPercentage = nextBidAmount / team.budget;
    const remainingPlayers = team.playersNeeded || 15;
    const avgBudgetPerPlayer = team.budget / remainingPlayers;
    
    // More aggressive bidding for key roles they need
    const roleMultiplier = team.neededRoles?.includes(playerRole) ? 1.5 : 1;
    
    // Base willingness to bid
    let willingnessToBid = Math.random() * roleMultiplier;
    
    // Adjust based on budget constraints
    if (budgetPercentage > 0.25) willingnessToBid *= 0.5;
    if (nextBidAmount > avgBudgetPerPlayer * 2) willingnessToBid *= 0.3;
    
    // Team-specific bidding patterns
    switch (team.name) {
      case 'Mumbai Indians':
        willingnessToBid *= 1.2; // More aggressive
        break;
      case 'Chennai Super Kings':
        willingnessToBid *= 1.1; // Slightly aggressive
        break;
      // Add other team patterns
    }
    
    return willingnessToBid > 0.7;
  }, [playerRole]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const makeAIBid = () => {
      if (isPaused) return;

      const availableTeams = teams.filter(team => 
        team.name !== currentBidder && 
        team.budget >= calculateNextBid(currentBid)
      );
      
      const nextBidAmount = calculateNextBid(currentBid);
      const interestedTeams = availableTeams.filter(team => shouldTeamBid(team, nextBidAmount));
      
      if (interestedTeams.length > 0) {
        setConsecutiveNoBids(0);
        setIsAIThinking(true);
        
        // Randomize delay between 1-3 seconds
        timeout = setTimeout(() => {
          const biddingTeam = interestedTeams[Math.floor(Math.random() * interestedTeams.length)];
          onBid(biddingTeam.id, nextBidAmount);
          setIsAIThinking(false);
        }, Math.random() * 2000 + 1000);
      } else {
        setConsecutiveNoBids(prev => prev + 1);
      }
    };

    // Only make AI bid if there have been less than 3 consecutive no-bids
    if (currentBid > 0 && consecutiveNoBids < 3) {
      makeAIBid();
    }

    return () => clearTimeout(timeout);
  }, [currentBid, currentBidder, teams, onBid, shouldTeamBid, isPaused, consecutiveNoBids]);

  return { 
    isAIThinking, 
    pauseAI: () => setIsPaused(true),
    resumeAI: () => {
      setIsPaused(false);
      setConsecutiveNoBids(0);
    },
    isFinalCall: consecutiveNoBids >= 3 
  };
};