// API Configuration for DevRel Platform
// This connects to the main TBE-Webapp APIs

export const API_CONFIG = {
  // Base URL for TBE-Webapp APIs
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  
  // DevRel API Endpoints
  ENDPOINTS: {
    // Application endpoints
    APPLY: 'devrel/apply',
    APPLICATIONS: 'devrel/applications',
    
    // Task endpoints
    TASKS: 'devrel/tasks',
    
    // Dashboard endpoints
    DASHBOARD: 'devrel/dashboard',
    
    // Authentication
    AUTH: {
      SIGNIN: '/api/auth/signin',
      SIGNOUT: '/api/auth/signout',
      SESSION: '/api/auth/session',
    },
  },
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// API Response types
export interface ApiResponse<T = any> {
  status: boolean;
  data?: T;
  message?: string;
  error?: any;
}

// Environment configurations
export const ENV_CONFIG = {
  NODE_ENV: process.env.NODE_ENV,
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
} as const;

export const isDev = ENV_CONFIG.NODE_ENV === 'development';
export const isProd = ENV_CONFIG.NODE_ENV === 'production';