'use client';

import React, { useState } from 'react';
import Sidebar from '../../../components/UI/Sidebar';
import Header from '../../../components/UI/Header';
import UserTable from '../../../components/UI/UserTable';
import SearchBar from '../../../components/UI/SearchBar';
import { UserTableData } from '@/types';
import { COLORS } from '@/constants';

const UserManagement: React.FC = () => {
  const [activeNav, setActiveNav] = useState('user-management');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock user data matching the image description
  const mockUsers: UserTableData[] = [
    {
      id: '423',
      name: 'Apple Watch',
      email: 'exar@example.com',
      lastLogin: '2024-01-15 10:30',
      status: 'Unrestricted'
    },
    {
      id: '424',
      name: 'John Doe',
      email: 'john.doe@example.com',
      lastLogin: '2024-01-14 15:45',
      status: 'Restricted'
    },
    {
      id: '425',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      lastLogin: '2024-01-13 09:20',
      status: 'Unrestricted'
    },
    {
      id: '426',
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      lastLogin: '2024-01-12 14:15',
      status: 'Unrestricted'
    },
    {
      id: '427',
      name: 'Alice Brown',
      email: 'alice.brown@example.com',
      lastLogin: '2024-01-11 11:30',
      status: 'Restricted'
    },
    {
      id: '428',
      name: 'Charlie Wilson',
      email: 'charlie.wilson@example.com',
      lastLogin: '2024-01-10 16:20',
      status: 'Unrestricted'
    },
    {
      id: '429',
      name: 'Diana Davis',
      email: 'diana.davis@example.com',
      lastLogin: '2024-01-09 13:45',
      status: 'Restricted'
    }
  ];

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.includes(searchTerm)
  );

  const handleAction = (userId: string) => {
    console.log('Action performed on user:', userId);
  };

  const handleNavChange = (navId: string) => {
    setActiveNav(navId);
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: COLORS.BACKGROUND.CONTENT }}>
      {/* Sidebar */}
      <Sidebar activeNav={activeNav} onNavChange={handleNavChange} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header */}
        <Header title="User Management" />

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Search and Controls */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1 max-w-sm">
                <SearchBar
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search users..."
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {filteredUsers.length} of {mockUsers.length} users
                </span>
              </div>
            </div>
          </div>

          {/* User Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <UserTable users={filteredUsers} onAction={handleAction} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserManagement;
