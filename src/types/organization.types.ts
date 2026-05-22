export interface Organization {
  id: string;
  name: string;
  creatorId: string;
  creatorName: string;
  createdBy: string;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  name: string;
  phone: string;
  avatar?: string;
  joinedAt: string;
}

export interface Score {
  id: string;
  organizationId: string;
  matchTitle: string;
  teamA: string;
  teamB: string;
  teamARuns: number;
  teamAWickets: number;
  teamAOvers: number;
  teamBRuns: number;
  teamBWickets: number;
  teamBOvers: number;
  createdAt: string;
}

export interface OrganizationPayment {
  id: string;
  organizationId: string;
  playerId: string;
  playerName: string;
  amount: number;
  status: 'paid' | 'pending' | 'partial';
  createdAt: string;
}
