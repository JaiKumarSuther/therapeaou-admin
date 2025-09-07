import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { adminApiService, User } from '../../lib/api/admin';

// Users state interface
interface UsersState {
  therapists: User[];
  patients: User[];
  searchResults: User[];
  selectedUser: User | null;
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
  searchQuery: string;
}

// Initial state
const initialState: UsersState = {
  therapists: [],
  patients: [],
  searchResults: [],
  selectedUser: null,
  isLoading: false,
  isSearching: false,
  error: null,
  searchQuery: '',
};

// Async thunks
export const searchTherapistsAsync = createAsyncThunk(
  'users/searchTherapists',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await adminApiService.searchTherapists(query);
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.error || 'Failed to search therapists');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to search therapists');
    }
  }
);

export const searchPatientsAsync = createAsyncThunk(
  'users/searchPatients',
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await adminApiService.searchPatients(query);
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.error || 'Failed to search patients');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to search patients');
    }
  }
);

export const getAllPatientsAsync = createAsyncThunk(
  'users/getAllPatients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApiService.getAllPatients();
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.error || 'Failed to get all patients');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get all patients');
    }
  }
);

export const getPatientByIdAsync = createAsyncThunk(
  'users/getPatientById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await adminApiService.getPatientById(id);
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.error || 'Failed to get patient');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get patient');
    }
  }
);

export const getNewRegisteredPatientsAsync = createAsyncThunk(
  'users/getNewRegisteredPatients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminApiService.getNewRegisteredPatients();
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.error || 'Failed to get new registered patients');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get new registered patients');
    }
  }
);

export const updatePatientAsync = createAsyncThunk(
  'users/updatePatient',
  async (data: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    city: string;
    country: string;
    gender: string;
    active: string;
  }, { rejectWithValue }) => {
    try {
      const response = await adminApiService.updatePatient(data);
      if (response.success && response.data) {
        return response.data;
      } else {
        return rejectWithValue(response.error || 'Failed to update patient');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update patient');
    }
  }
);

export const changePatientPasswordAsync = createAsyncThunk(
  'users/changePatientPassword',
  async (data: {
    email: string;
    oldPassword: string;
    newPassword: string;
  }, { rejectWithValue }) => {
    try {
      const response = await adminApiService.changePatientPassword(data);
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

export const verifyTherapistAsync = createAsyncThunk(
  'users/verifyTherapist',
  async (data: {
    therapistId: string;
    verified: boolean;
  }, { rejectWithValue }) => {
    try {
      const response = await adminApiService.verifyTherapist(data);
      if (response.success) {
        return { therapistId: data.therapistId, verified: data.verified };
      } else {
        return rejectWithValue(response.error || 'Failed to verify therapist');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to verify therapist');
    }
  }
);

export const suspendUserAsync = createAsyncThunk(
  'users/suspendUser',
  async (data: {
    userId: string;
    userType: 'therapist' | 'patient';
    suspended: boolean;
    reason?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await adminApiService.suspendUser(data);
      if (response.success) {
        return { userId: data.userId, suspended: data.suspended };
      } else {
        return rejectWithValue(response.error || 'Failed to suspend user');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to suspend user');
    }
  }
);

export const resetUserPasswordAsync = createAsyncThunk(
  'users/resetUserPassword',
  async (data: {
    userId: string;
    userType: 'therapist' | 'patient';
    newPassword: string;
  }, { rejectWithValue }) => {
    try {
      const response = await adminApiService.resetUserPassword(data);
      if (response.success) {
        return response.message || 'Password reset successfully';
      } else {
        return rejectWithValue(response.error || 'Failed to reset password');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to reset password');
    }
  }
);

export const sendMessageToUserAsync = createAsyncThunk(
  'users/sendMessageToUser',
  async (data: {
    userId: string;
    userType: 'therapist' | 'patient';
    messageType: 'email' | 'sms';
    subject: string;
    message: string;
  }, { rejectWithValue }) => {
    try {
      const response = await adminApiService.sendMessageToUser(data);
      if (response.success) {
        return response.message || 'Message sent successfully';
      } else {
        return rejectWithValue(response.error || 'Failed to send message');
      }
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send message');
    }
  }
);

// Users slice
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchQuery = '';
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
    clearUsersData: (state) => {
      state.therapists = [];
      state.patients = [];
      state.searchResults = [];
      state.selectedUser = null;
      state.searchQuery = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Search Therapists
      .addCase(searchTherapistsAsync.pending, (state) => {
        state.isSearching = true;
        state.error = null;
      })
      .addCase(searchTherapistsAsync.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.isSearching = false;
        state.searchResults = action.payload;
        state.error = null;
      })
      .addCase(searchTherapistsAsync.rejected, (state, action) => {
        state.isSearching = false;
        state.error = action.payload as string;
      })
      // Search Patients
      .addCase(searchPatientsAsync.pending, (state) => {
        state.isSearching = true;
        state.error = null;
      })
      .addCase(searchPatientsAsync.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.isSearching = false;
        state.searchResults = action.payload;
        state.error = null;
      })
      .addCase(searchPatientsAsync.rejected, (state, action) => {
        state.isSearching = false;
        state.error = action.payload as string;
      })
      // Get All Patients
      .addCase(getAllPatientsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllPatientsAsync.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.isLoading = false;
        state.patients = action.payload;
        state.error = null;
      })
      .addCase(getAllPatientsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Patient by ID
      .addCase(getPatientByIdAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPatientByIdAsync.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.selectedUser = action.payload;
        state.error = null;
      })
      .addCase(getPatientByIdAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get New Registered Patients
      .addCase(getNewRegisteredPatientsAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getNewRegisteredPatientsAsync.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.isLoading = false;
        state.patients = action.payload;
        state.error = null;
      })
      .addCase(getNewRegisteredPatientsAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Patient
      .addCase(updatePatientAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePatientAsync.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        // Update the patient in the patients array
        const index = state.patients.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.patients[index] = action.payload;
        }
        // Update selected user if it's the same
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser = action.payload;
        }
        state.error = null;
      })
      .addCase(updatePatientAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Change Patient Password
      .addCase(changePatientPasswordAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePatientPasswordAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(changePatientPasswordAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Verify Therapist
      .addCase(verifyTherapistAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyTherapistAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update therapist verification status in search results
        const index = state.searchResults.findIndex(t => t.id === action.payload.therapistId);
        if (index !== -1) {
          state.searchResults[index].verificationStatus = action.payload.verified ? 'verified' : 'pending';
        }
        state.error = null;
      })
      .addCase(verifyTherapistAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Suspend User
      .addCase(suspendUserAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(suspendUserAsync.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update user status in search results
        const index = state.searchResults.findIndex(u => u.id === action.payload.userId);
        if (index !== -1) {
          state.searchResults[index].active = action.payload.suspended ? 'inactive' : 'active';
        }
        state.error = null;
      })
      .addCase(suspendUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Reset User Password
      .addCase(resetUserPasswordAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetUserPasswordAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(resetUserPasswordAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Send Message to User
      .addCase(sendMessageToUserAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessageToUserAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(sendMessageToUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  clearSearchResults,
  setSearchQuery,
  setSelectedUser,
  clearUsersData,
} = usersSlice.actions;
export default usersSlice.reducer;
