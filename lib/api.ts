import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8085';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Generic API response type
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// API Service class
class ApiService {
  // Generic request method
  private async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      // Log request details
      console.log('🚀 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: apiClient.defaults.baseURL,
        fullURL: `${apiClient.defaults.baseURL}${config.url}`,
        headers: config.headers,
        data: config.data ? JSON.stringify(config.data, null, 2) : 'No data',
        params: config.params ? JSON.stringify(config.params, null, 2) : 'No params'
      });

      const response = await apiClient.request<T>(config);
      
      // Log response details
      console.log('✅ API Response:', {
        status: response.status,
        statusText: response.statusText,
        url: response.config.url,
        data: JSON.stringify(response.data, null, 2),
        headers: response.headers
      });

      return {
        success: true,
        data: response.data,
        message: (response.data as Record<string, unknown>)?.message as string,
      };
    } catch (error: unknown) {
      // Log error details
      const axiosError = error as { 
        message?: string; 
        response?: { 
          status?: number; 
          statusText?: string; 
          data?: { message?: string } 
        }; 
        config?: { url?: string; data?: unknown } 
      };
      
      console.error('❌ API Error:', {
        message: axiosError.message,
        status: axiosError.response?.status,
        statusText: axiosError.response?.statusText,
        url: axiosError.config?.url,
        requestData: axiosError.config?.data ? JSON.stringify(axiosError.config.data, null, 2) : 'No data',
        responseData: axiosError.response?.data ? JSON.stringify(axiosError.response.data, null, 2) : 'No response data',
        fullError: error
      });

      // Handle specific error cases
      let errorMessage = 'An error occurred';
      
      if (axiosError.response?.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (axiosError.response?.status === 404) {
        // Check if it's a login endpoint
        if (axiosError.config?.url?.includes('/admin/login')) {
          errorMessage = 'Invalid email or password';
        } else {
          errorMessage = 'Resource not found';
        }
      } else if (axiosError.response?.status === 403) {
        errorMessage = 'Access denied';
      } else if (axiosError.response?.status && axiosError.response.status >= 500) {
        errorMessage = 'Server error. Please try again later';
      } else if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message;
      } else if (axiosError.message) {
        errorMessage = axiosError.message;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // GET request
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  // POST request
  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  // PUT request
  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  // DELETE request
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  // PATCH request
  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>({ ...config, method: 'PATCH', url, data });
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export the axios instance for direct use if needed
export { apiClient };
