'use client';

import React, { useState } from 'react';
import { FiMail, FiLock, FiUser, FiPhone, FiGlobe } from 'react-icons/fi';
import { useAuth } from './context/AuthContext';
import { validateEmail } from '@/utils';
import Button from './UI/Button';
import Input from './UI/Input';

interface CreateAdminFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

interface CreateAdminFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  timezone: string;
}

const CreateAdminForm: React.FC<CreateAdminFormProps> = ({ onSuccess, onCancel }) => {
  const { createAdmin } = useAuth();
  
  const [formData, setFormData] = useState<CreateAdminFormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    timezone: 'UTC-5',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<CreateAdminFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateAdminFormData> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.phoneNumber && !/^\+?[\d\s\-\(\)]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CreateAdminFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await createAdmin({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber || undefined,
        timezone: formData.timezone,
      });

      if (result.success) {
        onSuccess();
      } else {
        setErrors({ email: result.error || 'Failed to create admin user.' });
      }
    } catch (error) {
      console.error('Create admin error:', error);
      setErrors({ email: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-100 w-full max-w-md mx-auto">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          Create Admin User
        </h2>
        <p className="text-gray-600 text-sm">
          Add a new administrator to the system
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            type="text"
            label="First Name"
            value={formData.firstName}
            onChange={(value) => handleInputChange('firstName', value)}
            placeholder="Enter first name"
            required
            error={errors.firstName}
            icon={<FiUser />}
            iconPosition="left"
          />

          <Input
            type="text"
            label="Last Name"
            value={formData.lastName}
            onChange={(value) => handleInputChange('lastName', value)}
            placeholder="Enter last name"
            required
            error={errors.lastName}
            icon={<FiUser />}
            iconPosition="left"
          />
        </div>

        <Input
          type="email"
          label="Email"
          value={formData.email}
          onChange={(value) => handleInputChange('email', value)}
          placeholder="Enter email address"
          required
          error={errors.email}
          icon={<FiMail />}
          iconPosition="left"
        />

        <Input
          type="password"
          label="Password"
          value={formData.password}
          onChange={(value) => handleInputChange('password', value)}
          placeholder="Enter password"
          required
          error={errors.password}
          icon={<FiLock />}
          iconPosition="left"
        />

        <Input
          type="password"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={(value) => handleInputChange('confirmPassword', value)}
          placeholder="Confirm password"
          required
          error={errors.confirmPassword}
          icon={<FiLock />}
          iconPosition="left"
        />

        <Input
          type="tel"
          label="Phone Number (Optional)"
          value={formData.phoneNumber}
          onChange={(value) => handleInputChange('phoneNumber', value)}
          placeholder="Enter phone number"
          error={errors.phoneNumber}
          icon={<FiPhone />}
          iconPosition="left"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Timezone
          </label>
          <div className="relative">
            <select
              value={formData.timezone}
              onChange={(e) => handleInputChange('timezone', e.target.value)}
              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3C5671] focus:border-transparent"
            >
              <option value="UTC-5">UTC-5 (EST)</option>
              <option value="UTC-6">UTC-6 (CST)</option>
              <option value="UTC-7">UTC-7 (MST)</option>
              <option value="UTC-8">UTC-8 (PST)</option>
              <option value="UTC+0">UTC+0 (GMT)</option>
              <option value="UTC+1">UTC+1 (CET)</option>
              <option value="UTC+5">UTC+5 (PKT)</option>
              <option value="UTC+8">UTC+8 (CST)</option>
            </select>
            <FiGlobe className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isLoading}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Creating...' : 'Create Admin'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateAdminForm;
