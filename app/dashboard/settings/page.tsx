'use client';

import React, { useState } from 'react';
import { 
  FiUser, 
  FiShield, 
  FiBell, 
  FiGlobe, 
  FiDatabase
} from 'react-icons/fi';
import Sidebar from '../../../components/UI/Sidebar';
import Header from '../../../components/UI/Header';
import Button from '../../../components/UI/Button';
import Input from '../../../components/UI/Input';
import { COLORS } from '@/constants';

const Settings: React.FC = () => {
  const [activeNav, setActiveNav] = useState('settings');
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [profileData, setProfileData] = useState({
    firstName: 'Jai',
    lastName: 'Kumar',
    email: 'iamjaisuthar@gmail.com',
    phone: '+923102187976',
    timezone: 'UTC-5 (Eastern Time)'
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true
  });

  const [notificationData, setNotificationData] = useState({
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true,
    securityAlerts: true
  });

  const handleNavChange = (navId: string) => {
    setActiveNav(navId);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    console.log('Settings saved successfully');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'security', label: 'Security', icon: FiShield },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'preferences', label: 'Preferences', icon: FiGlobe },
    { id: 'data', label: 'Data & Privacy', icon: FiDatabase }
  ];

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="First Name"
          value={profileData.firstName}
          onChange={(value) => setProfileData({ ...profileData, firstName: value })}
          placeholder="Enter first name"
        />
        <Input
          label="Last Name"
          value={profileData.lastName}
          onChange={(value) => setProfileData({ ...profileData, lastName: value })}
          placeholder="Enter last name"
        />
      </div>
      <Input
        label="Email Address"
        type="email"
        value={profileData.email}
        onChange={(value) => setProfileData({ ...profileData, email: value })}
        placeholder="Enter email address"
      />
      <Input
        label="Phone Number"
        type="tel"
        value={profileData.phone}
        onChange={(value) => setProfileData({ ...profileData, phone: value })}
        placeholder="Enter phone number"
      />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Timezone
        </label>
        <select
          value={profileData.timezone}
          onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--ring-color] focus:border-[--ring-color]"
          style={{ '--ring-color': COLORS.PRIMARY.LIGHT_BLUE } as React.CSSProperties}
        >
          <option value="UTC-5 (Eastern Time)">UTC-5 (Eastern Time)</option>
          <option value="UTC-6 (Central Time)">UTC-6 (Central Time)</option>
          <option value="UTC-7 (Mountain Time)">UTC-7 (Mountain Time)</option>
          <option value="UTC-8 (Pacific Time)">UTC-8 (Pacific Time)</option>
        </select>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <Input
        label="Current Password"
        type="password"
        value={securityData.currentPassword}
        onChange={(value) => setSecurityData({ ...securityData, currentPassword: value })}
        placeholder="Enter current password"
      />
      <Input
        label="New Password"
        type="password"
        value={securityData.newPassword}
        onChange={(value) => setSecurityData({ ...securityData, newPassword: value })}
        placeholder="Enter new password"
      />
      <Input
        label="Confirm New Password"
        type="password"
        value={securityData.confirmPassword}
        onChange={(value) => setSecurityData({ ...securityData, confirmPassword: value })}
        placeholder="Confirm new password"
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

  const renderNotificationsTab = () => (
    <div className="space-y-4">
      {Object.entries(notificationData).map(([key, value]) => (
        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <h3 className="text-sm font-medium text-gray-900">
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </h3>
            <p className="text-sm text-gray-500">
              Receive notifications for {key.toLowerCase().replace(/([A-Z])/g, ' $1')}
            </p>
          </div>
          <button
            onClick={() => setNotificationData({ ...notificationData, [key]: !value })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              value ? '' : 'bg-gray-200'
            }`}
            style={{ backgroundColor: value ? COLORS.PRIMARY.BLUE : undefined }}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                value ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      ))}
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Language
        </label>
        <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--ring-color] focus:border-[--ring-color]" style={{ '--ring-color': COLORS.PRIMARY.LIGHT_BLUE } as React.CSSProperties}>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Theme
        </label>
        <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--ring-color] focus:border-[--ring-color]" style={{ '--ring-color': COLORS.PRIMARY.LIGHT_BLUE } as React.CSSProperties}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date Format
        </label>
        <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[--ring-color] focus:border-[--ring-color]" style={{ '--ring-color': COLORS.PRIMARY.LIGHT_BLUE } as React.CSSProperties}>
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
        </select>
      </div>
    </div>
  );

  const renderDataTab = () => (
    <div className="space-y-6">
      <div className="p-4 rounded-lg" style={{ backgroundColor: '#EDF3F7' }}>
        <h3 className="text-sm font-medium mb-2" style={{ color: COLORS.PRIMARY.DARK_BLUE }}>Data Export</h3>
        <p className="text-sm mb-4" style={{ color: COLORS.PRIMARY.LIGHT_BLUE }}>
          Download a copy of your data including profile information, activity logs, and preferences.
        </p>
        <Button variant="outline" size="sm">
          Export Data
        </Button>
      </div>
      <div className="p-4 bg-red-50 rounded-lg">
        <h3 className="text-sm font-medium text-red-900 mb-2">Delete Account</h3>
        <p className="text-sm text-red-700 mb-4">
          Permanently delete your account and all associated data. This action cannot be undone.
        </p>
        <Button variant="danger" size="sm">
          Delete Account
        </Button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'security':
        return renderSecurityTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'preferences':
        return renderPreferencesTab();
      case 'data':
        return renderDataTab();
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
              <Button onClick={handleSave} loading={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
