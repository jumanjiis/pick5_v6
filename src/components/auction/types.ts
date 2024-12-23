export interface Player {
  name: string;
  role: string;
  type: string;
  price?: number;
  isNewBuy?: boolean;
}

export interface Team {
  id: string;
  name: string;
  color: string;
  textColor: string;
  budget: number;
  initialBudget: number;
  currentPlayers: Player[];
}