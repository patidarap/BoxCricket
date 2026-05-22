import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Organization,
  OrganizationMember,
  Score,
  OrganizationPayment,
} from '../../types/organization.types';

interface OrganizationState {
  organizations: Organization[];
  currentOrganization: Organization | null;
  members: OrganizationMember[];
  scores: Score[];
  payments: OrganizationPayment[];
}

const initialState: OrganizationState = {
  organizations: [],
  currentOrganization: null,
  members: [],
  scores: [],
  payments: [],
};

const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    addOrganization: (state, action: PayloadAction<Organization>) => {
      state.organizations.unshift(action.payload);
    },
    setCurrentOrganization: (
      state,
      action: PayloadAction<Organization | null>,
    ) => {
      state.currentOrganization = action.payload;
    },
    addMember: (state, action: PayloadAction<OrganizationMember>) => {
      state.members.push(action.payload);
    },
    removeMember: (state, action: PayloadAction<string>) => {
      state.members = state.members.filter(m => m.id !== action.payload);
    },
    addScore: (state, action: PayloadAction<Score>) => {
      state.scores.unshift(action.payload);
    },
    addPayment: (state, action: PayloadAction<OrganizationPayment>) => {
      state.payments.unshift(action.payload);
    },
    updatePaymentStatus: (
      state,
      action: PayloadAction<{
        paymentId: string;
        status: 'paid' | 'pending' | 'partial';
      }>,
    ) => {
      const payment = state.payments.find(
        p => p.id === action.payload.paymentId,
      );
      if (payment) {
        payment.status = action.payload.status;
      }
    },
  },
});

export const {
  addOrganization,
  setCurrentOrganization,
  addMember,
  removeMember,
  addScore,
  addPayment,
  updatePaymentStatus,
} = organizationSlice.actions;

export default organizationSlice.reducer;
