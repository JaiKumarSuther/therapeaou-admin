'use client';

import React, { useState } from 'react';
import { 
  FiList, 
  FiUsers, 
  FiSettings, 
  FiLogOut,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { NavigationItem } from '@/types';
import { COLORS } from '@/constants';
import LoadingSpinner from './LoadingSpinner';
import { MdSpaceDashboard } from 'react-icons/md';

interface SidebarProps {
  activeNav: string;
  onNavChange: (navId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeNav, onNavChange }) => {
  const router = useRouter();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

  const navigationItems: NavigationItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: MdSpaceDashboard , path: '/dashboard' },
    { id: 'reporting', label: 'Reporting', icon: FiList, path: '/dashboard/reporting' },
    { id: 'user-management', label: 'User Management', icon: FiUsers, path: '/dashboard/user-management' }
  ];

  const bottomNavItems: NavigationItem[] = [
    { id: 'settings', label: 'Settings', icon: FiSettings, path: '/dashboard/settings' },
    { id: 'logout', label: 'Logout', icon: FiLogOut }
  ];

  const handleNavClick = async (navId: string) => {
    if (navId === 'logout') {
      logout();
      router.push('/');
    } else {
      const navItem = [...navigationItems, ...bottomNavItems].find(item => item.id === navId);
      if (navItem?.path) {
        setIsNavigating(true);
        setNavigatingTo(navItem.path);
        onNavChange(navId);
        router.push(navItem.path);
        
        // Reset navigation state after a short delay
        setTimeout(() => {
          setIsNavigating(false);
          setNavigatingTo(null);
        }, 1000);
      }
    }
    // Close mobile menu after navigation
    setIsMobileMenuOpen(false);
  };

  const getNavButtonClasses = (itemId: string) => {
    const baseClasses = 'w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer backdrop-blur-sm';
    const isActive = activeNav === itemId;
    const isNavigatingToThis = navigatingTo === [...navigationItems, ...bottomNavItems].find(item => item.id === itemId)?.path;
    
    return `${baseClasses} ${
      isActive
        ? 'text-white'
        : isNavigatingToThis
        ? 'text-white/80 bg-white/10'
        : 'text-white/80 hover:bg-white/10'
    }`;
  };

  const getActiveStyle = (itemId: string) => {
    return activeNav === itemId ? { backgroundColor: COLORS.SIDEBAR.ACTIVE } : {};
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="mb-8">
        <Image
          src="/assets/logo.png"
          alt="Shieldr Logo"
          width={160}
          height={64}
          className="mx-auto"
          style={{ filter: 'brightness(0) invert(1)' }}
          priority
        />
      </div>

      {/* Navigation */}
      <nav className="space-y-2">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={getNavButtonClasses(item.id)}
            style={getActiveStyle(item.id)}
            aria-label={item.label}
            disabled={isNavigating}
          >
            {isNavigating && navigatingTo === item.path ? (
              <LoadingSpinner size="sm" className="mr-3" />
            ) : (
              <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
            )}
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="absolute bottom-6 left-6 right-6">
        <nav className="space-y-2">
          {bottomNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={getNavButtonClasses(item.id)}
              style={getActiveStyle(item.id)}
              aria-label={item.label}
              disabled={isNavigating}
            >
              {isNavigating && navigatingTo === item.path ? (
                <LoadingSpinner size="sm" className="mr-3" />
              ) : (
                <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
              )}
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg shadow-lg border border-white/20 cursor-pointer"
          style={{ backgroundColor: COLORS.PRIMARY.DARK_BLUE }}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <FiX className="w-6 h-6 text-white" />
          ) : (
            <FiMenu className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-[#00000080] z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`
        lg:hidden fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `} style={{ background: `linear-gradient(180deg, ${COLORS.PRIMARY.DARK_BLUE} 0%, ${COLORS.PRIMARY.BLUE} 100%)` }}>
        <div className="p-6 relative h-full text-white">
          <SidebarContent />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 p-6 relative text-white" style={{ background: `linear-gradient(180deg, ${COLORS.PRIMARY.DARK_BLUE} 0%, ${COLORS.PRIMARY.BLUE} 100%)` }}>
        <SidebarContent />
      </div>
    </>
  );
};

export default Sidebar;
