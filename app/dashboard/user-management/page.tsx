'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Sidebar from '../../../components/UI/Sidebar';
import Header from '../../../components/UI/Header';
import UserTable from '../../../components/UI/UserTable';
import SearchBar from '../../../components/UI/SearchBar';
import Dropdown from '../../../components/UI/Dropdown';
import LoadingSpinner from '../../../components/UI/LoadingSpinner';
import { UserTableData, EditUserFormData } from '@/types';
import { User } from '@/lib/api/admin';
import { COLORS } from '@/constants';
import { useSearchParams } from 'next/navigation';
import { 
  useSearchTherapists, 
  useSearchPatients, 
  useAllPatients,
  useAllTherapists,
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

  // API hooks - Get all users (both therapists and patients)
  const { data: therapists, isLoading: isTherapistsLoading } = useSearchTherapists(
    searchTerm, 
    searchTerm.length > 0 && (roleFilter === 'Therapist' || roleFilter === 'All')
  );
  const { data: patients, isLoading: isPatientsLoading } = useSearchPatients(
    searchTerm, 
    searchTerm.length > 0 && (roleFilter === 'Patient' || roleFilter === 'All')
  );
  const { data: allPatients, isLoading: isAllPatientsLoading } = useAllPatients();
  const { data: allTherapists, isLoading: isAllTherapistsLoading } = useAllTherapists();

  // Mutation hooks
  const verifyTherapistMutation = useVerifyTherapist();
  const suspendUserMutation = useSuspendUser();
  const resetPasswordMutation = useResetUserPassword();
  const sendMessageMutation = useSendMessageToUser();
  const updateUserMutation = useUpdateUser();

  // Only show full-screen loading for initial data loading, not for search
  const isLoading = isAllPatientsLoading || isAllTherapistsLoading;
  const isSearching = isTherapistsLoading || isPatientsLoading;

  // Hydrate filters from URL
  useEffect(() => {
    const q = searchParams.get('q');
    const role = searchParams.get('role') as 'Therapist' | 'Patient' | null;
    if (q) setSearchTerm(q);
    if (role) setRoleFilter(role);
  }, [searchParams]);

  // Helper function to map therapist data to UserTableData
  const mapTherapistToUserTable = (therapist: User): UserTableData => {
    const therapistData = therapist as User & {
      specialization?: string;
      therapyField?: string;
      title?: string;
      experience?: string;
      consultationFee?: string;
    };
    
    return {
      id: therapistData.id || '',
      name: therapistData.fullName || '',
      email: therapistData.email || '',
      lastLogin: therapistData.lastLogin || 'Never',
      status: therapistData.active === 'true' ? 'Active' as const : 'Restricted' as const,
      role: 'Therapist' as const,
      location: therapistData.city || 'Unknown',
      phone: therapistData.phone || 'N/A',
      verificationStatus: therapistData.verificationStatus === 'verified' ? 'Verified' as const : 'Pending' as const,
      rating: therapistData.rating || 0,
      reviewsCount: therapistData.reviewsCount || 0,
      specialization: therapistData.specialization || 'General',
      therapyField: therapistData.therapyField || 'Not specified',
      title: therapistData.title || 'Therapist',
      experience: therapistData.experience || 'Not specified',
      consultationFee: therapistData.consultationFee || 'Not specified',
      activity: {
        bookings: 0,
        cancellations: 0,
      }
    };
  };

  // Helper function to map patient data to UserTableData
  const mapPatientToUserTable = (patient: User): UserTableData => {
    const patientData = patient as User & {
      address?: string;
      postalCode?: string;
    };
    
    return {
      id: patientData.id || '',
      name: patientData.fullName || '',
      email: patientData.email || '',
      lastLogin: patientData.lastLogin || 'Never',
      status: patientData.active === 'true' ? 'Active' as const : 'Restricted' as const,
      role: 'Patient' as const,
      location: patientData.city || 'Unknown',
      phone: patientData.phone || 'N/A',
      gender: patientData.gender || 'Not specified',
      country: patientData.country || 'Not specified',
      address: patientData.address || 'Not specified',
      postalCode: patientData.postalCode || 'Not specified',
      activity: {
        bookings: 0,
        cancellations: 0,
      }
    };
  };

  const filteredUsers = useMemo(() => {
    let list: UserTableData[] = [];

    // Get data based on search and role filter
    if (searchTerm.length > 0) {
      // Search mode - get specific results
      if (roleFilter === 'Therapist' && therapists) {
        list = therapists.map(mapTherapistToUserTable);
      } else if (roleFilter === 'Patient' && patients) {
        list = patients.map(mapPatientToUserTable);
      } else if (roleFilter === 'All') {
        // Search both therapists and patients when role filter is 'All'
        const therapistList = therapists ? therapists.map(mapTherapistToUserTable) : [];
        const patientList = patients ? patients.map(mapPatientToUserTable) : [];
        list = [...therapistList, ...patientList];
      }
    } else {
      // No search term - show all users based on role filter
      if (roleFilter === 'All') {
        // Combine all therapists and patients using separate APIs
        const therapistList = allTherapists ? allTherapists.map(mapTherapistToUserTable) : [];
        const patientList = allPatients ? allPatients.map(mapPatientToUserTable) : [];
        list = [...therapistList, ...patientList];
      } else if (roleFilter === 'Therapist' && allTherapists) {
        list = allTherapists.map(mapTherapistToUserTable);
      } else if (roleFilter === 'Patient' && allPatients) {
        list = allPatients.map(mapPatientToUserTable);
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
  }, [therapists, patients, allPatients, allTherapists, searchTerm, roleFilter, statusFilter, locationFilter, sortBy, sortDir]);

  const handleAction = async (userId: string, action?: string, data?: EditUserFormData) => {
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
            fullName: data?.name || user.name,
            email: data?.email || user.email,
            phone: data?.phone || user.phone || '',
            city: data?.location || user.location || '',
            country: data?.country || user.country || '',
            gender: data?.gender || user.gender || '',
            active: data?.status === 'Active' ? 'true' : 'false',
            userType: user.role?.toLowerCase() as 'therapist' | 'patient'
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
                <div className="relative">
                  <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search users..." />
                  {isSearching && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <LoadingSpinner size="sm" />
                    </div>
                  )}
                </div>
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
                <div className="flex items-center gap-2">
                  {isSearching && <LoadingSpinner size="sm" />}
                  <span className="text-sm text-gray-600 mt-1 sm:mt-0">
                    {filteredUsers.length} users
                  </span>
                </div>
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
