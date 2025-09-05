'use client';

import React, { useMemo, useState } from 'react';
import {
  FiUsers,
  FiPackage,
  FiTrendingUp
} from 'react-icons/fi';
import Sidebar from '../../../components/UI/Sidebar';
import Header from '../../../components/UI/Header';
import ReportCard from '../../../components/UI/ReportCard';
import Dropdown from '../../../components/UI/Dropdown';
import { ReportData, ReportHistoryItem } from '@/types';
import { COLORS } from '@/constants';

const Reporting: React.FC = () => {
  const [activeNav, setActiveNav] = useState('reporting');
  const [roleFilter, setRoleFilter] = useState<'All' | 'Therapist' | 'Patient'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Restricted'>('All');
  const [locationFilter, setLocationFilter] = useState<'All' | 'Lagos' | 'Abuja' | 'Kano'>('All');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  const reportData: ReportData[] = [
    {
      title: 'Therapist Activity',
      value: 'Sessions 2,134 · Cancels 84 · Rating 4.6',
      icon: FiUsers,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      type: 'therapist'
    },
    {
      title: 'Patient Activity',
      value: 'Bookings 3,420 · Cancels 132 · Reviews 980',
      icon: FiPackage,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      type: 'patient'
    },
    {
      title: 'Financial Activity',
      value: 'Payments $120k · Refunds $4.2k · Commission $18k',
      icon: FiTrendingUp,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      type: 'financial'
    }
  ];

  const reportHistory: ReportHistoryItem[] = useMemo(() => ([
    { id: 'rh1', type: 'Therapist Activity', createdAt: '2024-01-15 11:10', createdBy: 'Admin James' },
    { id: 'rh2', type: 'Patient Activity', createdAt: '2024-01-14 16:05', createdBy: 'Admin Mary' },
    { id: 'rh3', type: 'Financial Activity', createdAt: '2024-01-14 10:45', createdBy: 'Admin James' },
  ]), []);

  const handleNavChange = (navId: string) => {
    setActiveNav(navId);
  };

  const handleDownload = (reportType: string) => {
    console.log('Downloading report:', reportType, { roleFilter, statusFilter, locationFilter, dateFrom, dateTo });
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
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
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
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                <Dropdown
                  value={statusFilter}
                  onChange={(v) => setStatusFilter(v as any)}
                  options={[
                    { label: 'All', value: 'All' },
                    { label: 'Active', value: 'Active' },
                    { label: 'Restricted', value: 'Restricted' },
                  ]}
                />
              </div>
              <div>
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
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">From</label>
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">To</label>
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none" />
              </div>
            </div>
          </div>
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
                onDownload={() => handleDownload(report.type || 'summary')}
              />
            ))}
          </div>

          {/* Report History */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Report History</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generated By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportHistory.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.createdAt}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.createdBy}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button onClick={() => console.log('Download history item', item.id)} className="text-[#3C5671] hover:opacity-80">Download</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reporting;
