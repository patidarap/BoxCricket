export const API_CONFIG = {
  BASE_URL: 'https://cricsco.onrender.com/api/',
  TIMEOUT: 30000,
};

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    SEND_OTP: 'auth/send-otp',
    VERIFY_OTP: 'auth/verify-otp',
  },
  // Organization endpoints
  ORGANIZATION: {
    CREATE: 'organization/create',
    LIST: 'organization/list',
    ADD_MEMBERS: 'organization/add-members',
    GET_MEMBERS: 'organization/members',
  },
  // Match endpoints
  MATCH: {
    CREATE: 'match/create',
    LIST: 'match/list',
  },
  // Split payment endpoints
  SPLIT: {
    CREATE: 'split/create',
    LIST: 'split/list',
    MARK_PAID: 'split/mark-paid',
  },
  // Profile endpoints
  PROFILE: {
    ME: 'profile/me',
  },
};
