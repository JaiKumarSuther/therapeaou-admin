// Color constants
export const COLORS = {
  PRIMARY: {
    BLUE: '#3C5671', // Brand navy primary
    DARK_BLUE: '#2E4356', // Darker navy for surfaces
    LIGHT_BLUE: '#567893', // Lighter navy for focus rings and accents
  },
  SIDEBAR: {
    ACTIVE: '#3C5671', // Solid brand for active states
    HOVER: '#F1F5F9', // Light gray for hover states
  },
  BACKGROUND: {
    SIDEBAR: '#FFFFFF',
    HEADER: '#FFFFFF',
    CONTENT: '#F8FAFC', // Very light gray for content background
    MAIN: '#F1F5F9', // Light gray for main background
  },
  STATUS: {
    UNRESTRICTED: {
      BG: 'bg-green-100',
      TEXT: 'text-green-800',
    },
    RESTRICTED: {
      BG: 'bg-red-100',
      TEXT: 'text-red-800',
    },
    PENDING: {
      BG: 'bg-yellow-100',
      TEXT: 'text-yellow-800',
    },
  },
  TEXT: {
    PRIMARY: '#1E293B', // Dark slate for primary text
    SECONDARY: '#64748B', // Medium slate for secondary text
    MUTED: '#94A3B8', // Light slate for muted text
  },
} as const;

// Navigation constants
export const NAVIGATION = {
  ITEMS: [
    { id: 'dashboard', label: 'Dashboard', path: '/dashboard' },
    { id: 'reporting', label: 'Reporting', path: '/dashboard/reporting' },
    { id: 'user-management', label: 'User Management', path: '/dashboard/user-management' },
  ],
  BOTTOM_ITEMS: [
    { id: 'settings', label: 'Settings' },
    { id: 'logout', label: 'Logout' },
  ],
} as const;

// Form validation constants
export const VALIDATION = {
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    MESSAGE: 'Please enter a valid email address',
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MESSAGE: 'Password must be at least 8 characters long',
  },
} as const;

// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/admin/login',
    LOGOUT: '/admin/logout',
    FORGOT_PASSWORD: '/admin/forgot-password',
    SIGNUP: '/admin/signup',
    CREATE_ADMIN: '/admin/create',
  },
  DASHBOARD: {
    GET_DASHBOARD: '/admin/get-dashboard',
    TOTAL_PREMIUM: '/admin/total-premium',
    TOTAL_PLATINUM: '/admin/total-platinum',
    NEW_REGISTERED: '/admin/new-registered',
    TOTAL_USERS: '/admin/total-users',
    TOTAL_THERAPISTS: '/admin/total-therapists',
    TOTAL_PATIENTS: '/admin/total-patients',
    TOTAL_REVENUE: '/admin/revenue',
    MONTHLY_REVENUE: '/admin/monthly-revenue',
  },
  USERS: {
    SEARCH_THERAPISTS: '/admin/search-therapist',
    SEARCH_PATIENTS: '/admin/search-patient',
    GET_ALL_PATIENTS: '/patient/get-all',
    GET_PATIENT_BY_ID: '/patient/get',
    NEW_REGISTERED_PATIENTS: '/patient/new-registered',
    UPDATE_PATIENT: '/patient/update',
    CHANGE_PATIENT_PASSWORD: '/patient/change-password',
  },
  USER_ACTIONS: {
    VERIFY_THERAPIST: '/admin/therapist/verify',
    SUSPEND_USER: '/admin/user/suspend',
    RESET_PASSWORD: '/admin/user/reset-password',
    SEND_MESSAGE: '/admin/user/send-message',
  },
  REPORTS: {
    THERAPIST_ACTIVITY: '/admin/reports/therapist-activity',
    PATIENT_ACTIVITY: '/admin/reports/patient-activity',
    FINANCIAL_ACTIVITY: '/admin/reports/financial-activity',
    REPORT_HISTORY: '/admin/reports/history',
  },
  ANALYTICS: {
    RECENT_ACTIVITY: '/admin/analytics/recent-activity',
    USER_STATS: '/admin/analytics/user-stats',
    REVENUE_ANALYTICS: '/admin/analytics/revenue',
  },
  PROFILE: {
    GET_PROFILE: '/admin/profile',
    UPDATE_PROFILE: '/admin/profile',
    CHANGE_PASSWORD: '/admin/change-password',
    EXPORT_DATA: '/admin/export-data',
  },
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  REMEMBER_ME: 'remember_me',
} as const;

// Error messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Successfully logged in!',
  LOGOUT: 'Successfully logged out!',
  PASSWORD_RESET: 'Password reset link sent to your email.',
  USER_UPDATED: 'User updated successfully.',
  ACCOUNT_CREATED: 'Account created successfully!',
} as const;
