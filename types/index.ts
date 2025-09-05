// User related types
export type UserRole = 'Therapist' | 'Patient' | 'Admin';

export type UserStatus = 'Active' | 'Restricted' | 'Pending Verification';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  initials: string;
  phone?: string;
  location?: string;
}

export interface UserTableData {
  id: string;
  name: string;
  email: string;
  lastLogin: string;
  status: 'Unrestricted' | 'Restricted' | 'Pending Verification';
  role?: UserRole;
  location?: string;
  phone?: string;
  verificationStatus?: 'Verified' | 'Pending' | 'Rejected';
  rating?: number; // average rating for therapists
  reviewsCount?: number;
  activity?: {
    bookings?: number;
    cancellations?: number;
  };
}

// Authentication types
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SignUpFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface EditUserFormData {
  name: string;
  email: string;
  status: 'Unrestricted' | 'Restricted' | 'Pending Verification';
  role?: UserRole;
  location?: string;
}

// KPI and Report types
export interface KPIData {
  title: string;
  value: string;
  trend: string;
  trendType: 'up' | 'down';
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  onClickPath?: string;
}

export interface ReportData {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  type?: 'therapist' | 'patient' | 'financial' | 'user' | 'status';
}

// Activity & Reporting models
export type ActivityType =
  | 'registration'
  | 'therapist_verification'
  | 'restriction_change'
  | 'payment'
  | 'dispute';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  description: string;
  createdAt: string;
  actor?: string; // admin user or system
  meta?: Record<string, string | number | boolean>;
}

export interface ReportHistoryItem {
  id: string;
  type: 'Therapist Activity' | 'Patient Activity' | 'Financial Activity' | 'User Activity';
  createdAt: string;
  createdBy: string; // admin name
  fileUrl?: string;
}

export interface TherapistMetrics {
  sessionsCompleted: number;
  cancellations: number;
  averageRating: number;
}

export interface PatientMetrics {
  bookings: number;
  cancellations: number;
  reviews: number;
}

export interface FinancialMetrics {
  payments: number;
  refunds: number;
  commission: number;
  revenue: number;
}

// Navigation types
export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
}

// Component prop types
export interface BaseComponentProps {
  children?: React.ReactNode;
  className?: string;
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}
