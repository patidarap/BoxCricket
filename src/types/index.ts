// Core Types
export interface User {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  email?: string;
  totalMatches: number;
  totalRuns: number;
  totalWickets: number;
  mvpCount: number;
  createdAt: string;
}

export interface Match {
  id: string;
  title: string;
  groundName: string;
  date: string;
  time: string;
  totalAmount: number;
  numberOfPlayers: number;
  amountPerPlayer: number;
  notes?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  creatorId: string;
  creatorName: string;
  players: MatchPlayer[];
  createdAt: string;
  updatedAt: string;
}

export interface MatchPlayer {
  id: string;
  userId?: string;
  name: string;
  phone: string;
  avatar?: string;
  isGuest: boolean;
  paymentStatus: 'pending' | 'paid' | 'partial';
  amountPaid: number;
  amountDue: number;
  paidAt?: string;
}

export interface Payment {
  id: string;
  matchId: string;
  matchTitle: string;
  playerId: string;
  playerName: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  method?: 'upi' | 'cash' | 'card';
  transactionId?: string;
  paidAt?: string;
  createdAt: string;
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  rank: number;
  totalMatches: number;
  totalRuns: number;
  totalWickets: number;
  wins: number;
  mvpCount: number;
  average: number;
  strikeRate: number;
}

export interface Notification {
  id: string;
  type: 'match_reminder' | 'payment_reminder' | 'payment_success' | 'match_update';
  title: string;
  message: string;
  matchId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ScoreboardTeam {
  name: string;
  runs: number;
  wickets: number;
  overs: number;
  balls: number;
  extras: number;
}

export interface Scoreboard {
  matchId: string;
  teamA: ScoreboardTeam;
  teamB: ScoreboardTeam;
  currentInnings: 'teamA' | 'teamB';
  tossWinner: 'teamA' | 'teamB';
  tossDecision: 'bat' | 'bowl';
  status: 'not_started' | 'in_progress' | 'completed';
}

export type PaymentMethod = 'upi' | 'gpay' | 'phonepe' | 'paytm' | 'cash';

export type ThemeMode = 'light' | 'dark';
