import { apiService, ApiResponse } from '../api';

// Admin API types based on the Postman collection
export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface CreateAdminRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  timezone?: string;
}

export interface AdminLoginResponse {
  token: string;
  admin: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    timezone?: string;
  };
}

export interface DashboardData {
  totalUsers: number;
  totalTherapists: number;
  totalPatients: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalPremium: number;
  totalPlatinum: number;
  newRegistered: number;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  city?: string;
  country?: string;
  gender?: string;
  active: string | null;
  role: 'therapist' | 'patient';
  verificationStatus?: 'verified' | 'pending' | 'rejected';
  rating?: number;
  reviewsCount?: number;
  createdAt: string;
  lastLogin?: string;
}

export interface TherapistActivityReport {
  therapistId: string;
  therapistName: string;
  sessionsCompleted: number;
  cancellations: number;
  averageRating: number;
  totalRevenue: number;
  status: 'active' | 'restricted';
  location: string;
}

export interface PatientActivityReport {
  patientId: string;
  patientName: string;
  bookings: number;
  cancellations: number;
  reviews: number;
  status: 'active' | 'restricted';
  location: string;
}

export interface FinancialActivityReport {
  date: string;
  payments: number;
  refunds: number;
  commission: number;
  netRevenue: number;
}

export interface ReportHistoryItem {
  id: string | number;
  type?: string; // Allow any report type
  reportType?: string; // Alternative field name from API
  createdAt?: string;
  generatedAt?: string; // Alternative field name from API
  createdBy?: string;
  generatedBy?: string; // Alternative field name from API
  fileUrl?: string;
  status?: string; // Additional field from API
  // Allow any additional fields that might come from the API
  [key: string]: unknown;
}

export interface RecentActivity {
  id?: string;
  type?: string; // Allow any activity type
  description?: string;
  message?: string; // Alternative field name from API
  createdAt?: string;
  timestamp?: string; // Alternative field name from API
  actor?: string;
  userId?: number; // User ID from API response
  meta?: Record<string, unknown>;
  // Allow any additional fields that might come from the API
  [key: string]: unknown;
}

export interface UserStats {
  period: string;
  newUsers: number;
  activeUsers: number;
  totalUsers: number;
}

export interface RevenueAnalytics {
  period: string;
  revenue: number;
  growth: number;
  breakdown: {
    premium: number;
    platinum: number;
    commission: number;
  };
}

// Admin API service
export class AdminApiService {
  // Authentication
  async login(credentials: AdminLoginRequest): Promise<ApiResponse<AdminLoginResponse>> {
    return apiService.post('/admin/login', credentials);
  }

  async createAdmin(data: CreateAdminRequest): Promise<ApiResponse<AdminLoginResponse['admin']>> {
    return apiService.post('/admin/create', data);
  }

  async getProfile(adminId?: string): Promise<ApiResponse<AdminLoginResponse['admin']>> {
    const url = adminId ? `/admin/profile/${adminId}` : '/admin/profile';
    return apiService.get(url);
  }

  async updateProfile(data: Partial<AdminLoginResponse['admin']>, adminId?: string): Promise<ApiResponse<AdminLoginResponse['admin']>> {
    const url = adminId ? `/admin/profile/${adminId}` : '/admin/profile';
    return apiService.put(url, data);
  }

  async changePassword(data: {
    email: string;
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<{ message: string }>> {
    return apiService.post('/admin/change-password', data);
  }

  // Dashboard
  async getDashboardData(): Promise<ApiResponse<DashboardData>> {
    return apiService.get('/admin/get-dashboard');
  }

  async getTotalPremium(): Promise<ApiResponse<number>> {
    return apiService.get('/admin/total-premium');
  }

  async getTotalPlatinum(): Promise<ApiResponse<number>> {
    return apiService.get('/admin/total-platinum');
  }

  async getNewRegistered(): Promise<ApiResponse<User[]>> {
    return apiService.get('/admin/new-registered');
  }

  async getTotalUsers(): Promise<ApiResponse<number>> {
    return apiService.get('/admin/total-users');
  }

  async getTotalTherapists(): Promise<ApiResponse<number>> {
    return apiService.get('/admin/total-therapists');
  }


  async getTotalPatients(): Promise<ApiResponse<number>> {
    return apiService.get('/admin/total-patients');
  }

  async getTotalRevenue(): Promise<ApiResponse<number>> {
    return apiService.get('/admin/revenue');
  }

  async getMonthlyRevenue(): Promise<ApiResponse<number>> {
    return apiService.get('/admin/monthly-revenue');
  }

  // User Management - Therapists
  async searchTherapists(query: string): Promise<ApiResponse<User[]>> {
    return apiService.get(`/admin/search-therapist/${encodeURIComponent(query)}`);
  }

  async getTherapistById(id: string): Promise<ApiResponse<User>> {
    // Using search endpoint to get therapist by ID
    return apiService.get(`/admin/search-therapist/${id}`);
  }

  async getAllTherapists(): Promise<ApiResponse<User[]>> {
    return apiService.get('/therapist/get-all');
  }

  async createTherapist(data: {
    fullName: string;
    email: string;
    password: string;
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
    profileImg?: File;
    highestDegree?: File;
    insuranceCertificate?: File;
    dbsCheckCertificate?: File;
  }): Promise<ApiResponse<User>> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value);
      }
    });

    return apiService.post('/therapist/signup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async updateTherapist(data: {
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
    profileImg?: File;
    highestDegree?: File;
    insuranceCertificate?: File;
    dbsCheckCertificate?: File;
  }): Promise<ApiResponse<User>> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value);
      }
    });

    return apiService.put('/therapist/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // User Management - Patients
  async searchPatients(query: string): Promise<ApiResponse<User[]>> {
    return apiService.get(`/admin/search-patient/${encodeURIComponent(query)}`);
  }

  async getAllPatients(): Promise<ApiResponse<User[]>> {
    return apiService.get('/patient/get-all');
  }

  async getPatientById(id: string): Promise<ApiResponse<User>> {
    return apiService.get(`/patient/get/${id}`);
  }

  async getNewRegisteredPatients(): Promise<ApiResponse<User[]>> {
    return apiService.get('/patient/new-registered');
  }

  async createPatient(data: {
    fullName: string;
    email: string;
    password: string;
    phone: string;
    gender: string;
    country: string;
    city: string;
    postalCode: string;
    address: string;
    active: string;
    profilePicture?: File;
  }): Promise<ApiResponse<User>> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value);
      }
    });

    return apiService.post('/patient/signup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async updatePatient(data: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    city: string;
    country: string;
    gender: string;
    active: string;
  }): Promise<ApiResponse<User>> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    return apiService.put('/patient/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async changePatientPassword(data: {
    email: string;
    oldPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<{ message: string }>> {
    return apiService.post('/patient/change-password', data);
  }

  // User Actions
  async verifyTherapist(data: {
    therapistId: string;
    verified: boolean;
  }): Promise<ApiResponse<{ message: string }>> {
    return apiService.put(`/admin/verify-therapist/${data.therapistId}`, data);
  }

  async suspendUser(data: {
    userId: string;
    userType: 'therapist' | 'patient';
    suspended: boolean;
    reason?: string;
  }): Promise<ApiResponse<{ message: string }>> {
    return apiService.put(`/admin/suspend-user/${data.userId}`, data);
  }

  async resetUserPassword(data: {
    userId: string;
    userType: 'therapist' | 'patient';
    newPassword: string;
  }): Promise<ApiResponse<{ message: string }>> {
    return apiService.post('/admin/user/reset-password', data);
  }

  async sendMessageToUser(data: {
    userId: string;
    userType: 'therapist' | 'patient';
    messageType: 'email' | 'sms';
    subject: string;
    message: string;
  }): Promise<ApiResponse<{ message: string }>> {
    return apiService.post('/admin/user/send-message', data);
  }

  async updateUser(data: {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    city?: string;
    country?: string;
    gender?: string;
    active?: string;
    userType?: 'therapist' | 'patient';
  }): Promise<ApiResponse<{ message: string }>> {
    // Create FormData for multipart/form-data request
    const formData = new FormData();
    formData.append('id', data.id);
    formData.append('fullName', data.fullName);
    formData.append('email', data.email);
    if (data.phone) formData.append('phone', data.phone);
    if (data.city) formData.append('city', data.city);
    if (data.country) formData.append('country', data.country);
    if (data.gender) formData.append('gender', data.gender);
    if (data.active) formData.append('active', data.active);

    // Use appropriate endpoint based on user type
    const endpoint = data.userType === 'therapist' ? '/therapist/update' : '/patient/update';
    
    return apiService.put(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Reporting
  async getTherapistActivityReport(params: {
    from: string;
    to: string;
    status?: string;
    location?: string;
  }): Promise<ApiResponse<TherapistActivityReport[]>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    return apiService.get(`/admin/reports/therapist-activity?${queryParams.toString()}`);
  }

  async getPatientActivityReport(params: {
    from: string;
    to: string;
    status?: string;
    location?: string;
  }): Promise<ApiResponse<PatientActivityReport[]>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    return apiService.get(`/admin/reports/patient-activity?${queryParams.toString()}`);
  }

  async getFinancialActivityReport(params: {
    from: string;
    to: string;
  }): Promise<ApiResponse<FinancialActivityReport[]>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    return apiService.get(`/admin/reports/financial-activity?${queryParams.toString()}`);
  }

  async getReportHistory(): Promise<ApiResponse<ReportHistoryItem[]>> {
    return apiService.get('/admin/reports/history');
  }

  // Analytics
  async getRecentActivity(limit: number = 10): Promise<ApiResponse<RecentActivity[]>> {
    return apiService.get(`/admin/analytics/recent-activity?limit=${limit}`);
  }

  async getUserStats(period: 'daily' | 'weekly' | 'monthly'): Promise<ApiResponse<UserStats>> {
    return apiService.get(`/admin/analytics/user-stats?period=${period}`);
  }

  async getRevenueAnalytics(period: 'daily' | 'weekly' | 'monthly'): Promise<ApiResponse<RevenueAnalytics>> {
    return apiService.get(`/admin/analytics/revenue?period=${period}`);
  }

  // Export
  async exportAdminData(): Promise<ApiResponse<{ downloadUrl: string }>> {
    return apiService.get('/admin/export-data');
  }
}

// Export singleton instance
export const adminApiService = new AdminApiService();
