import { QueryClient } from '@tanstack/react-query';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error: unknown) => {
        const axiosError = error as { response?: { status?: number } };
        // Don't retry on 4xx errors except 408, 429
        if (axiosError?.response?.status && axiosError.response.status >= 400 && axiosError.response.status < 500) {
          if (axiosError.response.status === 408 || axiosError.response.status === 429) {
            return failureCount < 2;
          }
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});
