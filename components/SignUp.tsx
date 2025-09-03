'use client';

import React, { useState } from 'react';
import { FiArrowLeft, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import { COLORS } from '@/constants';

interface SignUpProps {
  onBackToLogin: () => void;
}

export default function SignUp({ onBackToLogin }: SignUpProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    console.log('Signup attempt:', formData);
    setIsSubmitted(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <FiCheck className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Account Created!
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Welcome to Shieldr! Your account has been successfully created.
          </p>
          <button
            onClick={onBackToLogin}
            className="w-full py-3 px-4 rounded-md text-white font-medium text-sm transition-all duration-200 hover:opacity-90"
            style={{
              backgroundColor: COLORS.PRIMARY.BLUE
            }}
          >
            Continue to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Create Account
        </h2>
        <p className="text-gray-600 text-sm">
          Join Shieldr and stay protected
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[--ring-color] focus:border-[--ring-color]"
              style={{ ['--ring-color' as any]: COLORS.PRIMARY.BLUE }}
              placeholder="First name"
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[--ring-color] focus:border-[--ring-color]"
              style={{ ['--ring-color' as any]: COLORS.PRIMARY.BLUE }}
              placeholder="Last name"
              required
            />
          </div>
        </div>

        {/* Email Input */}
        <div>
          <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="signup-email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[--ring-color] focus:border-[--ring-color]"
            style={{ ['--ring-color' as any]: COLORS.PRIMARY.BLUE }}
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="signup-password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[--ring-color] focus:border-[--ring-color]"
              style={{ ['--ring-color' as any]: COLORS.PRIMARY.BLUE }}
              placeholder="Create a password"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            >
              {showPassword ? (
                <FiEyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <FiEye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirm-password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[--ring-color] focus:border-[--ring-color]"
              style={{ ['--ring-color' as any]: COLORS.PRIMARY.BLUE }}
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
            >
              {showConfirmPassword ? (
                <FiEyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <FiEye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start">
          <input
            id="agree-terms"
            name="agreeToTerms"
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            className="h-4 w-4 border-gray-300 rounded mt-1 text-[#3C5671] focus:ring-[#3C5671]"
            required
          />
          <label htmlFor="agree-terms" className="ml-2 block text-sm cursor-pointer text-gray-700">
            I agree to the{' '}
            <a href="#" className="text-[#3C5671] hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-[#3C5671] hover:underline">
              Privacy Policy
            </a>
          </label>
        </div>

        {/* Sign Up Button */}
        <button
          type="submit"
          className="w-full py-3 px-4 rounded-md text-white font-medium text-sm transition-all duration-200"
          style={{
            backgroundColor: COLORS.PRIMARY.BLUE
          }}
        >
          Create Account
        </button>

        {/* Back to Login */}
        <div className="text-center">
                      <button
              type="button"
              onClick={onBackToLogin}
              className="flex items-center justify-center w-full py-3 px-4 rounded-md text-gray-700 font-medium text-sm border border-gray-300 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
            >
              <FiArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </button>
        </div>
      </form>
    </div>
  );
}
