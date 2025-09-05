import { NextRequest, NextResponse } from 'next/server';
import { verifyOTPSchema } from '../../../../lib/validation';
import { formatPhoneNumber, verifyOTP, isOTPExpired } from '../../../../lib/otp/generator';
import { checkRateLimit } from '../../../../lib/auth';

// Access the same in-memory storage as send endpoint
const otpRecords = new Map<string, {
  hash: string;
  expiresAt: Date;
  attempts: number;
  phoneNumber: string;
}>();

// Import from send route would be better, but for demo this works
declare global {
  var otpRecordsGlobal: typeof otpRecords;
}

if (!global.otpRecordsGlobal) {
  global.otpRecordsGlobal = otpRecords;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    const validation = verifyOTPSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { phoneNumber: rawPhone, code } = validation.data;
    
    // Format phone number
    const phoneNumber = formatPhoneNumber(rawPhone);
    
    // Rate limiting check
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateKey = `verify:${clientIP}:${phoneNumber}`;
    const rateLimit = checkRateLimit(rateKey, 10, 5 * 60 * 1000); // 10 attempts per 5 minutes
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Too many verification attempts. Please try again later.',
          resetTime: rateLimit.resetTime 
        },
        { status: 429 }
      );
    }

    // Get OTP record
    const record = global.otpRecordsGlobal.get(phoneNumber);
    if (!record) {
      return NextResponse.json(
        { success: false, error: 'No OTP found for this phone number' },
        { status: 404 }
      );
    }

    // Check if OTP has expired
    if (isOTPExpired(record.expiresAt)) {
      global.otpRecordsGlobal.delete(phoneNumber);
      return NextResponse.json(
        { success: false, error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Increment attempts
    record.attempts++;
    if (record.attempts > 3) {
      global.otpRecordsGlobal.delete(phoneNumber);
      return NextResponse.json(
        { success: false, error: 'Maximum verification attempts exceeded' },
        { status: 400 }
      );
    }

    // Verify OTP
    const isValid = verifyOTP(code, record.hash);
    
    if (!isValid) {
      global.otpRecordsGlobal.set(phoneNumber, record);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid OTP code',
          attemptsRemaining: 3 - record.attempts 
        },
        { status: 400 }
      );
    }

    // Success - remove OTP record
    global.otpRecordsGlobal.delete(phoneNumber);

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        phoneNumber,
        verifiedAt: new Date().toISOString(),
        remaining: rateLimit.remaining,
      }
    });

  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Method not allowed. Use POST to verify OTP.' 
    },
    { status: 405 }
  );
}