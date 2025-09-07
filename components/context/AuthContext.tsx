'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { initializeAuth, loginAsync, logout, createAdminAsync } from '../../store/slices/authSlice';
import { User, AuthContextType } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const { user: authUser, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Initialize auth state from localStorage
    dispatch(initializeAuth());
  }, [dispatch]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await dispatch(loginAsync({ email, password }));
      if (result.type.endsWith('fulfilled')) {
        return { success: true };
      } else {
        return { 
          success: false, 
          error: result.payload as string || 'Login failed. Please check your credentials.'
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'Network error. Please check your connection and try again.'
      };
    }
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  const createAdmin = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    timezone?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await dispatch(createAdminAsync(data));
      if (result.type.endsWith('fulfilled')) {
        return { success: true };
      } else {
        return { 
          success: false, 
          error: result.payload as string || 'Failed to create admin user.'
        };
      }
    } catch (error) {
      console.error('Create admin error:', error);
      return { 
        success: false, 
        error: 'Network error. Please check your connection and try again.'
      };
    }
  };

  // Convert Redux user to context user format
  const user: User | null = authUser ? {
    id: authUser.id,
    name: `${authUser.firstName} ${authUser.lastName}`,
    email: authUser.email,
    role: 'Admin' as const,
    initials: `${authUser.firstName?.[0] || ''}${authUser.lastName?.[0] || ''}`,
    phone: authUser.phoneNumber,
  } : null;

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout: logoutUser,
    createAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

