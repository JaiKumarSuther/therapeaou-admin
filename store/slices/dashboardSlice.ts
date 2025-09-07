import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { adminApiService, DashboardData, User } from '../../lib/api/admin';

// Dashboard state interface
interface DashboardState {
  dashboardData: DashboardData | null;
  newRegisteredUsers: User[];
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: DashboardState = {
  dashboardData: null,
  newRegisteredUsers: [],
  isLoading: false,
  error: null,
};

// Async thunks
export const getDashboardDataAsync = createAsyncThunk(
  'dashboard/getDashboardData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApiService.getDashboardData();
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.error || 'Failed to get dashboard data');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get dashboard data');
    }
  }
);

export const getNewRegisteredUsersAsync = createAsyncThunk(
  'dashboard/getNewRegisteredUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApiService.getNewRegistered();
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.error || 'Failed to get new registered users');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get new registered users');
    }
  }
);

export const getTotalPremiumAsync = createAsyncThunk(
  'dashboard/getTotalPremium',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApiService.getTotalPremium();
      if (response.success && response.data !== undefined) {
        return response.data;
      } else {
        return rejectWithValue(response.error || 'Failed to get total premium count');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get total premium count');
    }
  }
);

export const getTotalPlatinumAsync = createAsyncThunk(
  'dashboard/getTotalPlatinum',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApiService.getTotalPlatinum();
      if (response.success && response.data !== undefined) {
        return response.data;
      } else {
        return rejectWithValue(response.error || 'Failed to get total platinum count');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get total platinum count');
    }
  }
);

export const getTotalUsersAsync = createAsyncThunk(
  'dashboard/getTotalUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApiService.getTotalUsers();
      if (response.success && response.data !== undefined) {
        return response.data;
      } else {
        return rejectWithValue(response.error || 'Failed to get total users count');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get total users count');
    }
  }
);

export const getTotalTherapistsAsync = createAsyncThunk(
  'dashboard/getTotalTherapists',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApiService.getTotalTherapists();
      if (response.success && response.data !== undefined) {
        return response.data;
      } else {
        return rejectWithValue(response.error || 'Failed to get total therapists count');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get total therapists count');
    }
  }
);

export const getTotalPatientsAsync = createAsyncThunk(
  'dashboard/getTotalPatients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApiService.getTotalPatients();
      if (response.success && response.data !== undefined) {
        return response.data;
      } else {
        return rejectWithValue(response.error || 'Failed to get total patients count');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get total patients count');
    }
  }
);

export const getTotalRevenueAsync = createAsyncThunk(
  'dashboard/getTotalRevenue',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApiService.getTotalRevenue();
      if (response.success && response.data !== undefined) {
        return response.data;
      } else {
        return rejectWithValue(response.error || 'Failed to get total revenue');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get total revenue');
    }
  }
);

export const getMonthlyRevenueAsync = createAsyncThunk(
  'dashboard/getMonthlyRevenue',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApiService.getMonthlyRevenue();
      if (response.success && response.data !== undefined) {
        return response.data;
      } else {
        return rejectWithValue(response.error || 'Failed to get monthly revenue');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get monthly revenue');
    }
  }
);

// Dashboard slice
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearDashboardData: (state) => {
      state.dashboardData = null;
      state.newRegisteredUsers = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Dashboard Data
      .addCase(getDashboardDataAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDashboardDataAsync.fulfilled, (state, action: PayloadAction<DashboardData>) => {
        state.isLoading = false;
        state.dashboardData = action.payload;
        state.error = null;
      })
      .addCase(getDashboardDataAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get New Registered Users
      .addCase(getNewRegisteredUsersAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getNewRegisteredUsersAsync.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.isLoading = false;
        state.newRegisteredUsers = action.payload;
        state.error = null;
      })
      .addCase(getNewRegisteredUsersAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Total Premium
      .addCase(getTotalPremiumAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTotalPremiumAsync.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false;
        if (state.dashboardData) {
          state.dashboardData.totalPremium = action.payload;
        }
        state.error = null;
      })
      .addCase(getTotalPremiumAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Total Platinum
      .addCase(getTotalPlatinumAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTotalPlatinumAsync.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false;
        if (state.dashboardData) {
          state.dashboardData.totalPlatinum = action.payload;
        }
        state.error = null;
      })
      .addCase(getTotalPlatinumAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Total Users
      .addCase(getTotalUsersAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTotalUsersAsync.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false;
        if (state.dashboardData) {
          state.dashboardData.totalUsers = action.payload;
        }
        state.error = null;
      })
      .addCase(getTotalUsersAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Total Therapists
      .addCase(getTotalTherapistsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTotalTherapistsAsync.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false;
        if (state.dashboardData) {
          state.dashboardData.totalTherapists = action.payload;
        }
        state.error = null;
      })
      .addCase(getTotalTherapistsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Total Patients
      .addCase(getTotalPatientsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTotalPatientsAsync.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false;
        if (state.dashboardData) {
          state.dashboardData.totalPatients = action.payload;
        }
        state.error = null;
      })
      .addCase(getTotalPatientsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Total Revenue
      .addCase(getTotalRevenueAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTotalRevenueAsync.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false;
        if (state.dashboardData) {
          state.dashboardData.totalRevenue = action.payload;
        }
        state.error = null;
      })
      .addCase(getTotalRevenueAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Monthly Revenue
      .addCase(getMonthlyRevenueAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMonthlyRevenueAsync.fulfilled, (state, action: PayloadAction<number>) => {
        state.isLoading = false;
        if (state.dashboardData) {
          state.dashboardData.monthlyRevenue = action.payload;
        }
        state.error = null;
      })
      .addCase(getMonthlyRevenueAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearDashboardData } = dashboardSlice.actions;
export default dashboardSlice.reducer;
