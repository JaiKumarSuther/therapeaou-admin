'use client';

import React, { useMemo, useState } from 'react';
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import Sidebar from '../../../../components/UI/Sidebar';
import Header from '../../../../components/UI/Header';
import Button from '../../../../components/UI/Button';
import { COLORS } from '@/constants';
import { useParams, useRouter } from 'next/navigation';
import { USERS } from '@/data/users';

// Global users data
const mockUsers = USERS;

const UserDetailsPage: React.FC = () => {
  const [activeNav, setActiveNav] = useState('user-management');
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const user = useMemo(() => mockUsers.find(u => u.id === params.id), [params.id]);

  

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Unrestricted':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'Restricted':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'Pending Verification':
        return <AlertCircle className="w-4 h-4 text-amber-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'Unrestricted':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Restricted':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Pending Verification':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex" style={{ backgroundColor: COLORS.BACKGROUND.CONTENT }}>
        <Sidebar activeNav={activeNav} onNavChange={(id) => setActiveNav(id)} />
        <div className="flex-1 lg:ml-0">
          <Header title="User Details" />
          <main className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">User Not Found</h3>
                <p className="text-gray-600 mb-6">The user you&apos;re looking for doesn&apos;t exist or has been removed.</p>
                <Button variant="secondary" onClick={() => router.back()}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: COLORS.BACKGROUND.CONTENT }}>
      <Sidebar activeNav={activeNav} onNavChange={(id) => setActiveNav(id)} />
      <div className="flex-1 lg:ml-0">
        <Header title="User Details" />
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div
                className="px-6 py-8 text-white relative"
                style={{ background: `linear-gradient(90deg, ${COLORS.PRIMARY.DARK_BLUE}, ${COLORS.PRIMARY.BLUE})` }}
              >
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative">
                  <div className="flex items-start justify-between mb-6">
                    <Button 
                      variant="secondary" 
                      onClick={() => router.back()}
                      className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    
                  </div>
                  
                  <div className="flex items-start space-x-6">
                    <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h1 className="text-2xl font-bold">{user.name}</h1>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusClasses(user.status)} bg-white/90 backdrop-blur-sm`}>
                          {getStatusIcon(user.status)}
                          <span className="ml-1">{user.status}</span>
                        </span>
                      </div>
                      <p className="text-white/80 mb-1">ID: {user.id}</p>
                      <div className="flex items-center space-x-4 text-sm text-white/80">
                        <span className="flex items-center">
                          <Shield className="w-4 h-4 mr-1" />
                          {user.role}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {user.location}
                        </span>
                        
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              
            </div>

            {/* Minimal Details matching table columns */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">User Summary</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</p>
                  <p className="text-sm font-semibold text-gray-900">{user.id}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Name</p>
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                    <Mail className="w-5 h-5" style={{ color: COLORS.PRIMARY.BLUE }} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</p>
                    <p className="text-sm font-semibold text-gray-900">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                    <Shield className="w-5 h-5" style={{ color: COLORS.PRIMARY.BLUE }} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Role</p>
                    <p className="text-sm font-semibold text-gray-900">{user.role}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Location</p>
                    <p className="text-sm font-semibold text-gray-900">{user.location || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</p>
                    <p className="text-sm font-semibold text-gray-900">{user.lastLogin}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                    {getStatusIcon(user.status)}
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusClasses(user.status)}`}>
                      {user.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
      </div>
    </div>
  );
};

export default UserDetailsPage;