import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  adminApiService,
  TherapistActivityReport,
  PatientActivityReport,
  FinancialActivityReport,
  ReportHistoryItem,
  RecentActivity,
  UserStats,
  RevenueAnalytics,
} from '../../lib/api/admin';

// Reports state interface
interface ReportsState {
  therapistActivityReport: TherapistActivityReport[];
  patientActivityReport: PatientActivityReport[];
  financialActivityReport: FinancialActivityReport[];
  reportHistory: ReportHistoryItem[];
  recentActivity: RecentActivity[];
  userStats: UserStats | null;
  revenueAnalytics: RevenueAnalytics | null;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: ReportsState = {
  therapistActivityReport: [],
  patientActivityReport: [],
  financialActivityReport: [],
  reportHistory: [],
  recentActivity: [],
  userStats: null,
  revenueAnalytics: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const getTherapistActivityReportAsync = createAsyncThunk(
  'reports/getTherapistActivityReport',
  async (params: {
    from: string;
    to: string;
    status?: string;
    location?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await adminApiService.getTherapistActivityReport(params);
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.error || 'Failed to get therapist activity report');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get therapist activity report');
    }
  }
);

export const getPatientActivityReportAsync = createAsyncThunk(
  'reports/getPatientActivityReport',
  async (params: {
    from: string;
    to: string;
    status?: string;
    location?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await adminApiService.getPatientActivityReport(params);
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.error || 'Failed to get patient activity report');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get patient activity report');
    }
  }
);

export const getFinancialActivityReportAsync = createAsyncThunk(
  'reports/getFinancialActivityReport',
  async (params: {
    from: string;
    to: string;
  }, { rejectWithValue }) => {
    try {
      const response = await adminApiService.getFinancialActivityReport(params);
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.error || 'Failed to get financial activity report');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get financial activity report');
    }
  }
);

export const getReportHistoryAsync = createAsyncThunk(
  'reports/getReportHistory',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApiService.getReportHistory();
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.error || 'Failed to get report history');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get report history');
    }
  }
);

export const getRecentActivityAsync = createAsyncThunk(
  'reports/getRecentActivity',
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      const response = await adminApiService.getRecentActivity(limit);
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.error || 'Failed to get recent activity');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get recent activity');
    }
  }
);

export const getUserStatsAsync = createAsyncThunk(
  'reports/getUserStats',
  async (period: 'daily' | 'weekly' | 'monthly', { rejectWithValue }) => {
    try {
      const response = await adminApiService.getUserStats(period);
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.error || 'Failed to get user stats');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get user stats');
    }
  }
);

export const getRevenueAnalyticsAsync = createAsyncThunk(
  'reports/getRevenueAnalytics',
  async (period: 'daily' | 'weekly' | 'monthly', { rejectWithValue }) => {
    try {
      const response = await adminApiService.getRevenueAnalytics(period);
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.error || 'Failed to get revenue analytics');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get revenue analytics');
    }
  }
);

export const exportAdminDataAsync = createAsyncThunk(
  'reports/exportAdminData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApiService.exportAdminData();
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.error || 'Failed to export admin data');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to export admin data');
    }
  }
);

// Reports slice
const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearReportsData: (state) => {
      state.therapistActivityReport = [];
      state.patientActivityReport = [];
      state.financialActivityReport = [];
      state.reportHistory = [];
      state.recentActivity = [];
      state.userStats = null;
      state.revenueAnalytics = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Therapist Activity Report
      .addCase(getTherapistActivityReportAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTherapistActivityReportAsync.fulfilled, (state, action: PayloadAction<TherapistActivityReport[]>) => {
        state.isLoading = false;
        state.therapistActivityReport = action.payload;
        state.error = null;
      })
      .addCase(getTherapistActivityReportAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Patient Activity Report
      .addCase(getPatientActivityReportAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPatientActivityReportAsync.fulfilled, (state, action: PayloadAction<PatientActivityReport[]>) => {
        state.isLoading = false;
        state.patientActivityReport = action.payload;
        state.error = null;
      })
      .addCase(getPatientActivityReportAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Financial Activity Report
      .addCase(getFinancialActivityReportAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFinancialActivityReportAsync.fulfilled, (state, action: PayloadAction<FinancialActivityReport[]>) => {
        state.isLoading = false;
        state.financialActivityReport = action.payload;
        state.error = null;
      })
      .addCase(getFinancialActivityReportAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Report History
      .addCase(getReportHistoryAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getReportHistoryAsync.fulfilled, (state, action: PayloadAction<ReportHistoryItem[]>) => {
        state.isLoading = false;
        state.reportHistory = action.payload;
        state.error = null;
      })
      .addCase(getReportHistoryAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Recent Activity
      .addCase(getRecentActivityAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getRecentActivityAsync.fulfilled, (state, action: PayloadAction<RecentActivity[]>) => {
        state.isLoading = false;
        state.recentActivity = action.payload;
        state.error = null;
      })
      .addCase(getRecentActivityAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get User Stats
      .addCase(getUserStatsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserStatsAsync.fulfilled, (state, action: PayloadAction<UserStats>) => {
        state.isLoading = false;
        state.userStats = action.payload;
        state.error = null;
      })
      .addCase(getUserStatsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Revenue Analytics
      .addCase(getRevenueAnalyticsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getRevenueAnalyticsAsync.fulfilled, (state, action: PayloadAction<RevenueAnalytics>) => {
        state.isLoading = false;
        state.revenueAnalytics = action.payload;
        state.error = null;
      })
      .addCase(getRevenueAnalyticsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Export Admin Data
      .addCase(exportAdminDataAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(exportAdminDataAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(exportAdminDataAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearReportsData } = reportsSlice.actions;
export default reportsSlice.reducer;
