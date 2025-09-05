import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from './config';

// In-memory user storage for demo (in production, use a real database)
const users = new Map<string, {
  id: string;
  email: string;
  name: string;
  password: string;
  role: 'USER' | 'ADMIN';
  createdAt: Date;
}>();

// Create default admin user
const adminPassword = bcrypt.hashSync('admin123', 12);
users.set('admin@example.com', {
  id: 'admin-1',
  email: 'admin@example.com',
  name: 'Admin User',
  password: adminPassword,
  role: 'ADMIN',
  createdAt: new Date(),
});

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = users.get(credentials.email);
        if (!user) {
          return null;
        }

        const isPasswordValid = bcrypt.compareSync(credentials.password, user.password);
        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: config.auth.jwtSecret,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.userId;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    signUp: '/register',
  },
  secret: config.auth.secret,
};

/**
 * Register a new user
 */
export async function registerUser(email: string, name: string, password: string) {
  if (users.has(email)) {
    throw new Error('User already exists');
  }

  const hashedPassword = bcrypt.hashSync(password, 12);
  const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const newUser = {
    id: userId,
    email,
    name,
    password: hashedPassword,
    role: 'USER' as const,
    createdAt: new Date(),
  };

  users.set(email, newUser);
  
  return {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
  };
}

/**
 * Get user by email
 */
export function getUserByEmail(email: string) {
  const user = users.get(email);
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
  };
}

/**
 * Get user by ID
 */
export function getUserById(id: string) {
  for (const user of users.values()) {
    if (user.id === id) {
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      };
    }
  }
  return null;
}

/**
 * Generate API key for user
 */
export function generateAPIKey(userId: string): string {
  const payload = {
    userId,
    type: 'api_key',
    iat: Math.floor(Date.now() / 1000),
  };
  
  return jwt.sign(payload, config.auth.jwtSecret, { expiresIn: '365d' });
}

/**
 * Verify API key
 */
export function verifyAPIKey(apiKey: string): { userId: string } | null {
  try {
    const payload = jwt.verify(apiKey, config.auth.jwtSecret) as any;
    if (payload.type === 'api_key' && payload.userId) {
      return { userId: payload.userId };
    }
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Check if user has required role
 */
export function hasRole(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = ['USER', 'ADMIN'];
  const userLevel = roleHierarchy.indexOf(userRole);
  const requiredLevel = roleHierarchy.indexOf(requiredRole);
  
  return userLevel >= requiredLevel;
}

/**
 * Rate limiting storage (in-memory for demo)
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Check rate limit for user/IP
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    // New window
    const resetTime = now + windowMs;
    rateLimitStore.set(key, { count: 1, resetTime });
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime,
    };
  }
  
  if (record.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }
  
  record.count++;
  rateLimitStore.set(key, record);
  
  return {
    allowed: true,
    remaining: limit - record.count,
    resetTime: record.resetTime,
  };
}

// Export users for debugging (remove in production)
export { users };