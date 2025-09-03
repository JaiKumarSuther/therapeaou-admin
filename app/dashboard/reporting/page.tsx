'use client';

import React, { useState } from 'react';
import {
  FiUsers,
  FiPackage,
  FiTrendingUp
} from 'react-icons/fi';
import Sidebar from '../../../components/UI/Sidebar';
import Header from '../../../components/UI/Header';
import ReportCard from '../../../components/UI/ReportCard';
import { ReportData } from '@/types';
import { COLORS } from '@/constants';

const Reporting: React.FC = () => {
  const [activeNav, setActiveNav] = useState('reporting');

  const reportData: ReportData[] = [
    {
      title: 'Unrestricted Users',
      value: '40,689',
      icon: FiUsers,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Restricted Users',
      value: '10,293',
      icon: FiPackage,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    {
      title: 'User Activity Report',
      value: '$89,000',
      icon: FiTrendingUp,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    }
  ];

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
        <Header title="Reporting" />

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Report Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {reportData.map((report, index) => (
              <ReportCard
                key={index}
                title={report.title}
                value={report.value}
                icon={report.icon}
                iconBg={report.iconBg}
                iconColor={report.iconColor}
              />
            ))}
          </div>

          {/* Additional Content Area */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Report History</h2>
            <p className="text-gray-500">No recent reports to display.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reporting;
