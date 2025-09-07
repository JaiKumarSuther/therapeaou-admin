'use client';

import { useState } from 'react';
import Image from 'next/image';
import LoginForm from '../components/LoginForm';
import ForgotPassword from '../components/ForgotPassword';
import SignUp from '../components/SignUp';
import CreateAdminForm from '../components/CreateAdminForm';
import { COLORS } from '@/constants';

type ViewType = 'login' | 'forgot-password' | 'signup' | 'create-admin';

export default function LoginPage() {
  const [currentView, setCurrentView] = useState<ViewType>('login');

  const handleForgotPassword = () => {
    setCurrentView('forgot-password');
  };

  const handleSignUp = () => {
    setCurrentView('signup');
  };

  const handleBackToLogin = () => {
    setCurrentView('login');
  };

  const handleCreateAdmin = () => {
    setCurrentView('create-admin');
  };

  const handleCreateAdminSuccess = () => {
    setCurrentView('login');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'forgot-password':
        return <ForgotPassword onBackToLogin={handleBackToLogin} />;
      case 'signup':
        return <SignUp onBackToLogin={handleBackToLogin} />;
      case 'create-admin':
        return <CreateAdminForm onSuccess={handleCreateAdminSuccess} onCancel={handleBackToLogin} />;
      default:
        return <LoginForm onForgotPassword={handleForgotPassword} onSignUp={handleSignUp} onCreateAdmin={handleCreateAdmin} />;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: COLORS.BACKGROUND.MAIN }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <Image
            src="/assets/logo.png"
            alt="Therapeaou Logo"
            width={200}
            height={80}
            className="mx-auto"
            priority
          />
        </div>

        {/* Form */}
        {renderCurrentView()}
      </div>
    </div>
  );
}
