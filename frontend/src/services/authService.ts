import api from './api';

// Types
export interface RegisterData {
  phone?: string;
  currentCity?: string;
  isFresherCA?: boolean | string;
  resumeUrl?: string;
  linkedinUrl?: string;
  caFinal?: {
    bothGroups1stAttempt?: boolean;
    group1Attempts?: string;
    group1Month?: string;
    group1Year?: string;
    group2Attempts?: string;
    group2Month?: string;
    group2Year?: string;
    ranker?: string;
    completionSessionMonth?: string;
    completionSessionYear?: string;
    percentage?: string;
  };
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: 'candidate' | 'employer';
}

export interface LoginData {
  email: string;
  password?: string;
}

export interface UserResponse {
  _id: string;
  id?: string;
  firstName: string;
  lastName: string;
  name?: string;
  email: string;
  role: 'candidate' | 'employer' | 'admin' | 'employee';
  token: string;
  phone?: string;
  city?: string;
  resumeUrl?: string;
  profileCompleted?: boolean;
  personalDetails?: any;
  caPortfolio?: any;
  caFinalInfo?: any;
  caInterInfo?: any;
  articleshipInfo?: any;
  qualifications?: any;
  experienceInfo?: any;
  isFresherCA?: boolean | string;
  companyName?: string;
  [key: string]: any;
}

export interface PasswordResetTokenResponse {
  resetToken: string;
}

export interface MessageResponse {
  message: string;
}

// Register user
const register = async (userData: RegisterData): Promise<UserResponse> => {
  const response = await api.post('/users', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
  }
  return response.data;
};

// Login user
const login = async (userData: LoginData): Promise<UserResponse> => {
  const response = await api.post('/users/login', userData);
  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data));
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
  }
  return response.data;
};

const requestPasswordResetOtp = async (email: string): Promise<MessageResponse> => {
  const response = await api.post('/users/forgot-password', { email });
  return response.data;
};

const verifyPasswordResetOtp = async (email: string, otp: string): Promise<PasswordResetTokenResponse> => {
  const response = await api.post('/users/verify-password-reset-otp', { email, otp });
  return response.data;
};

const resetPassword = async (email: string, resetToken: string, password: string): Promise<MessageResponse> => {
  const response = await api.post('/users/reset-password', { email, resetToken, password });
  return response.data;
};

const checkPhone = async (phone: string): Promise<{ exists: boolean }> => {
  const response = await api.get(`/users/check-phone?phone=${encodeURIComponent(phone)}`);
  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

const authService = {
  register,
  login,
  requestPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPassword,
  checkPhone,
  logout,
};

export default authService;
