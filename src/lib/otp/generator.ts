import crypto from 'crypto';
import { OTP_CONFIG } from '../constants';

export interface GeneratedOTP {
  code: string;
  hash: string;
  expiresAt: Date;
}

/**
 * Generate a secure OTP code
 */
export function generateOTP(length: number = OTP_CONFIG.LENGTH): GeneratedOTP {
  // Generate cryptographically secure random digits
  const digits = '0123456789';
  let code = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, digits.length);
    code += digits[randomIndex];
  }
  
  // Create hash for storage (don't store plain text OTP)
  const hash = crypto
    .createHash('sha256')
    .update(code + process.env.JWT_SECRET || 'fallback-secret')
    .digest('hex');
  
  // Set expiry time
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + OTP_CONFIG.EXPIRY_MINUTES);
  
  return {
    code,
    hash,
    expiresAt,
  };
}

/**
 * Hash an OTP code for comparison
 */
export function hashOTP(code: string): string {
  return crypto
    .createHash('sha256')
    .update(code + process.env.JWT_SECRET || 'fallback-secret')
    .digest('hex');
}

/**
 * Verify an OTP code against its hash
 */
export function verifyOTP(code: string, hash: string): boolean {
  const computedHash = hashOTP(code);
  return computedHash === hash;
}

/**
 * Check if OTP has expired
 */
export function isOTPExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}

/**
 * Format phone number to international format
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // Ensure it starts with +
  if (!cleaned.startsWith('+')) {
    // If no country code, assume US (+1) for demo
    cleaned = '+1' + cleaned;
  }
  
  return cleaned;
}

/**
 * Validate phone number format
 */
export function isValidPhoneNumber(phone: string): boolean {
  // Basic E.164 format validation
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phone);
}

/**
 * Generate OTP message template
 */
export function generateOTPMessage(code: string, appName: string = 'GlobalSIM Pro'): string {
  return `Your ${appName} verification code is: ${code}. This code expires in ${OTP_CONFIG.EXPIRY_MINUTES} minutes. Do not share this code with anyone.`;
}

/**
 * Get country code from phone number
 */
export function getCountryCodeFromPhone(phone: string): string {
  if (!phone.startsWith('+')) {
    return 'US'; // Default fallback
  }
  
  // Simple country code mapping (in real app, use a proper library)
  const countryCodeMap: { [key: string]: string } = {
    '+1': 'US',
    '+44': 'GB',
    '+49': 'DE',
    '+33': 'FR',
    '+81': 'JP',
    '+61': 'AU',
    '+86': 'CN',
    '+91': 'IN',
    '+7': 'RU',
    '+55': 'BR',
  };
  
  // Find matching country code
  for (const [prefix, country] of Object.entries(countryCodeMap)) {
    if (phone.startsWith(prefix)) {
      return country;
    }
  }
  
  return 'US'; // Default fallback
}

/**
 * Generate unique tracking ID for OTP
 */
export function generateTrackingId(): string {
  return crypto.randomBytes(16).toString('hex');
}