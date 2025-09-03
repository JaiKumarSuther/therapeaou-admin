import LoadingSpinner from '../components/UI/LoadingSpinner';
import { COLORS } from '@/constants';

export default function RootLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.BACKGROUND.MAIN }}>
      <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600 font-medium">Loading...</p>
        <p className="text-sm text-gray-500 text-center">
          Please wait while we load the application
        </p>
      </div>
    </div>
  );
}
