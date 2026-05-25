import { apiClient } from './client';
import { API_ENDPOINTS } from './config';

export interface SendOTPRequest {
  name: string;
  email: string;
  mobile: string;
}

export interface SendOTPResponse {
  success: boolean;
  message: string;
  // data: { isRegistered: boolean };
}

export interface VerifyOTPRequest {
  name: string;
  email: string;
  mobile: string;
  otp: string;
  fcmToken?: string; // Optional FCM token for push notifications
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: {
      _id: string;
      name: string;
      email: string;
      mobile: string;
      role: string;
      isRegistered: boolean;
      createdAt: string;
      updatedAt: string;
    };
  };
}

export const authService = {
  sendOTP: async (data: SendOTPRequest): Promise<SendOTPResponse> => {
    return apiClient.post<SendOTPResponse>(API_ENDPOINTS.AUTH.SEND_OTP, data);
  },

  verifyOTP: async (data: VerifyOTPRequest): Promise<VerifyOTPResponse> => {
    return apiClient.post<VerifyOTPResponse>(
      API_ENDPOINTS.AUTH.VERIFY_OTP,
      data,
    );
  },

  getProfile: async () => {
    return apiClient.get(API_ENDPOINTS.PROFILE.ME);
  },
};
