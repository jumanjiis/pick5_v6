export interface Team {
  id: string;
  name: string;
  color: string;
  textColor: string;
  budget: number;
}

export interface Player {
  id: string;
  name: string;
  role: string;
  country: string;
  basePrice: number;
  stats: {
    avg: number;
    sr: number;
  };
  image: string;
}

export interface SoldData {
  player: Player;
  soldTo: {
    name: string;
    color: string;
  };
  amount: number;
}