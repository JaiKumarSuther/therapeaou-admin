// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  initials: string;
}

export interface UserTableData {
  id: string;
  name: string;
  email: string;
  lastLogin: string;
  status: 'Unrestricted' | 'Restricted';
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
  status: 'Unrestricted' | 'Restricted';
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
}

export interface ReportData {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
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
