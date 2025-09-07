'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Sidebar from '../../../components/UI/Sidebar';
import Header from '../../../components/UI/Header';
import UserTable from '../../../components/UI/UserTable';
import SearchBar from '../../../components/UI/SearchBar';
import Dropdown from '../../../components/UI/Dropdown';
import LoadingSpinner from '../../../components/UI/LoadingSpinner';
import { UserTableData } from '@/types';
import { USERS } from '@/data/users';
import { COLORS } from '@/constants';
import { useSearchParams } from 'next/navigation';
import { 
  useSearchTherapists, 
  useSearchPatients, 
  useAllPatients,
  useVerifyTherapist,
  useSuspendUser,
  useResetUserPassword,
  useSendMessageToUser,
  useUpdateUser
} from '../../../hooks/useAdminApi';

const UserManagement: React.FC = () => {
  const [activeNav, setActiveNav] = useState('user-management');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'Therapist' | 'Patient'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Restricted' | 'Pending Verification'>('All');
  const [locationFilter, setLocationFilter] = useState<'All' | 'Lagos' | 'Abuja' | 'Kano'>('All');
  const [sortBy, setSortBy] = useState<'name' | 'lastLogin' | 'status'>('lastLogin');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const searchParams = useSearchParams();

  // API hooks
  const { data: therapists, isLoading: isTherapistsLoading } = useSearchTherapists(
    searchTerm, 
    searchTerm.length > 0 && roleFilter === 'Therapist'
  );
  const { data: patients, isLoading: isPatientsLoading } = useSearchPatients(
    searchTerm, 
    searchTerm.length > 0 && roleFilter === 'Patient'
  );
  const { data: allPatients, isLoading: isAllPatientsLoading } = useAllPatients();

  // Mutation hooks
  const verifyTherapistMutation = useVerifyTherapist();
  const suspendUserMutation = useSuspendUser();
  const resetPasswordMutation = useResetUserPassword();
  const sendMessageMutation = useSendMessageToUser();
  const updateUserMutation = useUpdateUser();

  const isLoading = isTherapistsLoading || isPatientsLoading || isAllPatientsLoading;

  // Hydrate filters from URL
  useEffect(() => {
    const q = searchParams.get('q');
    const role = searchParams.get('role') as 'Therapist' | 'Patient' | null;
    if (q) setSearchTerm(q);
    if (role) setRoleFilter(role);
  }, [searchParams]);

  const filteredUsers = useMemo(() => {
    let list: UserTableData[] = [];

    // Get data based on search and role filter
    if (searchTerm.length > 0) {
      if (roleFilter === 'Therapist' && therapists) {
        list = therapists.map(user => ({
          id: user.id,
          name: user.fullName,
          email: user.email,
          lastLogin: user.lastLogin || 'Never',
          status: user.active === 'true' ? 'Active' : 'Restricted',
          role: 'Therapist' as const,
          location: user.city || 'Unknown',
          phone: user.phone,
          verificationStatus: user.verificationStatus === 'verified' ? 'Verified' : 'Pending',
          rating: user.rating,
          reviewsCount: user.reviewsCount,
          activity: {
            bookings: 0,
            cancellations: 0,
          }
        }));
      } else if (roleFilter === 'Patient' && patients) {
        list = patients.map(user => ({
          id: user.id,
          name: user.fullName,
          email: user.email,
          lastLogin: user.lastLogin || 'Never',
          status: user.active === 'true' ? 'Active' : 'Restricted',
          role: 'Patient' as const,
          location: user.city || 'Unknown',
          phone: user.phone,
          activity: {
            bookings: 0,
            cancellations: 0,
          }
        }));
      }
    } else {
      // Show all patients when no search term
      if (allPatients) {
        list = allPatients.map(user => ({
          id: user.id,
          name: user.fullName,
          email: user.email,
          lastLogin: user.lastLogin || 'Never',
          status: user.active === 'true' ? 'Active' : 'Restricted',
          role: 'Patient' as const,
          location: user.city || 'Unknown',
          phone: user.phone,
          activity: {
            bookings: 0,
            cancellations: 0,
          }
        }));
      }
    }

    // Apply additional filters
    if (statusFilter !== 'All') {
      list = list.filter(u => u.status === statusFilter);
    }
    if (locationFilter !== 'All') {
      list = list.filter(u => u.location === locationFilter);
    }

    // Sort
    list.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortBy === 'name') return a.name.localeCompare(b.name) * dir;
      if (sortBy === 'status') return (a.status || '').localeCompare(b.status || '') * dir;
      return a.lastLogin.localeCompare(b.lastLogin) * dir;
    });

    return list;
  }, [therapists, patients, allPatients, searchTerm, roleFilter, statusFilter, locationFilter, sortBy, sortDir]);

  const handleAction = async (userId: string, action?: string, data?: any) => {
    console.log('handleAction called with:', { userId, action });
    const user = filteredUsers.find(u => u.id === userId);
    if (!user) {
      console.log('User not found:', userId);
      return;
    }
    console.log('User found:', user);

    try {
      switch (action) {
        case 'verify':
          console.log('Verifying therapist:', userId);
          if (user.role === 'Therapist') {
            await verifyTherapistMutation.mutateAsync({
              therapistId: userId,
              verified: true
            });
          }
          break;
        case 'suspend':
          console.log('Suspending user:', userId);
          await suspendUserMutation.mutateAsync({
            userId: userId,
            userType: (user.role || 'patient').toLowerCase() as 'therapist' | 'patient',
            suspended: true,
            reason: 'Admin action'
          });
          break;
        case 'unsuspend':
          await suspendUserMutation.mutateAsync({
            userId: userId,
            userType: (user.role || 'patient').toLowerCase() as 'therapist' | 'patient',
            suspended: false
          });
          break;
        case 'reset-password':
          await resetPasswordMutation.mutateAsync({
            userId: userId,
            userType: (user.role || 'patient').toLowerCase() as 'therapist' | 'patient',
            newPassword: 'newpassword123'
          });
          break;
        case 'send-message':
          await sendMessageMutation.mutateAsync({
            userId: userId,
            userType: (user.role || 'patient').toLowerCase() as 'therapist' | 'patient',
            messageType: 'email',
            subject: 'Important Notice',
            message: 'This is an important message from admin.'
          });
          break;
        case 'save':
          console.log('Saving user changes for:', userId, data);
          // Use the form data passed from the UserTable component
          const updatedUserData = {
            id: userId,
            fullName: data.name || user.name,
            email: data.email || user.email,
            phone: data.phone || user.phone || '',
            city: data.location || user.location || '',
            country: '', // Not available in current data structure
            gender: '', // Not available in current data structure
            active: data.status === 'Active' ? 'true' : 'false'
          };
          
          await updateUserMutation.mutateAsync(updatedUserData);
          break;
        default:
          console.log('Action performed on user:', userId, action);
      }
    } catch (error) {
      console.error('Error performing action:', error);
    }
  };

  const handleNavChange = (navId: string) => {
    setActiveNav(navId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.BACKGROUND.CONTENT }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

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
                  onChange={(v) => setRoleFilter(v as 'All' | 'Therapist' | 'Patient')}
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
                  onChange={(v) => setStatusFilter(v as 'All' | 'Active' | 'Restricted' | 'Pending Verification')}
                  options={[
                    { label: 'All', value: 'All' },
                    { label: 'Active', value: 'Active' },
                    { label: 'Restricted', value: 'Restricted' },
                    { label: 'Pending Verification', value: 'Pending Verification' },
                  ]}
                />
              </div>
              <div className="w-full sm:w-44 min-w-0">
                <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
                <Dropdown
                  value={locationFilter}
                  onChange={(v) => setLocationFilter(v as 'All' | 'Lagos' | 'Abuja' | 'Kano')}
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
                  onChange={(v) => setSortBy(v as 'name' | 'lastLogin' | 'status')}
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
                  onChange={(v) => setSortDir(v as 'asc' | 'desc')}
                  options={[
                    { label: 'Desc', value: 'desc' },
                    { label: 'Asc', value: 'asc' },
                  ]}
                />
              </div>
              <div className="w-full sm:flex-1 min-w-0 flex items-center justify-start sm:justify-end">
                <span className="text-sm text-gray-600 mt-1 sm:mt-0">{filteredUsers.length} users</span>
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
