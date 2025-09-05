import { ESIMProvider, ESIMProfile } from '../../types';
import { config } from '../config';
import QRCode from 'qrcode';

/**
 * Demo eSIM Provider (for development/testing)
 */
class DemoESIMProvider implements ESIMProvider {
  name = 'Demo eSIM Provider';
  
  private profiles = new Map<string, ESIMProfile>();
  
  async createProfile(country: string, plan: string): Promise<ESIMProfile> {
    const iccid = this.generateICCID();
    const msisdn = this.generateMSISDN(country);
    const activationCode = this.generateActivationCode();
    
    // Generate QR code for eSIM activation
    const qrCode = await QRCode.toDataURL(
      `LPA:1$activation.provider.com$${activationCode}`,
      {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      }
    );
    
    const profile: ESIMProfile = {
      id: `esim_${Date.now()}`,
      iccid,
      msisdn,
      country,
      provider: this.name,
      dataplan: plan,
      status: 'inactive',
      activationCode,
      qrCode,
      userId: '', // Will be set by the API
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      dataUsed: 0,
      dataLimit: this.getPlanDataLimit(plan),
    };
    
    this.profiles.set(iccid, profile);
    console.log(`[Demo eSIM] Created profile for ${country} with plan ${plan}`);
    
    return profile;
  }
  
  async activateProfile(iccid: string): Promise<boolean> {
    const profile = this.profiles.get(iccid);
    if (!profile) {
      throw new Error('Profile not found');
    }
    
    if (profile.status === 'active') {
      return true; // Already active
    }
    
    // Simulate activation process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    profile.status = 'active';
    this.profiles.set(iccid, profile);
    
    console.log(`[Demo eSIM] Activated profile ${iccid}`);
    return true;
  }
  
  async deactivateProfile(iccid: string): Promise<boolean> {
    const profile = this.profiles.get(iccid);
    if (!profile) {
      throw new Error('Profile not found');
    }
    
    profile.status = 'inactive';
    this.profiles.set(iccid, profile);
    
    console.log(`[Demo eSIM] Deactivated profile ${iccid}`);
    return true;
  }
  
  async getUsage(iccid: string): Promise<{ used: number; remaining: number }> {
    const profile = this.profiles.get(iccid);
    if (!profile) {
      throw new Error('Profile not found');
    }
    
    // Simulate some data usage
    const used = Math.floor(Math.random() * profile.dataLimit * 0.8);
    const remaining = profile.dataLimit - used;
    
    return { used, remaining };
  }
  
  private generateICCID(): string {
    // Generate a valid ICCID (20 digits)
    let iccid = '8944';
    for (let i = 0; i < 16; i++) {
      iccid += Math.floor(Math.random() * 10).toString();
    }
    return iccid;
  }
  
  private generateMSISDN(country: string): string {
    const countryPrefixes: { [key: string]: string } = {
      'US': '+1',
      'GB': '+44',
      'DE': '+49',
      'FR': '+33',
      'JP': '+81',
      'AU': '+61',
    };
    
    const prefix = countryPrefixes[country] || '+1';
    let number = prefix;
    
    for (let i = 0; i < 10; i++) {
      number += Math.floor(Math.random() * 10).toString();
    }
    
    return number;
  }
  
  private generateActivationCode(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
  
  private getPlanDataLimit(plan: string): number {
    const planLimits: { [key: string]: number } = {
      '1gb-7d': 1024,
      '3gb-15d': 3072,
      '5gb-30d': 5120,
      '10gb-30d': 10240,
      '20gb-30d': 20480,
      'unlimited-30d': 999999,
    };
    
    return planLimits[plan] || 1024;
  }
}

/**
 * Enterprise eSIM Provider
 */
class EnterpriseESIMProvider implements ESIMProvider {
  name = 'Enterprise eSIM Provider';
  
  async createProfile(country: string, plan: string): Promise<ESIMProfile> {
    if (!config.esim.providerApiKey) {
      throw new Error('eSIM provider credentials not configured');
    }
    
    try {
      // In a real implementation, make API call to actual eSIM provider
      // const response = await fetch(`${config.esim.providerUrl}/profiles`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${config.esim.providerApiKey}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     country,
      //     plan,
      //   }),
      // });
      
      // For demo, create a simulated profile
      const iccid = this.generateICCID();
      const activationCode = `ENT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const qrCode = await QRCode.toDataURL(
        `LPA:1$enterprise.esim.com$${activationCode}`,
        { width: 256, margin: 2 }
      );
      
      const profile: ESIMProfile = {
        id: `ent_esim_${Date.now()}`,
        iccid,
        msisdn: this.generateMSISDN(country),
        country,
        provider: this.name,
        dataplan: plan,
        status: 'inactive',
        activationCode,
        qrCode,
        userId: '',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        dataUsed: 0,
        dataLimit: this.getPlanDataLimit(plan),
      };
      
      console.log(`[Enterprise eSIM] Created profile for ${country}`);
      return profile;
      
    } catch (error) {
      throw new Error(`Failed to create eSIM profile: ${error}`);
    }
  }
  
  async activateProfile(iccid: string): Promise<boolean> {
    console.log(`[Enterprise eSIM] Activating profile ${iccid}`);
    return true;
  }
  
  async deactivateProfile(iccid: string): Promise<boolean> {
    console.log(`[Enterprise eSIM] Deactivating profile ${iccid}`);
    return true;
  }
  
  async getUsage(iccid: string): Promise<{ used: number; remaining: number }> {
    // Simulate API call to get real usage data
    return {
      used: Math.floor(Math.random() * 1000),
      remaining: Math.floor(Math.random() * 2000),
    };
  }
  
  private generateICCID(): string {
    let iccid = '8944';
    for (let i = 0; i < 16; i++) {
      iccid += Math.floor(Math.random() * 10).toString();
    }
    return iccid;
  }
  
  private generateMSISDN(country: string): string {
    const countryPrefixes: { [key: string]: string } = {
      'US': '+1',
      'GB': '+44',
      'DE': '+49',
      'FR': '+33',
      'JP': '+81',
      'AU': '+61',
    };
    
    const prefix = countryPrefixes[country] || '+1';
    let number = prefix + '555';
    
    for (let i = 0; i < 7; i++) {
      number += Math.floor(Math.random() * 10).toString();
    }
    
    return number;
  }
  
  private getPlanDataLimit(plan: string): number {
    const planLimits: { [key: string]: number } = {
      '1gb-7d': 1024,
      '3gb-15d': 3072,
      '5gb-30d': 5120,
      '10gb-30d': 10240,
      '20gb-30d': 20480,
      'unlimited-30d': 999999,
    };
    
    return planLimits[plan] || 1024;
  }
}

/**
 * eSIM Manager with intelligent provider selection
 */
export class IntelligentESIMManager {
  private providers: Map<string, ESIMProvider>;
  
  constructor() {
    this.providers = new Map([
      ['demo', new DemoESIMProvider()],
      ['enterprise', new EnterpriseESIMProvider()],
    ]);
  }
  
  /**
   * Select optimal eSIM provider based on country and requirements
   */
  async selectOptimalProvider(country: string, plan: string): Promise<{
    provider: ESIMProvider;
    reasoning: string;
  }> {
    try {
      // In a real implementation, use AI to select provider based on:
      // - Country coverage
      // - Provider reliability
      // - Cost optimization
      // - Data plan availability
      
      // For demo, use simple logic
      if (config.esim.providerApiKey && ['US', 'GB', 'DE', 'FR'].includes(country)) {
        return {
          provider: this.providers.get('enterprise')!,
          reasoning: `Enterprise provider selected for ${country} - premium coverage available`,
        };
      } else {
        return {
          provider: this.providers.get('demo')!,
          reasoning: `Demo provider selected for ${country} - testing environment`,
        };
      }
      
    } catch (error) {
      console.error('Provider selection failed, using demo provider:', error);
      return {
        provider: this.providers.get('demo')!,
        reasoning: 'Provider selection failed, using demo provider as fallback',
      };
    }
  }
  
  /**
   * Create eSIM profile using optimal provider
   */
  async createProfile(country: string, plan: string, preferredProvider?: string): Promise<ESIMProfile & { reasoning: string }> {
    let provider: ESIMProvider;
    let reasoning: string;
    
    if (preferredProvider && this.providers.has(preferredProvider)) {
      provider = this.providers.get(preferredProvider)!;
      reasoning = `Using user-specified provider: ${preferredProvider}`;
    } else {
      const selection = await this.selectOptimalProvider(country, plan);
      provider = selection.provider;
      reasoning = selection.reasoning;
    }
    
    const profile = await provider.createProfile(country, plan);
    
    return {
      ...profile,
      reasoning,
    };
  }
  
  getAvailableProviders() {
    return Array.from(this.providers.entries()).map(([id, provider]) => ({
      id,
      name: provider.name,
    }));
  }
}

// Export singleton instance
export const esimManager = new IntelligentESIMManager();