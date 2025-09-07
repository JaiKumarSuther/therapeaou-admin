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
import LoadingSpinner from '../../../components/UI/LoadingSpinner';
import { ReportData } from '@/types';
import { COLORS } from '@/constants';
import { 
  useTherapistActivityReport, 
  usePatientActivityReport, 
  useFinancialActivityReport, 
  useReportHistory 
} from '../../../hooks/useAdminApi';

const Reporting: React.FC = () => {
  const [activeNav, setActiveNav] = useState('reporting');
  const [roleFilter, setRoleFilter] = useState<'All' | 'Therapist' | 'Patient'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Restricted'>('All');
  const [locationFilter, setLocationFilter] = useState<'All' | 'Lagos' | 'Abuja' | 'Kano'>('All');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  // API calls for reporting data
  const { data: therapistReport, isLoading: isTherapistLoading } = useTherapistActivityReport({
    from: dateFrom || '2024-01-01',
    to: dateTo || '2024-12-31',
    status: statusFilter === 'All' ? undefined : statusFilter.toLowerCase(),
    location: locationFilter === 'All' ? undefined : locationFilter
  });

  const { data: patientReport, isLoading: isPatientLoading } = usePatientActivityReport({
    from: dateFrom || '2024-01-01',
    to: dateTo || '2024-12-31',
    status: statusFilter === 'All' ? undefined : statusFilter.toLowerCase(),
    location: locationFilter === 'All' ? undefined : locationFilter
  });

  const { data: financialReport, isLoading: isFinancialLoading } = useFinancialActivityReport({
    from: dateFrom || '2024-01-01',
    to: dateTo || '2024-12-31'
  });

  const { data: reportHistory, isLoading: isHistoryLoading } = useReportHistory();

  // Transform report history data to match expected format
  const transformedReportHistory = useMemo(() => {
    if (!reportHistory || reportHistory.length === 0) return [];
    
    return reportHistory.map((item) => ({
      id: item.id,
      type: item.type || item.reportType || 'Unknown Report',
      createdAt: item.createdAt || item.generatedAt || new Date().toISOString(),
      createdBy: item.createdBy || item.generatedBy || 'Unknown',
      fileUrl: item.fileUrl,
      status: item.status,
      // Include any additional fields
      ...Object.keys(item).reduce((acc, key) => {
        if (!['id', 'type', 'reportType', 'createdAt', 'generatedAt', 'createdBy', 'generatedBy', 'fileUrl', 'status'].includes(key)) {
          acc[key] = item[key];
        }
        return acc;
      }, {} as Record<string, unknown>)
    }));
  }, [reportHistory]);

  const isLoading = isTherapistLoading || isPatientLoading || isFinancialLoading || isHistoryLoading;

  const reportData: ReportData[] = useMemo(() => {
    // Calculate totals from arrays
    const therapistTotals = therapistReport ? {
      totalSessions: therapistReport.reduce((sum, report) => sum + (report.sessionsCompleted || 0), 0),
      totalCancellations: therapistReport.reduce((sum, report) => sum + (report.cancellations || 0), 0),
      averageRating: therapistReport.length > 0 ? 
        therapistReport.reduce((sum, report) => sum + (report.averageRating || 0), 0) / therapistReport.length : 0
    } : null;

    const patientTotals = patientReport ? {
      totalBookings: patientReport.reduce((sum, report) => sum + (report.bookings || 0), 0),
      totalCancellations: patientReport.reduce((sum, report) => sum + (report.cancellations || 0), 0),
      totalReviews: patientReport.reduce((sum, report) => sum + (report.reviews || 0), 0)
    } : null;

    const financialTotals = financialReport ? {
      totalPayments: financialReport.reduce((sum, report) => sum + (report.payments || 0), 0),
      totalRefunds: financialReport.reduce((sum, report) => sum + (report.refunds || 0), 0),
      totalCommission: financialReport.reduce((sum, report) => sum + (report.commission || 0), 0)
    } : null;

    return [
      {
        title: 'Therapist Activity',
        value: therapistTotals ? 
          `Sessions ${therapistTotals.totalSessions} · Cancels ${therapistTotals.totalCancellations} · Rating ${therapistTotals.averageRating.toFixed(1)}` :
          'Loading...',
        icon: FiUsers,
        iconBg: 'bg-purple-100',
        iconColor: 'text-purple-600',
        type: 'therapist'
      },
      {
        title: 'Patient Activity',
        value: patientTotals ? 
          `Bookings ${patientTotals.totalBookings} · Cancels ${patientTotals.totalCancellations} · Reviews ${patientTotals.totalReviews}` :
          'Loading...',
        icon: FiPackage,
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        type: 'patient'
      },
      {
        title: 'Financial Activity',
        value: financialTotals ? 
          `Payments $${financialTotals.totalPayments.toLocaleString()} · Refunds $${financialTotals.totalRefunds.toLocaleString()} · Commission $${financialTotals.totalCommission.toLocaleString()}` :
          'Loading...',
        icon: FiTrendingUp,
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        type: 'financial'
      }
    ];
  }, [therapistReport, patientReport, financialReport]);

  const handleNavChange = (navId: string) => {
    setActiveNav(navId);
  };

  const handleDownload = (reportType: string) => {
    console.log('Downloading report:', reportType, { roleFilter, statusFilter, locationFilter, dateFrom, dateTo });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex" style={{ backgroundColor: COLORS.BACKGROUND.CONTENT }}>
        <Sidebar activeNav={activeNav} onNavChange={handleNavChange} />
        <div className="flex-1 lg:ml-0">
          <Header title="Reporting" />
          <main className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <LoadingSpinner size="lg" />
            </div>
          </main>
        </div>
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
                  onChange={(v) => setRoleFilter(v as 'All' | 'Therapist' | 'Patient')}
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
                  onChange={(v) => setStatusFilter(v as 'All' | 'Active' | 'Restricted')}
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
                  onChange={(v) => setLocationFilter(v as 'All' | 'Lagos' | 'Abuja' | 'Kano')}
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
              {transformedReportHistory && transformedReportHistory.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generated By</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transformedReportHistory.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(item.createdAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.createdBy}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.status || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button 
                            onClick={() => console.log('Download history item', item.id)} 
                            className="text-[#3C5671] hover:opacity-80"
                            disabled={item.status !== 'completed'}
                          >
                            {item.status === 'completed' ? 'Download' : 'Processing...'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-sm">No report history available</p>
                  <p className="text-gray-400 text-xs mt-1">Generated reports will appear here</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Reporting;
