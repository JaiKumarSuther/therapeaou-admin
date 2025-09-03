'use client';

import React, { forwardRef } from 'react';
import { BaseComponentProps } from '@/types';
import { COLORS } from '@/constants';

interface InputProps extends BaseComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = 'text',
      placeholder,
      value,
      onChange,
      onBlur,
      onFocus,
      disabled = false,
      required = false,
      error,
      label,
      helperText,
      icon,
      iconPosition = 'left',
      className = '',
    },
    ref
  ) => {
    const baseClasses = 'block w-full px-3 py-2.5 border rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed bg-white';
    
    const stateClasses = error
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
      : 'border-slate-300 focus:ring-[--ring-color] focus:border-[--ring-color]';

    const iconClasses = icon
      ? iconPosition === 'left'
        ? 'pl-10'
        : 'pr-10'
      : '';

    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-medium text-slate-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="h-5 w-5 text-gray-400">{icon}</div>
            </div>
          )}
          <input
            ref={ref}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onBlur={onBlur}
            onFocus={onFocus}
            disabled={disabled}
            required={required}
            placeholder={placeholder}
            className={`${baseClasses} ${stateClasses} ${iconClasses}`}
            style={{ ['--ring-color' as any]: COLORS.PRIMARY.BLUE }}
          />
          {icon && iconPosition === 'right' && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <div className="h-5 w-5 text-gray-400">{icon}</div>
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
