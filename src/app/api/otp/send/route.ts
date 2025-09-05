import { NextRequest, NextResponse } from 'next/server';
import { sendOTPSchema } from '../../../../lib/validation';
import { generateOTP, formatPhoneNumber, isValidPhoneNumber, generateOTPMessage } from '../../../../lib/otp/generator';
import { smsRouter } from '../../../../lib/otp/providers';
import { checkRateLimit } from '../../../../lib/auth';

// In-memory storage for demo (use database in production)
const otpRecords = new Map<string, {
  hash: string;
  expiresAt: Date;
  attempts: number;
  phoneNumber: string;
}>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    const validation = sendOTPSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { phoneNumber: rawPhone, template, provider } = validation.data;
    
    // Format and validate phone number
    const phoneNumber = formatPhoneNumber(rawPhone);
    if (!isValidPhoneNumber(phoneNumber)) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Rate limiting check
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateKey = `otp:${clientIP}:${phoneNumber}`;
    const rateLimit = checkRateLimit(rateKey, 5, 60 * 1000); // 5 requests per minute
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded. Please try again later.',
          resetTime: rateLimit.resetTime 
        },
        { status: 429 }
      );
    }

    // Generate OTP
    const otp = generateOTP();
    const message = template || generateOTPMessage(otp.code);
    
    // Send SMS using intelligent routing
    const smsResult = await smsRouter.sendSMS(phoneNumber, message, provider);
    
    if (!smsResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to send SMS', 
          details: smsResult.error 
        },
        { status: 500 }
      );
    }

    // Store OTP record (hashed)
    otpRecords.set(phoneNumber, {
      hash: otp.hash,
      expiresAt: otp.expiresAt,
      attempts: 0,
      phoneNumber,
    });

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        phoneNumber,
        messageId: smsResult.messageId,
        provider: smsResult.provider,
        reasoning: smsResult.reasoning,
        expiresAt: otp.expiresAt,
        remaining: rateLimit.remaining,
      }
    });

  } catch (error) {
    console.error('Send OTP error:', error);
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
      error: 'Method not allowed. Use POST to send OTP.' 
    },
    { status: 405 }
  );
}