import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// OTP schemas
export const sendOTPSchema = z.object({
  phoneNumber: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Invalid phone number format'),
  template: z.string().optional(),
  provider: z.enum(['twilio', 'aws', 'azure']).optional(),
});

export const verifyOTPSchema = z.object({
  phoneNumber: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Invalid phone number format'),
  code: z.string().length(6, 'OTP must be 6 digits'),
});

// eSIM schemas
export const createESIMSchema = z.object({
  country: z.string().length(2, 'Country code must be 2 characters'),
  dataplan: z.string().min(1, 'Data plan is required'),
  provider: z.string().optional(),
});

export const activateESIMSchema = z.object({
  iccid: z.string().min(19, 'Invalid ICCID format').max(22, 'Invalid ICCID format'),
});

// API Key schemas
export const createAPIKeySchema = z.object({
  name: z.string().min(1, 'API key name is required').max(50, 'Name too long'),
  rateLimit: z.number().min(1).max(10000).optional().default(100),
});

// Settings schemas
export const profileSettingsSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  notifications: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    push: z.boolean(),
  }).optional(),
});

export const billingSettingsSchema = z.object({
  currency: z.enum(['USD', 'EUR', 'GBP', 'JPY']),
  billingEmail: z.string().email('Invalid email address'),
  company: z.string().optional(),
  vatNumber: z.string().optional(),
});

// System prompt schemas
export const systemPromptSchema = z.object({
  name: z.string().min(1, 'Prompt name is required'),
  content: z.string().min(10, 'Prompt content must be at least 10 characters'),
  model: z.string().default('openrouter/claude-sonnet-4'),
  temperature: z.number().min(0).max(2).default(0.7),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type SendOTPFormData = z.infer<typeof sendOTPSchema>;
export type VerifyOTPFormData = z.infer<typeof verifyOTPSchema>;
export type CreateESIMFormData = z.infer<typeof createESIMSchema>;
export type ActivateESIMFormData = z.infer<typeof activateESIMSchema>;
export type CreateAPIKeyFormData = z.infer<typeof createAPIKeySchema>;
export type ProfileSettingsFormData = z.infer<typeof profileSettingsSchema>;
export type BillingSettingsFormData = z.infer<typeof billingSettingsSchema>;
export type SystemPromptFormData = z.infer<typeof systemPromptSchema>;