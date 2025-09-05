'use client';

import React from 'react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

interface KPICardProps {
  title: string;
  value: string;
  trend: string;
  trendType: 'up' | 'down';
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  onClick?: () => void;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  trend,
  trendType,
  icon: Icon,
  iconBg,
  iconColor,
  onClick
}) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-200 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm sm:text-base font-medium text-gray-600 truncate">
            {title}
          </p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-1">
            {value}
          </p>
          <div className="flex items-center mt-2">
            {trendType === 'up' ? (
              <FiTrendingUp className="w-4 h-4 mr-1 text-green-500" />
            ) : (
              <FiTrendingDown className="w-4 h-4 mr-1 text-red-500" />
            )}
            <span className={`text-xs sm:text-sm font-medium ${
              trendType === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend}
            </span>
          </div>
        </div>
        <div className={`ml-4 p-2 sm:p-3 rounded-lg shadow ${iconBg}`}>
          <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};

export default KPICard;
