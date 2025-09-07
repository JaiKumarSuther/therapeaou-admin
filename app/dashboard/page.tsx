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
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { ActivityItem, KPIData } from '@/types';
import { COLORS } from '@/constants';
import { useRouter } from 'next/navigation';
import { 
  useNewRegisteredUsers, 
  useTotalTherapists,
  useTotalRevenue,
  useRecentActivity
} from '../../hooks/useAdminApi';

const Dashboard: React.FC = () => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const router = useRouter();

  // Fetch dashboard data using React Query hooks
  const { data: newRegisteredUsers, isLoading: isNewUsersLoading } = useNewRegisteredUsers();
  const { data: totalTherapists, isLoading: isTherapistsLoading } = useTotalTherapists();
  const { data: totalRevenue, isLoading: isRevenueLoading } = useTotalRevenue();
  const { data: recentActivity } = useRecentActivity(10);

  const isLoading = isNewUsersLoading || isTherapistsLoading || isRevenueLoading;

  const kpiData: KPIData[] = useMemo(() => [
    {
      title: 'New Therapists (Weekly)',
      value: newRegisteredUsers?.filter(user => user.role === 'therapist').length?.toString() || '0',
      icon: FiUserPlus,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      onClickPath: '/dashboard/user-management?role=Therapist&filter=new&range=weekly'
    },
    {
      title: 'New Patients',
      value: newRegisteredUsers?.filter(user => user.role === 'patient').length?.toString() || '0',
      icon: FiUsers,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      onClickPath: '/dashboard/user-management?role=Patient&filter=new'
    },
    {
      title: 'Total Therapists',
      value: totalTherapists?.toString() || '0',
      icon: FiCheckCircle,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      onClickPath: '/dashboard/reporting?type=patient&metric=bookings'
    },
    {
      title: 'Total Revenue',
      value: totalRevenue ? `$${totalRevenue.toLocaleString()}` : '$0',
      icon: FiDollarSign,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      onClickPath: '/dashboard/reporting?type=financial'
    }
  ], [newRegisteredUsers, totalTherapists, totalRevenue]);

  const activities: ActivityItem[] = useMemo(() => {
    if (recentActivity && recentActivity.length > 0) {
      console.log('Using API data for recent activity:', recentActivity);
      return recentActivity.map((activity, index) => {
        // Create a flexible mapping that handles any activity structure
        const mappedActivity: ActivityItem = {
          id: activity.id || `activity-${index}`,
          type: activity.type || 'unknown',
          description: activity.description || activity.message || 'Activity occurred',
          createdAt: activity.createdAt || activity.timestamp || new Date().toISOString(),
          actor: activity.actor,
          meta: {
            ...activity.meta,
            // Include any additional fields from the API response
            ...Object.keys(activity).reduce((acc, key) => {
              if (!['id', 'type', 'description', 'message', 'createdAt', 'timestamp', 'actor', 'meta'].includes(key)) {
                acc[key] = activity[key];
              }
              return acc;
            }, {} as Record<string, unknown>)
          }
        };
        
        return mappedActivity;
      });
    }
    
    // Return empty array when no real data is available
    console.log('No recent activity data available from API');
    return [];
  }, [recentActivity]);

  const handleNavChange = (navId: string) => {
    setActiveNav(navId);
    console.log('Navigating to:', navId);
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
          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {kpiData.map((kpi, index) => (
              <KPICard
                key={index}
                title={kpi.title}
                value={kpi.value}
                icon={kpi.icon}
                iconBg={kpi.iconBg}
                iconColor={kpi.iconColor}
                onClick={kpi.onClickPath ? () => router.push(kpi.onClickPath!) : undefined}
              />
            ))}
          </div>

          {/* Additional Content Area */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Recent Activity</h2>
              {activities.length > 0 && (
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {activities.length} {activities.length === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>
            {activities.length > 0 ? (
              <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                <ul className="divide-y divide-gray-200">
                  {activities.map((act) => (
                    <li key={act.id} className="py-3 sm:py-4 flex items-start justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 break-words">{act.description}</p>
                        <p className="text-xs text-gray-500 mt-1 break-words">{act.createdAt}{act.actor ? ` · ${act.actor}` : ''}{act.meta?.role ? ` · ${act.meta.role}` : ''}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                {activities.length > 8 && (
                  <div className="text-center py-2 text-xs text-gray-400 border-t border-gray-100">
                    Scroll to see more activities
                  </div>
                )}
              </div>
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
