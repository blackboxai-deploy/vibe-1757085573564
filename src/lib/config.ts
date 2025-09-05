// Configuration management for the application
export const config = {
  // Authentication
  auth: {
    secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
    jwtSecret: process.env.JWT_SECRET || 'fallback-jwt-secret',
  },
  
  // Database
  database: {
    url: process.env.DATABASE_URL || 'file:./dev.db',
  },
  
  // SMS Providers
  sms: {
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID || '',
      authToken: process.env.TWILIO_AUTH_TOKEN || '',
    },
    aws: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      region: process.env.AWS_REGION || 'us-east-1',
    },
    azure: {
      connectionString: process.env.AZURE_COMMUNICATION_CONNECTION_STRING || '',
    },
  },
  
  // eSIM Provider
  esim: {
    providerApiKey: process.env.ESIM_PROVIDER_API_KEY || '',
    providerUrl: process.env.ESIM_PROVIDER_URL || 'https://api.esim-provider.com',
  },
  
  // API Configuration
  api: {
    rateLimit: parseInt(process.env.API_RATE_LIMIT || '100'),
    baseUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },
  
  // OpenRouter Configuration for AI features
  openrouter: {
    baseUrl: process.env.OPENROUTER_BASE_URL || 'https://oi-server.onrender.com/chat/completions',
    customerId: process.env.OPENROUTER_CUSTOMER_ID || 'cus_RlpQ2Kbfv1reMX',
    authToken: process.env.OPENROUTER_AUTH_TOKEN || 'xxx',
    defaultModel: 'openrouter/claude-sonnet-4',
  },
  
  // Environment
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

// Validate required environment variables in production
export function validateConfig() {
  if (config.isProduction) {
    const requiredVars = [
      'NEXTAUTH_SECRET',
      'JWT_SECRET',
      'DATABASE_URL',
    ];
    
    const missing = requiredVars.filter(
      varName => !process.env[varName]
    );
    
    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }
}

// Helper to get OpenRouter headers
export function getOpenRouterHeaders() {
  return {
    'customerId': config.openrouter.customerId,
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${config.openrouter.authToken}`,
  };
}