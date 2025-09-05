export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export interface APIKey {
  id: string;
  name: string;
  key: string;
  userId: string;
  isActive: boolean;
  lastUsed?: Date;
  createdAt: Date;
  usage: number;
  rateLimit: number;
}

export interface OTPRecord {
  id: string;
  phoneNumber: string;
  code: string;
  isVerified: boolean;
  expiresAt: Date;
  attempts: number;
  userId: string;
  createdAt: Date;
  provider: 'twilio' | 'aws' | 'azure';
  status: 'pending' | 'delivered' | 'failed' | 'expired';
}

export interface ESIMProfile {
  id: string;
  iccid: string;
  msisdn: string;
  country: string;
  provider: string;
  dataplan: string;
  status: 'active' | 'inactive' | 'suspended' | 'expired';
  activationCode: string;
  qrCode?: string;
  userId: string;
  createdAt: Date;
  expiresAt: Date;
  dataUsed: number;
  dataLimit: number;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  available: boolean;
  providers: string[];
}

export interface DataPlan {
  id: string;
  name: string;
  data: string;
  validity: string;
  price: number;
  currency: string;
  country: string;
  provider: string;
}

export interface UsageAnalytics {
  date: string;
  otpSent: number;
  otpVerified: number;
  esimActivated: number;
  apiCalls: number;
  costs: number;
}

export interface SMSProvider {
  name: string;
  send: (to: string, message: string) => Promise<{ success: boolean; messageId?: string; error?: string }>;
  getDeliveryStatus: (messageId: string) => Promise<{ status: string; delivered: boolean }>;
}

export interface ESIMProvider {
  name: string;
  createProfile: (country: string, plan: string) => Promise<ESIMProfile>;
  activateProfile: (iccid: string) => Promise<boolean>;
  deactivateProfile: (iccid: string) => Promise<boolean>;
  getUsage: (iccid: string) => Promise<{ used: number; remaining: number }>;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalOTPSent: number;
  totalESIMActive: number;
  totalAPIKeys: number;
  monthlyGrowth: number;
  revenueThisMonth: number;
}

export interface SystemPromptConfig {
  otpGeneration: string;
  fraudDetection: string;
  customerSupport: string;
  routingOptimization: string;
}