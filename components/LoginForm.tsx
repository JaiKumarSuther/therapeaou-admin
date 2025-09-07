'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from './context/AuthContext';
import { LoginFormData } from '@/types';
import { validateEmail } from '@/utils';
import Button from './UI/Button';
import Input from './UI/Input';

interface LoginFormProps {
  onForgotPassword: () => void;
  onSignUp: () => void;
  onCreateAdmin?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onForgotPassword, onSignUp, onCreateAdmin }) => {
  const router = useRouter();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [generalError, setGeneralError] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        router.push('/dashboard');
      } else {
        setGeneralError(result.error || 'Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setGeneralError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100 w-full max-w-md mx-auto">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          Welcome Back!
        </h2>
        <p className="text-gray-600 text-sm">
          Please enter your details
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {generalError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{generalError}</p>
          </div>
        )}
        <Input
          type="email"
          label="Email"
          value={formData.email}
          onChange={(value) => handleInputChange('email', value)}
          placeholder="Enter your email"
          required
          error={errors.email}
          icon={<FiMail />}
          iconPosition="left"
        />

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            label="Password"
            value={formData.password}
            onChange={(value) => handleInputChange('password', value)}
            placeholder="Enter your password"
            required
            error={errors.password}
            icon={<FiLock />}
            iconPosition="left"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 pr-3 flex items-center top-6 cursor-pointer"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <FiEyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <FiEye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
              className="h-4 w-4 border-gray-300 rounded text-[#3C5671] focus:ring-[#3C5671]"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm cursor-pointer text-gray-700">
              Remember me
            </label>
          </div>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-[#3C5671] hover:underline cursor-pointer"
          >
            Forgot Password?
          </button>
        </div>

        <Button
          type="submit"
          loading={isLoading}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Logging In...' : 'Log In'}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-[#3C5671] hover:underline cursor-pointer"
          >
            Forgot password? Click here
          </button>
        </div>

        <div className="text-center pt-4 border-t border-gray-200 space-y-2">
          <div>
            <span className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
            </span>
            <button
              type="button"
              onClick={onSignUp}
              className="text-sm text-[#3C5671] hover:underline font-medium cursor-pointer"
            >
              Sign Up
            </button>
          </div>
          {onCreateAdmin && (
            <div>
              <span className="text-sm text-gray-600">
                Need to create an admin?{' '}
              </span>
              <button
                type="button"
                onClick={onCreateAdmin}
                className="text-sm text-[#3C5671] hover:underline font-medium cursor-pointer"
              >
                Create Admin
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
