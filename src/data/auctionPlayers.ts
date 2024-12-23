import { collection, doc, setDoc, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface AuctionPlayer {
  id: string;
  set: string;
  name: string;
  role: string;
  type: 'India' | 'Overseas' | 'Uncapped';
  country: string;
  age: number;
  batting: string;
  bowling: string;
  basePrice: number;
  minExpectedPrice: number;
  maxExpectedPrice: number;
  iplCaps: number;
}

const createPlayer = (
  set: string,
  name: string,
  type: string,
  country: string,
  age: string,
  role: string,
  batting: string,
  bowling: string,
  stats: { iplCaps: number },
  prices: { base: number }
): AuctionPlayer => {
  const basePrice = prices.base * 1000000; // Convert Lakhs to Rupees
  return {
    id: `${set}-${name.toLowerCase().replace(/\s+/g, '-')}`,
    set,
    name,
    role: role.trim(),
    type: type as 'India' | 'Overseas' | 'Uncapped',
    country,
    age: parseInt(age),
    batting: batting.trim(),
    bowling: bowling.trim(),
    basePrice,
    minExpectedPrice: basePrice * 1.2,
    maxExpectedPrice: basePrice * 2.5,
    iplCaps: stats.iplCaps || 0
  };
};

export const auctionPlayers: AuctionPlayer[] = [
  // ... [previous player definitions remain the same]
];

export const initializeAuctionPlayers = async (retries = 3) => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      // First check if players already exist
      const playersRef = collection(db, 'auctionPlayers');
      const snapshot = await getDocs(playersRef);
      
      // Only initialize if no players exist
      if (snapshot.empty) {
        console.log('Initializing auction players...');
        
        // Use batched writes for better performance and atomicity
        const batch = writeBatch(db);
        const batchSize = 500; // Firestore batch limit is 500
        
        for (let i = 0; i < auctionPlayers.length; i += batchSize) {
          const currentBatch = auctionPlayers.slice(i, i + batchSize);
          currentBatch.forEach(player => {
            const docRef = doc(playersRef, player.id);
            batch.set(docRef, player);
          });
          
          // Commit the current batch
          await batch.commit();
        }
        
        console.log('Successfully initialized auction players');
      } else {
        console.log('Auction players already initialized');
      }
      
      return true;
    } catch (error) {
      console.error(`Error initializing auction players (attempt ${attempt + 1}/${retries}):`, error);
      if (attempt === retries - 1) throw error;
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
};