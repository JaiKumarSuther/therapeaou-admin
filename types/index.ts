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

// API Response types for user management (matching the actual API response)
export interface TherapistApiResponse {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  active: string | null;
  role: 'therapist';
  verificationStatus?: 'verified' | 'pending' | 'rejected';
  lastLogin?: string;
  averageRating?: number;
  rating?: number;
  reviewsCount?: number;
  specialization?: string;
  therapyField?: string;
  title?: string;
  experience?: string;
  consultationFee?: string;
  [key: string]: unknown; // Allow additional fields from API
}

export interface PatientApiResponse {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  active: string | null;
  role: 'patient';
  verificationStatus?: 'verified' | 'pending' | 'rejected';
  lastLogin?: string;
  rating?: number;
  reviewsCount?: number;
  gender?: string;
  address?: string;
  postalCode?: string;
  [key: string]: unknown; // Allow additional fields from API
}

export interface EditUserFormData {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  country?: string;
  gender?: string;
  status?: 'Active' | 'Restricted' | 'Pending Verification';
  specialization?: string;
  therapyField?: string;
  title?: string;
  experience?: string;
  consultationFee?: string;
  [key: string]: unknown; // Allow additional fields
}

export interface UserTableData {
  id: string;
  name: string;
  email: string;
  lastLogin: string;
  status: 'Active' | 'Restricted' | 'Pending Verification';
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
  // Therapist-specific fields
  specialization?: string;
  therapyField?: string;
  title?: string;
  experience?: string;
  consultationFee?: string;
  // Patient-specific fields
  gender?: string;
  country?: string;
  city?: string;
  address?: string;
  postalCode?: string;
}

// Authentication types
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  createAdmin: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    timezone?: string;
  }) => Promise<{ success: boolean; error?: string }>;
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


// Therapist-specific types
export interface TherapistData {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  title: string;
  specialization: string;
  therapyField: string;
  gender: string;
  country: string;
  city: string;
  postalCode: string;
  address: string;
  experience: string;
  consultationFee: string;
  active: string;
  verificationStatus?: 'verified' | 'pending' | 'rejected';
  rating?: number;
  reviewsCount?: number;
  createdAt: string;
  lastLogin?: string;
  profileImg?: string;
  highestDegree?: string;
  insuranceCertificate?: string;
  dbsCheckCertificate?: string;
}

// Patient-specific types
export interface PatientData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  country: string;
  city: string;
  postalCode: string;
  address: string;
  active: string;
  createdAt: string;
  lastLogin?: string;
  profilePicture?: string;
}

// KPI and Report types
export interface KPIData {
  title: string;
  value: string;
  trend?: string;
  trendType?: 'up' | 'down';
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
export type ActivityType = string; // Allow any activity type

export interface ActivityItem {
  id: string;
  type: ActivityType;
  description: string;
  createdAt: string;
  actor?: string; // admin user or system
  meta?: Record<string, any>; // Allow any meta data
}

export interface ReportHistoryItem {
  id: string | number;
  type: string; // Allow any report type
  createdAt: string;
  createdBy: string; // admin name
  fileUrl?: string;
  status?: string; // Additional status field
  // Allow any additional fields
  [key: string]: any;
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
