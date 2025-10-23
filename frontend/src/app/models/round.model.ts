export interface Match {
  _id: string;
  team1: any;
  team2: any | null;
  score1: number;
  score2: number;
  winner: any | null;
}

export interface Round {
  _id: string;
  roundNumber: number;
  matches: Match[];
  showLeaderboard: boolean;
}

