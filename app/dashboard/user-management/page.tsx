'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Sidebar from '../../../components/UI/Sidebar';
import Header from '../../../components/UI/Header';
import UserTable from '../../../components/UI/UserTable';
import SearchBar from '../../../components/UI/SearchBar';
import Dropdown from '../../../components/UI/Dropdown';
import { UserTableData } from '@/types';
import { USERS } from '@/data/users';
import { COLORS } from '@/constants';
import { useSearchParams, useRouter } from 'next/navigation';

const UserManagement: React.FC = () => {
  const [activeNav, setActiveNav] = useState('user-management');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'Therapist' | 'Patient'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Unrestricted' | 'Restricted' | 'Pending Verification'>('All');
  const [locationFilter, setLocationFilter] = useState<'All' | 'Lagos' | 'Abuja' | 'Kano'>('All');
  const [sortBy, setSortBy] = useState<'name' | 'lastLogin' | 'status'>('lastLogin');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const searchParams = useSearchParams();
  const router = useRouter();

  const mockUsers: UserTableData[] = USERS;

  // Hydrate filters from URL
  useEffect(() => {
    const q = searchParams.get('q');
    const role = searchParams.get('role') as 'Therapist' | 'Patient' | null;
    if (q) setSearchTerm(q);
    if (role) setRoleFilter(role);
  }, [searchParams]);

  const filteredUsers = useMemo(() => {
    let list = mockUsers.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.includes(searchTerm)
    );
    if (roleFilter !== 'All') list = list.filter(u => u.role === roleFilter);
    if (statusFilter !== 'All') list = list.filter(u => u.status === statusFilter);
    if (locationFilter !== 'All') list = list.filter(u => u.location === locationFilter);
    list.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortBy === 'name') return a.name.localeCompare(b.name) * dir;
      if (sortBy === 'status') return (a.status || '').localeCompare(b.status || '') * dir;
      return a.lastLogin.localeCompare(b.lastLogin) * dir;
    });
    return list;
  }, [mockUsers, searchTerm, roleFilter, statusFilter, locationFilter, sortBy, sortDir]);

  const handleAction = (userId: string, action?: string) => {
    console.log('Action performed on user:', userId, action);
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
            <div className="flex flex-wrap items-end gap-4">
              <div className="w-full sm:flex-1 min-w-0">
                <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search users..." />
              </div>
              <div className="w-full sm:w-44 min-w-0">
                <label className="block text-xs font-medium text-gray-600 mb-1">Role</label>
                <Dropdown
                  value={roleFilter}
                  onChange={(v) => setRoleFilter(v as any)}
                  options={[
                    { label: 'All', value: 'All' },
                    { label: 'Therapist', value: 'Therapist' },
                    { label: 'Patient', value: 'Patient' },
                  ]}
                />
              </div>
              <div className="w-full sm:w-44 min-w-0">
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <Dropdown
                  value={statusFilter}
                  onChange={(v) => setStatusFilter(v as any)}
                  options={[
                    { label: 'All', value: 'All' },
                    { label: 'Unrestricted', value: 'Unrestricted' },
                    { label: 'Restricted', value: 'Restricted' },
                    { label: 'Pending Verification', value: 'Pending Verification' },
                  ]}
                />
              </div>
              <div className="w-full sm:w-44 min-w-0">
                <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
                <Dropdown
                  value={locationFilter}
                  onChange={(v) => setLocationFilter(v as any)}
                  options={[
                    { label: 'All', value: 'All' },
                    { label: 'Lagos', value: 'Lagos' },
                    { label: 'Abuja', value: 'Abuja' },
                    { label: 'Kano', value: 'Kano' },
                  ]}
                />
              </div>
              <div className="w-full sm:w-44 min-w-0">
                <label className="block text-xs font-medium text-gray-600 mb-1">Sort By</label>
                <Dropdown
                  value={sortBy}
                  onChange={(v) => setSortBy(v as any)}
                  options={[
                    { label: 'Last Login', value: 'lastLogin' },
                    { label: 'Name', value: 'name' },
                    { label: 'Status', value: 'status' },
                  ]}
                />
              </div>
              <div className="w-full sm:w-36 min-w-0">
                <label className="block text-xs font-medium text-gray-600 mb-1">Direction</label>
                <Dropdown
                  value={sortDir}
                  onChange={(v) => setSortDir(v as any)}
                  options={[
                    { label: 'Desc', value: 'desc' },
                    { label: 'Asc', value: 'asc' },
                  ]}
                />
              </div>
              <div className="w-full sm:flex-1 min-w-0 flex items-center justify-start sm:justify-end">
                <span className="text-sm text-gray-600 mt-1 sm:mt-0">{filteredUsers.length} of {mockUsers.length} users</span>
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
