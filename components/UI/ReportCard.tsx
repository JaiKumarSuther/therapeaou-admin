'use client';

import React from 'react';
import { FiDownload } from 'react-icons/fi';

interface ReportCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  onDownload?: (reportType: string) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({
  title,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  onDownload
}) => {
  const handleDownload = () => {
    if (onDownload) {
      const reportType = title.toLowerCase().replace(/\s+/g, '-');
      onDownload(reportType);
    } else {
      console.log('Download functionality not implemented');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">{title}</h3>
        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${iconBg} rounded-lg flex items-center justify-center flex-shrink-0 ml-3`}>
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColor}`} />
        </div>
      </div>
      <div className="mb-4 sm:mb-6">
        <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value}</p>
      </div>
      <button
        onClick={handleDownload}
        className="w-full py-2 sm:py-3 px-3 sm:px-4 rounded-md font-medium text-sm transition-all duration-200 flex items-center justify-center"
        style={{ color: '#3C5671', borderColor: '#3C5671', borderWidth: 1, backgroundColor: 'transparent' }}
        onMouseOver={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(60,86,113,0.06)'; }}
        onMouseOut={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'; }}
      >
        <FiDownload className="w-4 h-4 mr-2" />
        Download
      </button>
    </div>
  );
};

export default ReportCard;
