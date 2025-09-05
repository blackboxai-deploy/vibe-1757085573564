// Application constants
export const APP_NAME = 'GlobalSIM Pro';
export const APP_DESCRIPTION = 'Global OTP SMS & eSIM Management Platform';

// API Configuration
export const API_BASE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
export const API_RATE_LIMITS = {
  FREE: 100,
  PREMIUM: 1000,
  ENTERPRISE: 10000,
} as const;

// OTP Configuration
export const OTP_CONFIG = {
  LENGTH: 6,
  EXPIRY_MINUTES: 5,
  MAX_ATTEMPTS: 3,
  RESEND_COOLDOWN_SECONDS: 30,
} as const;

// SMS Providers
export const SMS_PROVIDERS = [
  { id: 'twilio', name: 'Twilio', available: true },
  { id: 'aws', name: 'AWS SNS', available: true },
  { id: 'azure', name: 'Azure Communication', available: false },
] as const;

// eSIM Providers
export const ESIM_PROVIDERS = [
  { id: 'provider1', name: 'Global eSIM Provider', available: true },
  { id: 'provider2', name: 'Worldwide Connect', available: true },
] as const;

// Countries with eSIM support
export const SUPPORTED_COUNTRIES = [
  { code: 'US', name: 'United States', flag: '🇺🇸', available: true },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', available: true },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', available: true },
  { code: 'FR', name: 'France', flag: '🇫🇷', available: true },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', available: true },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', available: true },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', available: true },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', available: true },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', available: true },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', available: true },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', available: true },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', available: true },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', available: true },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', available: true },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', available: true },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', available: true },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰', available: true },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', available: true },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', available: true },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', available: true },
] as const;

// Data Plans
export const DATA_PLANS = [
  { id: '1gb-7d', name: '1GB - 7 Days', data: '1GB', validity: '7 days', price: 9.99 },
  { id: '3gb-15d', name: '3GB - 15 Days', data: '3GB', validity: '15 days', price: 19.99 },
  { id: '5gb-30d', name: '5GB - 30 Days', data: '5GB', validity: '30 days', price: 29.99 },
  { id: '10gb-30d', name: '10GB - 30 Days', data: '10GB', validity: '30 days', price: 49.99 },
  { id: '20gb-30d', name: '20GB - 30 Days', data: '20GB', validity: '30 days', price: 79.99 },
  { id: 'unlimited-30d', name: 'Unlimited - 30 Days', data: 'Unlimited', validity: '30 days', price: 99.99 },
] as const;

// System Prompts for AI Features
export const DEFAULT_SYSTEM_PROMPTS = {
  otpGeneration: `You are an intelligent OTP routing system. Analyze the destination phone number and determine the best SMS provider based on:
1. Geographic location and carrier coverage
2. Current provider reliability scores
3. Cost optimization
4. Delivery speed requirements
Return a JSON response with the recommended provider and routing strategy.`,
  
  fraudDetection: `You are a fraud detection system for OTP and eSIM services. Analyze user patterns and detect:
1. Suspicious activity patterns
2. Unusual geographic distribution
3. High-frequency requests from single sources
4. Bot-like behavior patterns
Return risk assessment with severity level and recommended actions.`,
  
  customerSupport: `You are a customer support assistant for GlobalSIM Pro. Help users with:
1. OTP SMS delivery issues
2. eSIM activation problems
3. Account and billing questions
4. Technical troubleshooting
Provide clear, helpful responses while maintaining security best practices.`,
  
  routingOptimization: `You are a network routing optimizer. Analyze real-time data to:
1. Optimize SMS delivery routes
2. Balance load across providers
3. Minimize costs while ensuring reliability
4. Predict and prevent service disruptions
Provide routing recommendations with justification.`,
} as const;

// Dashboard Navigation
export const DASHBOARD_NAV = [
  { name: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
  { name: 'OTP SMS', href: '/dashboard/otp', icon: 'message' },
  { name: 'eSIM Manager', href: '/dashboard/esim', icon: 'sim' },
  { name: 'API Keys', href: '/dashboard/api-keys', icon: 'key' },
  { name: 'Analytics', href: '/dashboard/analytics', icon: 'chart' },
  { name: 'Settings', href: '/dashboard/settings', icon: 'settings' },
] as const;

// Pricing Tiers
export const PRICING_TIERS = [
  {
    name: 'Starter',
    price: 0,
    currency: 'USD',
    period: 'month',
    features: [
      '1,000 OTP SMS per month',
      '2 eSIM profiles',
      'Basic analytics',
      'Email support',
    ],
    limits: {
      otpSms: 1000,
      esimProfiles: 2,
      apiKeys: 2,
    },
  },
  {
    name: 'Professional',
    price: 49,
    currency: 'USD',
    period: 'month',
    features: [
      '50,000 OTP SMS per month',
      '50 eSIM profiles',
      'Advanced analytics',
      'Priority support',
      'Custom branding',
      'Webhook integration',
    ],
    limits: {
      otpSms: 50000,
      esimProfiles: 50,
      apiKeys: 10,
    },
  },
  {
    name: 'Enterprise',
    price: 299,
    currency: 'USD',
    period: 'month',
    features: [
      'Unlimited OTP SMS',
      'Unlimited eSIM profiles',
      'Real-time analytics',
      '24/7 phone support',
      'White-label solution',
      'Dedicated account manager',
      'SLA guarantee',
    ],
    limits: {
      otpSms: Infinity,
      esimProfiles: Infinity,
      apiKeys: Infinity,
    },
  },
] as const;

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_PHONE: 'Please enter a valid phone number with country code',
  INVALID_OTP: 'Please enter a valid 6-digit OTP code',
  OTP_EXPIRED: 'OTP code has expired. Please request a new one',
  OTP_MAX_ATTEMPTS: 'Maximum verification attempts reached',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  SERVER_ERROR: 'An unexpected error occurred. Please try again',
  NETWORK_ERROR: 'Network error. Please check your connection',
} as const;