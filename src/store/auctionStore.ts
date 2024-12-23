import { create } from 'zustand';
import { Howl } from 'howler';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface UserMockData {
  selectedTeam: string;
  players: any[];
  playerSelectionsComplete?: boolean;
}

interface AuctionState {
  teams: Record<string, any>;
  selectedTeam: string | null;
  currentPlayer: any | null;
  currentBid: number;
  currentBidder: string;
  soldPlayers: Record<string, { amount: number; team: string }>;
  liveMessages: string[];
  showSoldOverlay: boolean;
  showFinalBid: boolean;
  showRules: boolean;
  showSummary: boolean;
  isSoundEnabled: boolean;
  bidSound: Howl | null;
  hammerSound: Howl | null;
  userMockData: UserMockData | null;
  loading: boolean;
  error: string | null;
  auctionStarted: boolean;
}

interface AuctionStore extends AuctionState {
  initializeSounds: () => void;
  loadUserMockData: (userId: string) => Promise<void>;
  setSelectedTeam: (teamId: string) => void;
  moveToNextPlayer: () => void;
  processAIBids: (player: any) => boolean;
  buyPlayer: () => void;
  toggleSound: () => void;
  toggleRules: () => void;
  resetAuction: () => void;
  startAuction: () => Promise<void>;
}

export const useAuctionStore = create<AuctionStore>((set, get) => ({
  teams: {},
  selectedTeam: null,
  currentPlayer: null,
  currentBid: 0,
  currentBidder: '',
  soldPlayers: {},
  liveMessages: [],
  showSoldOverlay: false,
  showFinalBid: false,
  showRules: false,
  showSummary: false,
  isSoundEnabled: true,
  bidSound: null,
  hammerSound: null,
  userMockData: null,
  loading: false,
  error: null,
  auctionStarted: false,

  initializeSounds: () => {
    const bidSound = new Howl({
      src: ['/sounds/bid.mp3'],
      volume: 0.5
    });

    const hammerSound = new Howl({
      src: ['/sounds/hammer.mp3'],
      volume: 0.5
    });

    set({ bidSound, hammerSound });
  },

  loadUserMockData: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      const mockDoc = await getDoc(doc(db, 'userMocks', userId));
      if (mockDoc.exists()) {
        set({ userMockData: mockDoc.data() as UserMockData });
      }
    } catch (error) {
      set({ error: 'Failed to load auction data' });
    } finally {
      set({ loading: false });
    }
  },

  setSelectedTeam: (teamId: string) => set({ selectedTeam: teamId }),

  moveToNextPlayer: () => {
    const state = get();
    if (!state.userMockData?.players) return;

    const currentIndex = state.userMockData.players.findIndex(p => p.id === state.currentPlayer?.id);
    if (currentIndex === -1 || currentIndex === state.userMockData.players.length - 1) {
      set({ showSummary: true });
      return;
    }

    const nextPlayer = state.userMockData.players[currentIndex + 1];
    set({
      currentPlayer: nextPlayer,
      currentBid: nextPlayer.basePrice,
      currentBidder: '',
      showFinalBid: false,
      showSoldOverlay: false
    });
  },

  processAIBids: (player: any) => {
    const state = get();
    if (state.currentBid >= player.maxExpectedPrice) return false;

    const nextBid = Math.min(
      state.currentBid + Math.floor(Math.random() * 1000000) + 500000,
      player.maxExpectedPrice
    );

    if (nextBid > state.currentBid) {
      const teams = Object.values(state.teams).filter((team: any) => 
        team.name !== state.teams[state.selectedTeam!].name &&
        team.budget >= nextBid
      );

      if (teams.length > 0) {
        const randomTeam = teams[Math.floor(Math.random() * teams.length)];
        set({
          currentBid: nextBid,
          currentBidder: randomTeam.name,
          liveMessages: [`${randomTeam.name} bids ₹${(nextBid / 10000000).toFixed(1)}Cr`, ...state.liveMessages]
        });
        return true;
      }
    }

    return false;
  },

  buyPlayer: () => {
    const state = get();
    if (!state.currentPlayer || !state.selectedTeam) return;

    const team = state.teams[state.selectedTeam];
    if (team.budget < state.currentBid) return;

    if (state.isSoundEnabled && state.hammerSound) {
      state.hammerSound.play();
    }

    set(state => ({
      teams: {
        ...state.teams,
        [state.selectedTeam!]: {
          ...team,
          budget: team.budget - state.currentBid,
          currentPlayers: [...team.currentPlayers, { ...state.currentPlayer, price: state.currentBid }]
        }
      },
      soldPlayers: {
        ...state.soldPlayers,
        [state.currentPlayer!.id]: {
          amount: state.currentBid,
          team: team.name
        }
      },
      showFinalBid: false,
      showSoldOverlay: true,
      liveMessages: [`${state.currentPlayer!.name} sold to ${team.name} for ₹${(state.currentBid / 10000000).toFixed(1)}Cr`, ...state.liveMessages]
    }));

    setTimeout(() => {
      set({ showSoldOverlay: false });
      get().moveToNextPlayer();
    }, 3000);
  },

  toggleSound: () => set(state => ({ isSoundEnabled: !state.isSoundEnabled })),
  
  toggleRules: () => set(state => ({ showRules: !state.showRules })),

  startAuction: async () => {
    const state = get();
    if (!state.userMockData?.players) return;

    try {
      set({ loading: true, error: null });

      const interestedPlayers = state.userMockData.players.filter(p => p.isInterested);
      const otherPlayers = state.userMockData.players.filter(p => !p.isInterested);
      
      const shuffledOtherPlayers = otherPlayers.sort(() => Math.random() - 0.5);
      const orderedPlayers = [...interestedPlayers, ...shuffledOtherPlayers];
      const firstPlayer = orderedPlayers[0];

      set(state => ({
        userMockData: {
          ...state.userMockData!,
          players: orderedPlayers,
          playerSelectionsComplete: true
        },
        currentPlayer: firstPlayer,
        currentBid: firstPlayer.basePrice,
        currentBidder: '',
        auctionStarted: true,
        loading: false
      }));
    } catch (error) {
      console.error('Error starting auction:', error);
      set({ 
        error: 'Failed to start auction',
        loading: false 
      });
    }
  },

  resetAuction: () => set({
    selectedTeam: null,
    currentPlayer: null,
    currentBid: 0,
    currentBidder: '',
    soldPlayers: {},
    liveMessages: [],
    showSoldOverlay: false,
    showFinalBid: false,
    showRules: false,
    showSummary: false,
    userMockData: null,
    loading: false,
    error: null,
    auctionStarted: false
  })
}));