import { UserTableData } from '@/types';

export const USERS: UserTableData[] = [
  {
    id: '423',
    name: 'Apple Watch',
    email: 'exar@example.com',
    lastLogin: '2024-01-15 10:30',
    status: 'Unrestricted',
    role: 'Therapist',
    location: 'Lagos',
    phone: '+234 801 234 5678',
    verificationStatus: 'Verified',
    rating: 4.7,
    reviewsCount: 128,
    activity: { bookings: 540, cancellations: 12 }
  },
  {
    id: '424',
    name: 'John Doe',
    email: 'john.doe@example.com',
    lastLogin: '2024-01-14 15:45',
    status: 'Restricted',
    role: 'Patient',
    location: 'Abuja',
    phone: '+234 802 345 6789',
    activity: { bookings: 24, cancellations: 3 }
  },
  {
    id: '425',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    lastLogin: '2024-01-13 09:20',
    status: 'Unrestricted',
    role: 'Therapist',
    location: 'Kano',
    phone: '+234 803 456 7890',
    verificationStatus: 'Pending',
    rating: 4.4,
    reviewsCount: 89,
    activity: { bookings: 320, cancellations: 20 }
  },
  {
    id: '426',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    lastLogin: '2024-01-12 14:15',
    status: 'Unrestricted',
    role: 'Patient',
    location: 'Lagos',
    phone: '+234 804 567 8901',
    activity: { bookings: 10, cancellations: 0 }
  },
  {
    id: '427',
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    lastLogin: '2024-01-11 11:30',
    status: 'Restricted',
    role: 'Therapist',
    location: 'Abuja',
    phone: '+234 805 678 9012',
    verificationStatus: 'Rejected',
    rating: 3.9,
    reviewsCount: 45,
    activity: { bookings: 90, cancellations: 18 }
  },
  {
    id: '428',
    name: 'Charlie Wilson',
    email: 'charlie.wilson@example.com',
    lastLogin: '2024-01-10 16:20',
    status: 'Unrestricted',
    role: 'Therapist',
    location: 'Kano',
    phone: '+234 806 789 0123',
    verificationStatus: 'Verified',
    rating: 4.9,
    reviewsCount: 222,
    activity: { bookings: 780, cancellations: 9 }
  },
  {
    id: '429',
    name: 'Diana Davis',
    email: 'diana.davis@example.com',
    lastLogin: '2024-01-09 13:45',
    status: 'Restricted',
    role: 'Patient',
    location: 'Lagos',
    phone: '+234 807 890 1234',
    activity: { bookings: 6, cancellations: 1 }
  }
];


