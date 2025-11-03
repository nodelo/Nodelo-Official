/**
 * API Client Utility
 * Centralized API communication with error handling and authentication
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5050';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: string[];
}

export interface ApiError {
  success: false;
  error: string;
  message?: string;
  details?: string[];
}

/**
 * Get authentication token from localStorage
 */
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

/**
 * Set authentication token in localStorage
 */
export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
};

/**
 * Remove authentication token from localStorage
 */
export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
};

/**
 * Base fetch wrapper with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getAuthToken();
  
  const defaultHeaders: HeadersInit = {};

  // Only set default Content-Type if it's not FormData
  // Check if body is FormData by checking if options.headers already has Content-Type set or if body is FormData instance
  const isFormDataRequest = options.body instanceof FormData;
  
  if (!isFormDataRequest) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  // Remove Content-Type header if it's FormData (browser will set it with boundary)
  if (isFormDataRequest && config.headers) {
    const headers = config.headers as HeadersInit;
    delete (headers as any)['Content-Type'];
    config.headers = headers;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${response.status}: ${response.statusText}`,
        message: data.message,
        details: data.details,
      };
    }

    return {
      success: true,
      ...data,
    };
  } catch (error) {
    console.error('API request error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error. Please check your connection.',
    };
  }
}

/**
 * GET request
 */
export async function apiGet<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'GET',
  });
}

/**
 * POST request
 */
export async function apiPost<T>(
  endpoint: string,
  body?: any,
  isFormData: boolean = false
): Promise<ApiResponse<T>> {
  const headers: HeadersInit = {};
  
  // For FormData, don't set Content-Type - let browser set it with boundary
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  // Explicitly don't set Content-Type for FormData

  const options: RequestInit = {
    method: 'POST',
    headers,
  };

  if (body) {
    if (isFormData) {
      options.body = body; // FormData object
      // Don't set Content-Type for FormData - browser will set it automatically
    } else {
      options.body = JSON.stringify(body);
    }
  }

  return apiRequest<T>(endpoint, options);
}

/**
 * PATCH request
 */
export async function apiPatch<T>(
  endpoint: string,
  body?: any
): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * DELETE request
 */
export async function apiDelete<T>(endpoint: string): Promise<ApiResponse<T>> {
  return apiRequest<T>(endpoint, {
    method: 'DELETE',
  });
}

/**
 * Health check endpoint
 */
export async function checkHealth(): Promise<ApiResponse> {
  return apiGet('/health');
}

export default {
  get: apiGet,
  post: apiPost,
  patch: apiPatch,
  delete: apiDelete,
  setAuthToken,
  removeAuthToken,
  checkHealth,
};

