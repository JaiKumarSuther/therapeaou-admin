import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApiService } from '../lib/api/admin';
import { toast } from 'react-hot-toast';

// Query Keys
export const queryKeys = {
  dashboard: ['dashboard'] as const,
  dashboardData: () => [...queryKeys.dashboard, 'data'] as const,
  newRegisteredUsers: () => [...queryKeys.dashboard, 'new-registered'] as const,
  totalPremium: () => [...queryKeys.dashboard, 'total-premium'] as const,
  totalPlatinum: () => [...queryKeys.dashboard, 'total-platinum'] as const,
  totalUsers: () => [...queryKeys.dashboard, 'total-users'] as const,
  totalTherapists: () => [...queryKeys.dashboard, 'total-therapists'] as const,
  totalPatients: () => [...queryKeys.dashboard, 'total-patients'] as const,
  totalRevenue: () => [...queryKeys.dashboard, 'total-revenue'] as const,
  monthlyRevenue: () => [...queryKeys.dashboard, 'monthly-revenue'] as const,
  
  users: ['users'] as const,
  therapists: () => [...queryKeys.users, 'therapists'] as const,
  patients: () => [...queryKeys.users, 'patients'] as const,
  searchTherapists: (query: string) => [...queryKeys.therapists(), 'search', query] as const,
  searchPatients: (query: string) => [...queryKeys.patients(), 'search', query] as const,
  patientById: (id: string) => [...queryKeys.patients(), id] as const,
  newRegisteredPatients: () => [...queryKeys.patients(), 'new-registered'] as const,
  
  reports: ['reports'] as const,
  therapistActivityReport: (params: any) => [...queryKeys.reports, 'therapist-activity', params] as const,
  patientActivityReport: (params: any) => [...queryKeys.reports, 'patient-activity', params] as const,
  financialActivityReport: (params: any) => [...queryKeys.reports, 'financial-activity', params] as const,
  reportHistory: () => [...queryKeys.reports, 'history'] as const,
  recentActivity: (limit: number) => [...queryKeys.reports, 'recent-activity', limit] as const,
  userStats: (period: string) => [...queryKeys.reports, 'user-stats', period] as const,
  revenueAnalytics: (period: string) => [...queryKeys.reports, 'revenue-analytics', period] as const,
  
  profile: ['profile'] as const,
  adminProfile: () => [...queryKeys.profile, 'admin'] as const,
};

// Dashboard Hooks
export const useDashboardData = () => {
  return useQuery({
    queryKey: queryKeys.dashboardData(),
    queryFn: async () => {
      console.log('📈 Fetching dashboard data...');
      const response = await adminApiService.getDashboardData();
      console.log('📈 Dashboard API Response:', JSON.stringify(response, null, 2));
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch dashboard data');
      }
      
      console.log('✅ Dashboard data received:', JSON.stringify(response.data, null, 2));
      return response.data;
    },
  });
};

export const useNewRegisteredUsers = () => {
  return useQuery({
    queryKey: queryKeys.newRegisteredUsers(),
    queryFn: async () => {
      console.log('👥 Fetching new registered users...');
      const response = await adminApiService.getNewRegistered();
      console.log('👥 New Registered Users API Response:', JSON.stringify(response, null, 2));
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch new registered users');
      }
      
      console.log('✅ New registered users data received:', JSON.stringify(response.data, null, 2));
      return response.data;
    },
  });
};

export const useTotalPremium = () => {
  return useQuery({
    queryKey: queryKeys.totalPremium(),
    queryFn: async () => {
      const response = await adminApiService.getTotalPremium();
      if (!response.success || response.data === undefined) {
        throw new Error(response.error || 'Failed to fetch total premium count');
      }
      return response.data;
    },
  });
};

export const useTotalPlatinum = () => {
  return useQuery({
    queryKey: queryKeys.totalPlatinum(),
    queryFn: async () => {
      const response = await adminApiService.getTotalPlatinum();
      if (!response.success || response.data === undefined) {
        throw new Error(response.error || 'Failed to fetch total platinum count');
      }
      return response.data;
    },
  });
};

export const useTotalUsers = () => {
  return useQuery({
    queryKey: queryKeys.totalUsers(),
    queryFn: async () => {
      const response = await adminApiService.getTotalUsers();
      if (!response.success || response.data === undefined) {
        throw new Error(response.error || 'Failed to fetch total users count');
      }
      return response.data;
    },
  });
};

export const useTotalTherapists = () => {
  return useQuery({
    queryKey: queryKeys.totalTherapists(),
    queryFn: async () => {
      console.log('👨‍⚕️ Fetching total therapists...');
      const response = await adminApiService.getTotalTherapists();
      console.log('👨‍⚕️ Total Therapists API Response:', JSON.stringify(response, null, 2));
      
      if (!response.success || response.data === undefined) {
        throw new Error(response.error || 'Failed to fetch total therapists count');
      }
      
      console.log('✅ Total therapists data received:', JSON.stringify(response.data, null, 2));
      return response.data;
    },
  });
};

export const useTotalPatients = () => {
  return useQuery({
    queryKey: queryKeys.totalPatients(),
    queryFn: async () => {
      const response = await adminApiService.getTotalPatients();
      if (!response.success || response.data === undefined) {
        throw new Error(response.error || 'Failed to fetch total patients count');
      }
      return response.data;
    },
  });
};

export const useTotalRevenue = () => {
  return useQuery({
    queryKey: queryKeys.totalRevenue(),
    queryFn: async () => {
      console.log('💰 Fetching total revenue...');
      const response = await adminApiService.getTotalRevenue();
      console.log('💰 Total Revenue API Response:', JSON.stringify(response, null, 2));
      
      if (!response.success || response.data === undefined) {
        throw new Error(response.error || 'Failed to fetch total revenue');
      }
      
      console.log('✅ Total revenue data received:', JSON.stringify(response.data, null, 2));
      return response.data;
    },
  });
};

export const useMonthlyRevenue = () => {
  return useQuery({
    queryKey: queryKeys.monthlyRevenue(),
    queryFn: async () => {
      const response = await adminApiService.getMonthlyRevenue();
      if (!response.success || response.data === undefined) {
        throw new Error(response.error || 'Failed to fetch monthly revenue');
      }
      return response.data;
    },
  });
};

// User Management Hooks
export const useSearchTherapists = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.searchTherapists(query),
    queryFn: async () => {
      const response = await adminApiService.searchTherapists(query);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to search therapists');
      }
      return response.data;
    },
    enabled: enabled && query.length > 0,
  });
};

export const useSearchPatients = (query: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.searchPatients(query),
    queryFn: async () => {
      const response = await adminApiService.searchPatients(query);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to search patients');
      }
      return response.data;
    },
    enabled: enabled && query.length > 0,
  });
};

export const useAllPatients = () => {
  return useQuery({
    queryKey: queryKeys.patients(),
    queryFn: async () => {
      const response = await adminApiService.getAllPatients();
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch all patients');
      }
      return response.data;
    },
  });
};

export const usePatientById = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.patientById(id),
    queryFn: async () => {
      const response = await adminApiService.getPatientById(id);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch patient');
      }
      return response.data;
    },
    enabled: enabled && !!id,
  });
};

export const useNewRegisteredPatients = () => {
  return useQuery({
    queryKey: queryKeys.newRegisteredPatients(),
    queryFn: async () => {
      const response = await adminApiService.getNewRegisteredPatients();
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch new registered patients');
      }
      return response.data;
    },
  });
};

// Reporting Hooks
export const useTherapistActivityReport = (params: {
  from: string;
  to: string;
  status?: string;
  location?: string;
}, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.therapistActivityReport(params),
    queryFn: async () => {
      console.log('👨‍⚕️ Fetching therapist activity report with params:', JSON.stringify(params, null, 2));
      const response = await adminApiService.getTherapistActivityReport(params);
      console.log('👨‍⚕️ Therapist Activity Report API Response:', JSON.stringify(response, null, 2));
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch therapist activity report');
      }
      
      console.log('✅ Therapist activity report data received:', JSON.stringify(response.data, null, 2));
      return response.data;
    },
    enabled: enabled && !!params.from && !!params.to,
  });
};

export const usePatientActivityReport = (params: {
  from: string;
  to: string;
  status?: string;
  location?: string;
}, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.patientActivityReport(params),
    queryFn: async () => {
      console.log('👥 Fetching patient activity report with params:', JSON.stringify(params, null, 2));
      const response = await adminApiService.getPatientActivityReport(params);
      console.log('👥 Patient Activity Report API Response:', JSON.stringify(response, null, 2));
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch patient activity report');
      }
      
      console.log('✅ Patient activity report data received:', JSON.stringify(response.data, null, 2));
      return response.data;
    },
    enabled: enabled && !!params.from && !!params.to,
  });
};

export const useFinancialActivityReport = (params: {
  from: string;
  to: string;
}, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.financialActivityReport(params),
    queryFn: async () => {
      console.log('💰 Fetching financial activity report with params:', JSON.stringify(params, null, 2));
      const response = await adminApiService.getFinancialActivityReport(params);
      console.log('💰 Financial Activity Report API Response:', JSON.stringify(response, null, 2));
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch financial activity report');
      }
      
      console.log('✅ Financial activity report data received:', JSON.stringify(response.data, null, 2));
      return response.data;
    },
    enabled: enabled && !!params.from && !!params.to,
  });
};

export const useReportHistory = () => {
  return useQuery({
    queryKey: queryKeys.reportHistory(),
    queryFn: async () => {
      console.log('📋 Fetching report history...');
      const response = await adminApiService.getReportHistory();
      console.log('📋 Report History API Response:', JSON.stringify(response, null, 2));
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch report history');
      }
      
      console.log('✅ Report history data received:', JSON.stringify(response.data, null, 2));
      return response.data;
    },
  });
};

export const useRecentActivity = (limit: number = 10) => {
  return useQuery({
    queryKey: queryKeys.recentActivity(limit),
    queryFn: async () => {
      console.log('📊 Fetching recent activity with limit:', limit);
      
      try {
        const response = await adminApiService.getRecentActivity(limit);
        console.log('📊 Recent Activity API Response:', JSON.stringify(response, null, 2));
        
        if (!response.success || !response.data) {
          // If the endpoint doesn't exist (404), return null to trigger fallback
          if (response.error?.includes('404') || response.error?.includes('Not Found')) {
            console.warn('⚠️ Recent activity endpoint not available, using fallback data');
            return null;
          }
          throw new Error(response.error || 'Failed to fetch recent activity');
        }
        
        console.log('✅ Recent activity data received:', JSON.stringify(response.data, null, 2));
        return response.data;
      } catch (error: any) {
        console.log('❌ Recent activity API error:', JSON.stringify(error, null, 2));
        
        // Handle 404 or other network errors gracefully
        if (error.message?.includes('404') || error.message?.includes('Not Found')) {
          console.warn('⚠️ Recent activity endpoint not available, using fallback data');
          return null;
        }
        throw error;
      }
    },
    retry: false, // Don't retry on 404 errors
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUserStats = (period: 'daily' | 'weekly' | 'monthly') => {
  return useQuery({
    queryKey: queryKeys.userStats(period),
    queryFn: async () => {
      const response = await adminApiService.getUserStats(period);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch user stats');
      }
      return response.data;
    },
  });
};

export const useUserById = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      console.log('🔍 Fetching user by ID:', userId);
      
      // First try to get as patient
      try {
        console.log('📋 Trying to fetch as patient...');
        const patientResponse = await adminApiService.getPatientById(userId);
        console.log('📋 Patient API Response:', JSON.stringify(patientResponse, null, 2));
        
        if (patientResponse.success && patientResponse.data) {
          console.log('✅ Found user as patient:', JSON.stringify(patientResponse.data, null, 2));
          return { ...patientResponse.data, role: 'patient' };
        }
      } catch (error) {
        console.log('❌ User not found as patient, trying therapist search:', error);
      }

      // If not found as patient, try therapist search
      try {
        console.log('👨‍⚕️ Trying to fetch as therapist...');
        const therapistResponse = await adminApiService.getTherapistById(userId);
        console.log('👨‍⚕️ Therapist API Response:', JSON.stringify(therapistResponse, null, 2));
        
        if (therapistResponse.success && therapistResponse.data) {
          // Search returns an array, find the user with matching ID
          const therapist = Array.isArray(therapistResponse.data) 
            ? therapistResponse.data.find(t => t.id === userId)
            : therapistResponse.data;
          
          console.log('🔍 Found therapist in search results:', JSON.stringify(therapist, null, 2));
          
          if (therapist) {
            console.log('✅ Found user as therapist:', JSON.stringify(therapist, null, 2));
            return { ...therapist, role: 'therapist' };
          }
        }
      } catch (error) {
        console.log('❌ User not found as therapist either:', error);
      }

      console.log('❌ User not found in both patient and therapist searches');
      throw new Error('User not found');
    },
    enabled: !!userId,
    retry: false,
  });
};

export const useRevenueAnalytics = (period: 'daily' | 'weekly' | 'monthly') => {
  return useQuery({
    queryKey: queryKeys.revenueAnalytics(period),
    queryFn: async () => {
      const response = await adminApiService.getRevenueAnalytics(period);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch revenue analytics');
      }
      return response.data;
    },
  });
};

// Profile Hooks
export const useAdminProfile = () => {
  return useQuery({
    queryKey: queryKeys.adminProfile(),
    queryFn: async () => {
      const response = await adminApiService.getProfile();
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to fetch admin profile');
      }
      return response.data;
    },
  });
};

// Mutation Hooks
export const useUpdatePatient = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      id: string;
      fullName: string;
      email: string;
      phone: string;
      city: string;
      country: string;
      gender: string;
      active: string;
    }) => {
      const response = await adminApiService.updatePatient(data);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to update patient');
      }
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate and refetch patient queries
      queryClient.invalidateQueries({ queryKey: queryKeys.patients() });
      queryClient.invalidateQueries({ queryKey: queryKeys.patientById(data.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.newRegisteredPatients() });
      toast.success('Patient updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update patient');
    },
  });
};

export const useChangePatientPassword = () => {
  return useMutation({
    mutationFn: async (data: {
      email: string;
      oldPassword: string;
      newPassword: string;
    }) => {
      const response = await adminApiService.changePatientPassword(data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to change password');
      }
      return response.message || 'Password changed successfully';
    },
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to change password');
    },
  });
};

export const useVerifyTherapist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      therapistId: string;
      verified: boolean;
    }) => {
      const response = await adminApiService.verifyTherapist(data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to verify therapist');
      }
      return { therapistId: data.therapistId, verified: data.verified };
    },
    onSuccess: (data) => {
      // Invalidate therapist search queries
      queryClient.invalidateQueries({ queryKey: queryKeys.therapists() });
      toast.success(`Therapist ${data.verified ? 'verified' : 'unverified'} successfully`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to verify therapist');
    },
  });
};

export const useSuspendUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      userId: string;
      userType: 'therapist' | 'patient';
      suspended: boolean;
      reason?: string;
    }) => {
      const response = await adminApiService.suspendUser(data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to suspend user');
      }
      return { userId: data.userId, suspended: data.suspended };
    },
    onSuccess: (data) => {
      // Invalidate user queries
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      toast.success(`User ${data.suspended ? 'suspended' : 'unsuspended'} successfully`);
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to suspend user');
    },
  });
};

export const useResetUserPassword = () => {
  return useMutation({
    mutationFn: async (data: {
      userId: string;
      userType: 'therapist' | 'patient';
      newPassword: string;
    }) => {
      const response = await adminApiService.resetUserPassword(data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to reset password');
      }
      return response.message || 'Password reset successfully';
    },
    onSuccess: () => {
      toast.success('Password reset successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to reset password');
    },
  });
};

export const useSendMessageToUser = () => {
  return useMutation({
    mutationFn: async (data: {
      userId: string;
      userType: 'therapist' | 'patient';
      messageType: 'email' | 'sms';
      subject: string;
      message: string;
    }) => {
      const response = await adminApiService.sendMessageToUser(data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to send message');
      }
      return response.message || 'Message sent successfully';
    },
    onSuccess: () => {
      toast.success('Message sent successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to send message');
    },
  });
};

export const useUpdateAdminProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<any>) => {
      const response = await adminApiService.updateProfile(data);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to update profile');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.adminProfile() });
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });
};

export const useChangeAdminPassword = () => {
  return useMutation({
    mutationFn: async (data: {
      email: string;
      currentPassword: string;
      newPassword: string;
    }) => {
      const response = await adminApiService.changePassword(data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to change password');
      }
      return response.message || 'Password changed successfully';
    },
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to change password');
    },
  });
};

export const useCreateAdmin = () => {
  return useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      phoneNumber?: string;
      timezone?: string;
    }) => {
      const response = await adminApiService.createAdmin(data);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to create admin user');
      }
      return response.data;
    },
    onSuccess: () => {
      toast.success('Admin user created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create admin user');
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      id: string;
      fullName: string;
      email: string;
      phone?: string;
      city?: string;
      country?: string;
      gender?: string;
      active?: string;
    }) => {
      const response = await adminApiService.updateUser(data);
      if (!response.success) {
        throw new Error(response.error || 'Failed to update user');
      }
      return response.message || 'User updated successfully';
    },
    onSuccess: () => {
      // Invalidate user queries to refresh the data
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      queryClient.invalidateQueries({ queryKey: queryKeys.patients() });
      queryClient.invalidateQueries({ queryKey: queryKeys.therapists() });
      toast.success('User updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update user');
    },
  });
};

export const useExportAdminData = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await adminApiService.exportAdminData();
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to export data');
      }
      return response.data;
    },
    onSuccess: (data) => {
      // Trigger download
      if (data.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      }
      toast.success('Data exported successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to export data');
    },
  });
};
