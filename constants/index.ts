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
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    SIGNUP: '/api/auth/signup',
  },
  USERS: {
    LIST: '/api/users',
    UPDATE: '/api/users/:id',
    DELETE: '/api/users/:id',
  },
  REPORTS: {
    DOWNLOAD: '/api/reports/download',
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
