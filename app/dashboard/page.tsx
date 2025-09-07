'use client';

import React, { useMemo, useState } from 'react';
import { 
  FiUserPlus,
  FiUsers,
  FiCheckCircle,
  FiDollarSign
} from 'react-icons/fi';
import Sidebar from '../../components/UI/Sidebar';
import Header from '../../components/UI/Header';
import KPICard from '../../components/UI/KPICard';
import SearchBar from '../../components/UI/SearchBar';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { ActivityItem, KPIData } from '@/types';
import { COLORS } from '@/constants';
import { useRouter } from 'next/navigation';
import { 
  useDashboardData, 
  useNewRegisteredUsers, 
  useTotalPremium, 
  useTotalPlatinum,
  useTotalUsers,
  useTotalTherapists,
  useTotalPatients,
  useTotalRevenue,
  useMonthlyRevenue,
  useRecentActivity
} from '../../hooks/useAdminApi';

const Dashboard: React.FC = () => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [search, setSearch] = useState('');
  const router = useRouter();

  // Fetch dashboard data using React Query hooks
  const { data: dashboardData, isLoading: isDashboardLoading } = useDashboardData();
  const { data: newRegisteredUsers, isLoading: isNewUsersLoading } = useNewRegisteredUsers();
  const { data: totalPremium, isLoading: isPremiumLoading } = useTotalPremium();
  const { data: totalPlatinum, isLoading: isPlatinumLoading } = useTotalPlatinum();
  const { data: totalUsers, isLoading: isUsersLoading } = useTotalUsers();
  const { data: totalTherapists, isLoading: isTherapistsLoading } = useTotalTherapists();
  const { data: totalPatients, isLoading: isPatientsLoading } = useTotalPatients();
  const { data: totalRevenue, isLoading: isRevenueLoading } = useTotalRevenue();
  const { data: monthlyRevenue, isLoading: isMonthlyRevenueLoading } = useMonthlyRevenue();
  const { data: recentActivity, isLoading: isActivityLoading } = useRecentActivity(10);

  const isLoading = isDashboardLoading || isNewUsersLoading || isPremiumLoading || 
                   isPlatinumLoading || isUsersLoading || isTherapistsLoading || 
                   isPatientsLoading || isRevenueLoading || isMonthlyRevenueLoading;

  const kpiData: KPIData[] = useMemo(() => [
    {
      title: 'New Therapists (Weekly)',
      value: newRegisteredUsers?.filter(user => user.role === 'therapist').length?.toString() || '0',
      trend: '5.2% Up from last week',
      trendType: 'up',
      icon: FiUserPlus,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      onClickPath: '/dashboard/user-management?role=Therapist&filter=new&range=weekly'
    },
    {
      title: 'New Patients',
      value: newRegisteredUsers?.filter(user => user.role === 'patient').length?.toString() || '0',
      trend: '2.1% Up from yesterday',
      trendType: 'up',
      icon: FiUsers,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      onClickPath: '/dashboard/user-management?role=Patient&filter=new'
    },
    {
      title: 'Total Therapists',
      value: totalTherapists?.toString() || '0',
      trend: '1.3% Up from past week',
      trendType: 'up',
      icon: FiCheckCircle,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      onClickPath: '/dashboard/reporting?type=patient&metric=bookings'
    },
    {
      title: 'Total Revenue',
      value: totalRevenue ? `$${totalRevenue.toLocaleString()}` : '$0',
      trend: '4.3% Up from yesterday',
      trendType: 'up',
      icon: FiDollarSign,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      onClickPath: '/dashboard/reporting?type=financial'
    }
  ], [newRegisteredUsers, totalTherapists, totalRevenue]);

  const activities: ActivityItem[] = useMemo(() => {
    if (recentActivity && recentActivity.length > 0) {
      console.log('Using API data for recent activity:', recentActivity);
      return recentActivity.map(activity => ({
        id: activity.id,
        type: activity.type,
        description: activity.description,
        createdAt: activity.createdAt,
        actor: activity.actor,
        meta: activity.meta
      }));
    }
    
    // Return empty array when no real data is available
    console.log('No recent activity data available from API');
    return [];
  }, [recentActivity]);

  const handleNavChange = (navId: string) => {
    setActiveNav(navId);
    console.log('Navigating to:', navId);
  };

  const handleSearchSubmit = () => {
    if (!search.trim()) return;
    const params = new URLSearchParams({ q: search.trim() });
    router.push(`/dashboard/user-management?${params.toString()}`);
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
        <Header title="Dashboard" />

        {/* Dashboard Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Top Search */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 max-w-xl">
                <SearchBar value={search} onChange={setSearch} placeholder="Search users by name, ID, or email..." />
              </div>
              <button
                onClick={handleSearchSubmit}
                className="px-4 py-2 rounded-md text-white text-sm font-medium"
                style={{ backgroundColor: COLORS.PRIMARY.BLUE }}
              >
                Search
              </button>
            </div>
          </div>
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {kpiData.map((kpi, index) => (
              <KPICard
                key={index}
                title={kpi.title}
                value={kpi.value}
                trend={kpi.trend}
                trendType={kpi.trendType}
                icon={kpi.icon}
                iconBg={kpi.iconBg}
                iconColor={kpi.iconColor}
                onClick={kpi.onClickPath ? () => router.push(kpi.onClickPath!) : undefined}
              />
            ))}
          </div>

          {/* Additional Content Area */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
            {activities.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {activities.map((act) => (
                  <li key={act.id} className="py-3 sm:py-4 flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-900">{act.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{act.createdAt}{act.actor ? ` · ${act.actor}` : ''}{act.meta?.role ? ` · ${act.meta.role}` : ''}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No recent activity data available</p>
                <p className="text-gray-400 text-xs mt-1">Activity data will appear here when available</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
