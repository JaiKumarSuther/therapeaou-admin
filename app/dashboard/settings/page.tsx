'use client';

import React, { useState, useEffect } from 'react';
import { 
  FiUser, 
  FiShield
} from 'react-icons/fi';
import Sidebar from '../../../components/UI/Sidebar';
import Header from '../../../components/UI/Header';
import Button from '../../../components/UI/Button';
import Input from '../../../components/UI/Input';
import { COLORS } from '@/constants';
import { 
  useAdminProfile, 
  useUpdateAdminProfile, 
  useChangeAdminPassword
} from '../../../hooks/useAdminApi';
import { toast } from 'react-hot-toast';

const Settings: React.FC = () => {
  const [activeNav, setActiveNav] = useState('settings');
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  // API hooks
  const { data: adminProfile, isLoading: isProfileLoading } = useAdminProfile();
  const updateProfileMutation = useUpdateAdminProfile();
  const changePasswordMutation = useChangeAdminPassword();

  // Form states
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    timezone: 'UTC-5 (Eastern Time)'
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true
  });


  // Load profile data from API
  useEffect(() => {
    if (adminProfile) {
      setProfileData({
        firstName: adminProfile.firstName || '',
        lastName: adminProfile.lastName || '',
        email: adminProfile.email || '',
        phone: adminProfile.phoneNumber || '',
        timezone: 'UTC-5 (Eastern Time)' // Default timezone
      });
    }
  }, [adminProfile]);

  const handleNavChange = (navId: string) => {
    setActiveNav(navId);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (activeTab === 'profile') {
        await updateProfileMutation.mutateAsync({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          email: profileData.email,
          phoneNumber: profileData.phone
        });
        toast.success('Profile updated successfully');
      } else if (activeTab === 'security') {
        if (securityData.newPassword !== securityData.confirmPassword) {
          toast.error('New passwords do not match');
          setIsSaving(false);
          return;
        }
        await changePasswordMutation.mutateAsync({
          email: profileData.email,
          currentPassword: securityData.currentPassword,
          newPassword: securityData.newPassword
        });
        toast.success('Password changed successfully');
        // Clear password fields
        setSecurityData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          twoFactorEnabled: securityData.twoFactorEnabled
        });
      } else {
        // For other tabs, just show success message
        toast.success('Settings saved successfully');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save settings';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };


  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'security', label: 'Security', icon: FiShield }
  ];

  const renderProfileTab = () => {
    if (isProfileLoading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading profile data...</div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name"
            value={profileData.firstName}
            onChange={(value) => setProfileData({ ...profileData, firstName: value })}
            placeholder="Enter first name"
            disabled={updateProfileMutation.isPending}
          />
          <Input
            label="Last Name"
            value={profileData.lastName}
            onChange={(value) => setProfileData({ ...profileData, lastName: value })}
            placeholder="Enter last name"
            disabled={updateProfileMutation.isPending}
          />
        </div>
        <Input
          label="Email Address"
          type="email"
          value={profileData.email}
          onChange={(value) => setProfileData({ ...profileData, email: value })}
          placeholder="Enter email address"
          disabled={updateProfileMutation.isPending}
        />
        <Input
          label="Phone Number"
          type="tel"
          value={profileData.phone}
          onChange={(value) => setProfileData({ ...profileData, phone: value })}
          placeholder="Enter phone number"
          disabled={updateProfileMutation.isPending}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone
          </label>
          <select
            value={profileData.timezone}
            onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--ring-color] focus:border-[--ring-color] disabled:bg-gray-100 disabled:cursor-not-allowed"
            style={{ '--ring-color': COLORS.PRIMARY.LIGHT_BLUE } as React.CSSProperties}
            disabled={updateProfileMutation.isPending}
          >
            <option value="UTC-5 (Eastern Time)">UTC-5 (Eastern Time)</option>
            <option value="UTC-6 (Central Time)">UTC-6 (Central Time)</option>
            <option value="UTC-7 (Mountain Time)">UTC-7 (Mountain Time)</option>
            <option value="UTC-8 (Pacific Time)">UTC-8 (Pacific Time)</option>
          </select>
        </div>
      </div>
    );
  };

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <Input
        label="Current Password"
        type="password"
        value={securityData.currentPassword}
        onChange={(value) => setSecurityData({ ...securityData, currentPassword: value })}
        placeholder="Enter current password"
        disabled={changePasswordMutation.isPending}
      />
      <Input
        label="New Password"
        type="password"
        value={securityData.newPassword}
        onChange={(value) => setSecurityData({ ...securityData, newPassword: value })}
        placeholder="Enter new password"
        disabled={changePasswordMutation.isPending}
      />
      <Input
        label="Confirm New Password"
        type="password"
        value={securityData.confirmPassword}
        onChange={(value) => setSecurityData({ ...securityData, confirmPassword: value })}
        placeholder="Confirm new password"
        disabled={changePasswordMutation.isPending}
      />
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
        </div>
        <button
          onClick={() => setSecurityData({ ...securityData, twoFactorEnabled: !securityData.twoFactorEnabled })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            securityData.twoFactorEnabled ? '' : 'bg-gray-200'
          }`}
          style={{ backgroundColor: securityData.twoFactorEnabled ? COLORS.PRIMARY.BLUE : undefined }}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              securityData.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );




  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'security':
        return renderSecurityTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: COLORS.BACKGROUND.CONTENT }}>
      {/* Sidebar */}
      <Sidebar activeNav={activeNav} onNavChange={handleNavChange} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <Header title="Settings" />

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 cursor-pointer border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-transparent'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    style={activeTab === tab.id ? { borderColor: COLORS.PRIMARY.BLUE, color: COLORS.PRIMARY.BLUE } : undefined}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {renderTabContent()}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200">
              <Button variant="secondary" onClick={() => console.log('Cancel clicked')}>
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                loading={isSaving || updateProfileMutation.isPending || changePasswordMutation.isPending}
                disabled={isSaving || updateProfileMutation.isPending || changePasswordMutation.isPending}
              >
                {isSaving || updateProfileMutation.isPending || changePasswordMutation.isPending ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
