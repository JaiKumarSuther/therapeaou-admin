'use client';

import React, { useMemo, useState } from 'react';
import { 
  FiUser,
  FiPackage,
  FiBarChart,
  FiRefreshCw,
  FiUserPlus,
  FiUsers,
  FiCheckCircle,
  FiDollarSign
} from 'react-icons/fi';
import Sidebar from '../../components/UI/Sidebar';
import Header from '../../components/UI/Header';
import KPICard from '../../components/UI/KPICard';
import SearchBar from '../../components/UI/SearchBar';
import { ActivityItem, KPIData } from '@/types';
import { COLORS } from '@/constants';
import { useRouter } from 'next/navigation';

const Dashboard: React.FC = () => {
  const [activeNav, setActiveNav] = useState('dashboard');
  const [search, setSearch] = useState('');
  const router = useRouter();

  const kpiData: KPIData[] = [
    {
      title: 'New Therapists (Weekly)',
      value: '42',
      trend: '5.2% Up from last week',
      trendType: 'up',
      icon: FiUserPlus,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      onClickPath: '/dashboard/user-management?role=Therapist&filter=new&range=weekly'
    },
    {
      title: 'New Patients',
      value: '318',
      trend: '2.1% Up from yesterday',
      trendType: 'up',
      icon: FiUsers,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      onClickPath: '/dashboard/user-management?role=Patient&filter=new'
    },
    {
      title: 'Successful Bookings',
      value: '1,204',
      trend: '1.3% Up from past week',
      trendType: 'up',
      icon: FiCheckCircle,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      onClickPath: '/dashboard/reporting?type=patient&metric=bookings'
    },
    {
      title: 'Revenue',
      value: '$89,000',
      trend: '4.3% Up from yesterday',
      trendType: 'up',
      icon: FiDollarSign,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      onClickPath: '/dashboard/reporting?type=financial'
    }
  ];

  const activities: ActivityItem[] = useMemo(() => ([
    {
      id: 'a1',
      type: 'registration',
      description: 'New therapist registered: Dr. Emily Clark',
      createdAt: '2024-01-15 10:45',
      actor: 'system',
      meta: { role: 'Therapist' }
    },
    {
      id: 'a2',
      type: 'registration',
      description: 'New patient registered: John Walker',
      createdAt: '2024-01-15 09:30',
      actor: 'system',
      meta: { role: 'Patient' }
    },
    {
      id: 'a3',
      type: 'therapist_verification',
      description: 'Therapist verification approved: Dr. Aisha Rahman',
      createdAt: '2024-01-14 17:05',
      actor: 'Admin Mary'
    },
    {
      id: 'a4',
      type: 'restriction_change',
      description: 'User 427 was restricted',
      createdAt: '2024-01-14 16:10',
      actor: 'Admin James'
    },
    {
      id: 'a5',
      type: 'payment',
      description: 'Payment processed: $120 for booking #B-10293',
      createdAt: '2024-01-14 15:20',
      actor: 'system'
    },
    {
      id: 'a6',
      type: 'dispute',
      description: 'Dispute opened for refund on booking #B-10280',
      createdAt: '2024-01-14 12:42',
      actor: 'system'
    }
  ]), []);

  const handleNavChange = (navId: string) => {
    setActiveNav(navId);
    console.log('Navigating to:', navId);
  };

  const handleSearchSubmit = () => {
    if (!search.trim()) return;
    const params = new URLSearchParams({ q: search.trim() });
    router.push(`/dashboard/user-management?${params.toString()}`);
  };

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
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
