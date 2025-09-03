'use client';

import React, { useState } from 'react';
import { 
  FiUser,
  FiPackage,
  FiBarChart,
  FiRefreshCw
} from 'react-icons/fi';
import Sidebar from '../../components/UI/Sidebar';
import Header from '../../components/UI/Header';
import KPICard from '../../components/UI/KPICard';
import { KPIData } from '@/types';
import { COLORS } from '@/constants';

const Dashboard: React.FC = () => {
  const [activeNav, setActiveNav] = useState('dashboard');

  const kpiData: KPIData[] = [
    {
      title: 'Total User',
      value: '40,689',
      trend: '8.5% Up from yesterday',
      trendType: 'up',
      icon: FiUser,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Restricted Users',
      value: '10,293',
      trend: '1.3% Up from past week',
      trendType: 'up',
      icon: FiPackage,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    {
      title: 'Reports Generated',
      value: '$89,000',
      trend: '4.3% Down from yesterday',
      trendType: 'down',
      icon: FiBarChart,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Active Users',
      value: '2,040',
      trend: '1.8% Up from yesterday',
      trendType: 'up',
      icon: FiRefreshCw,
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    }
  ];

  const handleNavChange = (navId: string) => {
    setActiveNav(navId);
    console.log('Navigating to:', navId);
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
              />
            ))}
          </div>

          {/* Additional Content Area */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
            <p className="text-gray-500">No recent activity to display.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
