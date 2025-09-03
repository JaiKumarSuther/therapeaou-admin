'use client';

import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { COLORS } from '@/constants';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder = 'Search...' }) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FiSearch className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="block w-full pl-9 sm:pl-10 pr-3 py-2.5 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-[--ring-color] focus:border-[--ring-color] text-sm shadow-sm"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ '--ring-color': COLORS.PRIMARY.LIGHT_BLUE } as React.CSSProperties}
      />
    </div>
  );
};

export default SearchBar;
