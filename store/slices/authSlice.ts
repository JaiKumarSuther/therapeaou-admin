import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { adminApiService, AdminLoginRequest, AdminLoginResponse, CreateAdminRequest } from '../../lib/api/admin';
import { STORAGE_KEYS } from '../../constants';

// Auth state interface
interface AuthState {
  user: AdminLoginResponse['admin'] | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Async thunks
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: AdminLoginRequest, { rejectWithValue }) => {
    try {
      const response = await adminApiService.login(credentials);
      if (response.success && response.data) {
        // The API returns the admin object directly, not wrapped in { token, admin }
        const adminData = response.data as any;
        // Store token, user data, and admin ID in localStorage
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, adminData.token || '');
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(adminData));
        localStorage.setItem(STORAGE_KEYS.ADMIN_ID, adminData.id);
        return { token: adminData.token || '', admin: adminData };
      } else {
        return rejectWithValue(response.error || 'Login failed');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const getProfileAsync = createAsyncThunk(
  'auth/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApiService.getProfile();
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.error || 'Failed to get profile');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get profile');
    }
  }
);

export const updateProfileAsync = createAsyncThunk(
  'auth/updateProfile',
  async (data: Partial<AdminLoginResponse['admin']>, { rejectWithValue }) => {
    try {
      const response = await adminApiService.updateProfile(data);
      if (response.success && response.data) {
        // Update localStorage
        localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(response.data));
        localStorage.setItem(STORAGE_KEYS.ADMIN_ID, response.data.id);
        return response.data;
      } else {
        return rejectWithValue(response.error || 'Failed to update profile');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update profile');
    }
  }
);

export const changePasswordAsync = createAsyncThunk(
  'auth/changePassword',
  async (data: {
    email: string;
    currentPassword: string;
    newPassword: string;
  }, { rejectWithValue }) => {
    try {
      const response = await adminApiService.changePassword(data);
      if (response.success) {
        return response.message || 'Password changed successfully';
      } else {
        return rejectWithValue(response.error || 'Failed to change password');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to change password');
    }
  }
);

export const createAdminAsync = createAsyncThunk(
  'auth/createAdmin',
  async (data: CreateAdminRequest, { rejectWithValue }) => {
    try {
      const response = await adminApiService.createAdmin(data);
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.error || 'Failed to create admin user');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create admin user');
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      // Clear localStorage
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      localStorage.removeItem(STORAGE_KEYS.ADMIN_ID);
    },
    clearError: (state) => {
      state.error = null;
    },
    initializeAuth: (state) => {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      
      if (token && userData) {
        try {
          state.token = token;
          state.user = JSON.parse(userData);
          state.isAuthenticated = true;
        } catch (error) {
          // Clear invalid data
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
          localStorage.removeItem(STORAGE_KEYS.USER_DATA);
          localStorage.removeItem(STORAGE_KEYS.ADMIN_ID);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action: PayloadAction<AdminLoginResponse>) => {
        state.isLoading = false;
        state.user = action.payload.admin;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      // Get Profile
      .addCase(getProfileAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProfileAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getProfileAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Profile
      .addCase(updateProfileAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfileAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateProfileAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Change Password
      .addCase(changePasswordAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePasswordAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changePasswordAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Admin
      .addCase(createAdminAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAdminAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // Note: Creating admin doesn't automatically log them in
      })
      .addCase(createAdminAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
