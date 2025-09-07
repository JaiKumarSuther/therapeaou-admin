'use client';

import React, { useState } from 'react';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { COLORS } from '@/constants';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

export default function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle password reset logic here
    console.log('Password reset requested for:', email);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <FiMail className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Check Your Email
          </h2>
                     <p className="text-gray-600 text-sm mb-6">
             We&apos;ve sent a password reset link to <strong>{email}</strong>
           </p>
                     <p className="text-gray-500 text-xs mb-6">
             Didn&apos;t receive the email? Check your spam folder or try again.
           </p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="text-sm text-[#3C5671] hover:underline mb-4 block cursor-pointer"
          >
            Try another email address
          </button>
                      <button
              onClick={onBackToLogin}
              className="flex items-center justify-center w-full py-3 px-4 rounded-md text-gray-700 font-medium text-sm border border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              <FiArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-100">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Forgot Password?
        </h2>
                 <p className="text-gray-600 text-sm">
           Enter your email address and we&apos;ll send you a link to reset your password.
         </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div>
          <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="reset-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[--ring-color] focus:border-[--ring-color] text-gray-900 placeholder-gray-500"
            style={{ '--ring-color': COLORS.PRIMARY.BLUE } as React.CSSProperties}
            placeholder="Enter your email address"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 px-4 rounded-md text-white font-medium text-sm transition-all duration-200"
          style={{
            backgroundColor: COLORS.PRIMARY.BLUE
          }}
        >
          Send Reset Link
        </button>

        {/* Back to Login */}
        <div className="text-center">
                      <button
              type="button"
              onClick={onBackToLogin}
              className="flex items-center justify-center w-full py-3 px-4 rounded-md text-gray-700 font-medium text-sm border border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              <FiArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </button>
        </div>
      </form>
    </div>
  );
}
