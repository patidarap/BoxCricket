import { apiClient } from './client';
import { API_ENDPOINTS } from './config';

export const organizationService = {
  create: async (name: string) => {
    const response = await apiClient.post(API_ENDPOINTS.ORGANIZATION.CREATE, {
      name,
    });
    return response;
  },

  getAll: async () => {
    const response = await apiClient.get(API_ENDPOINTS.ORGANIZATION.LIST);
    return response;
  },

  addMembers: async (
    organizationId: string,
    members: Array<{ name: string; email: string }>,
  ) => {
    const response = await apiClient.post(
      API_ENDPOINTS.ORGANIZATION.ADD_MEMBERS,
      {
        organizationId,
        members: members.map(member => ({
          name: member.name,
          email: member.email,
          role: 'player',
        })),
      },
    );
    return response;
  },

  getMembers: async (organizationId: string) => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.ORGANIZATION.GET_MEMBERS}/${organizationId}`,
    );
    return response;
  },

  createMatch: async (matchData: {
    organizationId: string;
    matchNumber: string;
    team1Name: string;
    team2Name: string;
    team1Captain: string;
    team1Players: string[];
    team2Captain: string;
    team2Players: string[];
    totalOvers: number;
    team1Score: number;
    team2Score: number;
  }) => {
    const response = await apiClient.post(
      API_ENDPOINTS.MATCH.CREATE,
      matchData,
    );
    return response;
  },

  getMatches: async (organizationId: string) => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.MATCH.LIST}/${organizationId}`,
    );
    return response;
  },

  createSplit: async (splitData: {
    organizationId: string;
    title: string;
    amount: number;
    upiId: string;
    mobileNumber: string;
    members: string[];
  }) => {
    const response = await apiClient.post(
      API_ENDPOINTS.SPLIT.CREATE,
      splitData,
    );
    return response;
  },

  getSplits: async (
    organizationId: string,
    page: number = 1,
    limit: number = 10,
  ) => {
    const response = await apiClient.get(
      `${API_ENDPOINTS.SPLIT.LIST}/${organizationId}?page=${page}&limit=${limit}`,
    );
    return response;
  },

  markPaid: async (splitMemberId: string) => {
    const response = await apiClient.put(`split/mark-paid/${splitMemberId}`, {
      status: 'paid',
    });
    return response;
  },

  verifyPayment: async (splitMemberId: string, status: 'done' | 'pending') => {
    const response = await apiClient.put(
      `split/verify-payment/${splitMemberId}`,
      {
        status,
      },
    );
    return response;
  },
};
