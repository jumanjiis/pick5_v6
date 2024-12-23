import { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Match, Player } from '../types';

export const useMatches = () => {
  const [matches, setMatches] = useState<(Match & { players: Player[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const matchesRef = collection(db, 'matches');
        const matchesQuery = query(matchesRef, orderBy('timestamp', 'desc'));
        const matchesSnapshot = await getDocs(matchesQuery);
        
        const matchesData = await Promise.all(
          matchesSnapshot.docs.map(async (doc) => {
            const matchData = { 
              id: doc.id, 
              ...doc.data(),
              timestamp: doc.data().timestamp.toDate()
            } as Match;
            
            const playersRef = collection(db, 'players');
            const playersSnapshot = await getDocs(playersRef);
            const players = playersSnapshot.docs.map(playerDoc => ({
              id: playerDoc.id,
              ...playerDoc.data()
            })) as Player[];

            return {
              ...matchData,
              players
            };
          })
        );

        setMatches(matchesData);
      } catch (err) {
        console.error('Error fetching matches:', err);
        setError('Failed to load matches');
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return { matches, loading, error };
};