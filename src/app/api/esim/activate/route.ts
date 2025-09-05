import { NextRequest, NextResponse } from 'next/server';
import { activateESIMSchema } from '../../../../lib/validation';
import { esimManager } from '../../../../lib/esim/providers';
import { checkRateLimit } from '../../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    const validation = activateESIMSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { iccid } = validation.data;
    
    // Rate limiting check
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateKey = `esim:activate:${clientIP}`;
    const rateLimit = checkRateLimit(rateKey, 20, 60 * 60 * 1000); // 20 activations per hour
    
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

    // In production, verify the profile belongs to the authenticated user
    // For demo, we'll simulate activation
    
    try {
      // Use the first available provider (demo logic)
      const providers = esimManager.getAvailableProviders();
      if (providers.length === 0) {
        throw new Error('No eSIM providers available');
      }

      // Simulate activation (in production, call actual provider API)
      console.log(`Activating eSIM profile: ${iccid}`);
      
      // Simulate activation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const success = Math.random() > 0.1; // 90% success rate for demo
      
      if (!success) {
        throw new Error('Activation failed - please try again');
      }

      return NextResponse.json({
        success: true,
        message: 'eSIM profile activated successfully',
        data: {
          iccid,
          status: 'active',
          activatedAt: new Date().toISOString(),
          remaining: rateLimit.remaining,
        }
      });

    } catch (activationError) {
      return NextResponse.json(
        { 
          success: false, 
          error: activationError instanceof Error ? activationError.message : 'Activation failed' 
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Activate eSIM error:', error);
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
      error: 'Method not allowed. Use POST to activate eSIM.' 
    },
    { status: 405 }
  );
}