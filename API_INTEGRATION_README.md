# Therapeuo Admin Panel - Complete API Integration

This document outlines the complete API integration setup for the Therapeuo Admin Panel using React Query, Axios, and Redux Toolkit.

## 🚀 Features Implemented

### 1. **API Service Layer**
- **Axios Configuration**: Centralized HTTP client with interceptors
- **Authentication**: Automatic token handling and refresh
- **Error Handling**: Global error handling with user-friendly messages
- **Type Safety**: Full TypeScript support for all API responses

### 2. **State Management (Redux Toolkit)**
- **Auth Slice**: User authentication and profile management
- **Dashboard Slice**: Dashboard metrics and statistics
- **Users Slice**: User management and search functionality
- **Reports Slice**: Reporting and analytics data

### 3. **Data Fetching (React Query)**
- **Caching**: Intelligent caching with configurable stale times
- **Background Updates**: Automatic data refetching
- **Optimistic Updates**: Immediate UI updates for better UX
- **Error Retry**: Smart retry logic for failed requests

### 4. **API Endpoints Covered**
Based on the Postman collection, all endpoints are integrated:

#### Authentication
- `POST /admin/login` - Admin login
- `GET /admin/profile` - Get admin profile
- `PUT /admin/profile` - Update admin profile
- `POST /admin/change-password` - Change admin password

#### Dashboard
- `GET /admin/get-dashboard` - Get comprehensive dashboard data
- `GET /admin/total-premium` - Get premium therapist count
- `GET /admin/total-platinum` - Get platinum therapist count
- `GET /admin/new-registered` - Get new registered users
- `GET /admin/total-users` - Get total users count
- `GET /admin/total-therapists` - Get total therapists count
- `GET /admin/total-patients` - Get total patients count
- `GET /admin/revenue` - Get total revenue
- `GET /admin/monthly-revenue` - Get monthly revenue

#### User Management
- `GET /admin/search-therapist/{query}` - Search therapists
- `GET /admin/search-patient/{query}` - Search patients
- `GET /patient/get-all` - Get all patients
- `GET /patient/get/{id}` - Get patient by ID
- `GET /patient/new-registered` - Get new registered patients
- `PUT /patient/update` - Update patient information
- `POST /patient/change-password` - Change patient password

#### User Actions
- `PUT /admin/therapist/verify` - Verify/unverify therapist
- `PUT /admin/user/suspend` - Suspend/unsuspend user
- `POST /admin/user/reset-password` - Reset user password
- `POST /admin/user/send-message` - Send message to user

#### Reporting
- `GET /admin/reports/therapist-activity` - Get therapist activity report
- `GET /admin/reports/patient-activity` - Get patient activity report
- `GET /admin/reports/financial-activity` - Get financial activity report
- `GET /admin/reports/history` - Get report history

#### Analytics
- `GET /admin/analytics/recent-activity` - Get recent activity
- `GET /admin/analytics/user-stats` - Get user statistics
- `GET /admin/analytics/revenue` - Get revenue analytics

#### Export
- `GET /admin/export-data` - Export admin data

## 📁 File Structure

```
├── lib/
│   ├── api.ts                 # Axios configuration and base API service
│   ├── api/
│   │   └── admin.ts          # Admin-specific API service
│   └── react-query.ts        # React Query client configuration
├── store/
│   ├── index.ts              # Redux store configuration
│   └── slices/
│       ├── authSlice.ts      # Authentication state management
│       ├── dashboardSlice.ts # Dashboard data management
│       ├── usersSlice.ts     # User management state
│       └── reportsSlice.ts   # Reports and analytics state
├── hooks/
│   └── useAdminApi.ts        # React Query hooks for all API calls
├── providers/
│   └── Providers.tsx         # Provider components setup
└── constants/
    └── index.ts              # API endpoints and constants
```

## 🛠️ Setup Instructions

### 1. **Environment Configuration**
Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8085

# Development settings
NODE_ENV=development
```

### 2. **Dependencies Installed**
The following packages have been installed:

```json
{
  "@reduxjs/toolkit": "^2.0.1",
  "react-redux": "^9.0.4",
  "@tanstack/react-query": "^5.0.0",
  "axios": "^1.6.0",
  "react-hot-toast": "^2.4.1",
  "@tanstack/react-query-devtools": "^5.0.0"
}
```

### 3. **Provider Setup**
The providers are already configured in `app/layout.tsx`:

```tsx
<Providers>
  <AuthProvider>
    {children}
  </AuthProvider>
</Providers>
```

## 🔧 Usage Examples

### 1. **Using React Query Hooks**

```tsx
import { useDashboardData, useSearchTherapists } from '../hooks/useAdminApi';

function Dashboard() {
  const { data: dashboardData, isLoading, error } = useDashboardData();
  const { data: therapists } = useSearchTherapists('john', true);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <div>{/* Render dashboard data */}</div>;
}
```

### 2. **Using Redux Actions**

```tsx
import { useAppDispatch, useAppSelector } from '../store';
import { loginAsync, logout } from '../store/slices/authSlice';

function LoginForm() {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector(state => state.auth);

  const handleLogin = async (credentials) => {
    await dispatch(loginAsync(credentials));
  };

  return <form onSubmit={handleLogin}>{/* Form JSX */}</form>;
}
```

### 3. **Using Mutations**

```tsx
import { useVerifyTherapist, useSuspendUser } from '../hooks/useAdminApi';

function UserActions({ userId }) {
  const verifyTherapist = useVerifyTherapist();
  const suspendUser = useSuspendUser();

  const handleVerify = () => {
    verifyTherapist.mutate({
      therapistId: userId,
      verified: true
    });
  };

  const handleSuspend = () => {
    suspendUser.mutate({
      userId: userId,
      userType: 'therapist',
      suspended: true,
      reason: 'Policy violation'
    });
  };

  return (
    <div>
      <button onClick={handleVerify}>Verify</button>
      <button onClick={handleSuspend}>Suspend</button>
    </div>
  );
}
```

## 🎯 Key Features

### 1. **Automatic Token Management**
- Tokens are automatically stored in localStorage
- Automatic token attachment to requests
- Automatic logout on token expiration

### 2. **Error Handling**
- Global error handling with toast notifications
- Retry logic for failed requests
- User-friendly error messages

### 3. **Loading States**
- Loading spinners for all async operations
- Optimistic updates for better UX
- Background data refetching

### 4. **Caching Strategy**
- 5-minute stale time for most queries
- 10-minute garbage collection time
- Smart invalidation on mutations

### 5. **Type Safety**
- Full TypeScript support
- Type-safe API responses
- IntelliSense support for all API calls

## 🔄 Data Flow

1. **Component** calls React Query hook
2. **Hook** calls API service method
3. **API Service** makes HTTP request via Axios
4. **Response** is cached by React Query
5. **Component** receives data and updates UI
6. **Redux** manages global state for auth and user preferences

## 🚨 Error Handling

- **Network Errors**: Automatic retry with exponential backoff
- **Authentication Errors**: Automatic logout and redirect
- **Validation Errors**: User-friendly error messages
- **Server Errors**: Fallback UI with retry options

## 📊 Performance Optimizations

- **Query Deduplication**: Multiple components requesting same data share cache
- **Background Refetching**: Data stays fresh without blocking UI
- **Optimistic Updates**: UI updates immediately for better perceived performance
- **Selective Invalidation**: Only relevant queries are refetched after mutations

## 🔐 Security Features

- **Token-based Authentication**: Secure JWT token handling
- **Automatic Token Refresh**: Seamless user experience
- **Request/Response Interceptors**: Centralized security logic
- **Environment-based Configuration**: Secure API endpoint management

## 🧪 Development Tools

- **React Query DevTools**: Visual query inspection
- **Redux DevTools**: State management debugging
- **Toast Notifications**: User feedback for all actions
- **Loading States**: Clear loading indicators

## 📝 Next Steps

1. **Testing**: Add unit tests for API services and hooks
2. **Error Boundaries**: Implement error boundaries for better error handling
3. **Offline Support**: Add offline detection and caching
4. **Performance Monitoring**: Add performance tracking
5. **API Documentation**: Generate API documentation from TypeScript types

This integration provides a robust, scalable, and maintainable foundation for the Therapeuo Admin Panel with modern React patterns and best practices.
