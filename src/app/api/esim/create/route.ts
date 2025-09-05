import { NextRequest, NextResponse } from 'next/server';
import { createESIMSchema } from '../../../../lib/validation';
import { esimManager } from '../../../../lib/esim/providers';
import { checkRateLimit } from '../../../../lib/auth';
import { SUPPORTED_COUNTRIES, DATA_PLANS } from '../../../../lib/constants';

// In-memory storage for demo (use database in production)
const esimProfiles = new Map();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request
    const validation = createESIMSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { country, dataplan, provider } = validation.data;
    
    // Check if country is supported
    const supportedCountry = SUPPORTED_COUNTRIES.find(c => c.code === country);
    if (!supportedCountry || !supportedCountry.available) {
      return NextResponse.json(
        { success: false, error: 'Country not supported' },
        { status: 400 }
      );
    }

    // Check if data plan exists
    const plan = DATA_PLANS.find(p => p.id === dataplan);
    if (!plan) {
      return NextResponse.json(
        { success: false, error: 'Invalid data plan' },
        { status: 400 }
      );
    }

    // Rate limiting check
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateKey = `esim:create:${clientIP}`;
    const rateLimit = checkRateLimit(rateKey, 10, 60 * 60 * 1000); // 10 profiles per hour
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Rate limit exceeded. You can create up to 10 eSIM profiles per hour.',
          resetTime: rateLimit.resetTime 
        },
        { status: 429 }
      );
    }

    // Create eSIM profile using intelligent provider selection
    const profile = await esimManager.createProfile(country, dataplan, provider);
    
    // Store profile (in production, save to database with user association)
    esimProfiles.set(profile.iccid, {
      ...profile,
      userId: 'demo-user', // In production, get from session
    });

    return NextResponse.json({
      success: true,
      message: 'eSIM profile created successfully',
      data: {
        id: profile.id,
        iccid: profile.iccid,
        msisdn: profile.msisdn,
        country: supportedCountry.name,
        countryCode: country,
        dataplan: plan,
        provider: profile.provider,
        status: profile.status,
        qrCode: profile.qrCode,
        activationCode: profile.activationCode,
        expiresAt: profile.expiresAt,
        reasoning: profile.reasoning,
        remaining: rateLimit.remaining,
      }
    });

  } catch (error) {
    console.error('Create eSIM error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create eSIM profile' },
      { status: 500 }
    );
  }
}

export async function GET() {
  // List available countries and data plans
  return NextResponse.json({
    success: true,
    data: {
      supportedCountries: SUPPORTED_COUNTRIES.filter(c => c.available),
      dataPlans: DATA_PLANS,
      providers: esimManager.getAvailableProviders(),
    }
  });
}