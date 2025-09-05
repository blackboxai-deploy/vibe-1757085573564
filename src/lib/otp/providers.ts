import { SMSProvider } from '../../types';
import { config, getOpenRouterHeaders } from '../config';

/**
 * Demo SMS Provider (for development/testing)
 */
class DemoSMSProvider implements SMSProvider {
  name = 'Demo SMS Provider';
  
  private deliveredMessages = new Set<string>();
  
  async send(to: string, message: string) {
    console.log(`[Demo SMS] Sending to ${to}: ${message}`);
    
    // Simulate random delivery success/failure
    const success = Math.random() > 0.1; // 90% success rate
    
    const messageId = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    if (success) {
      this.deliveredMessages.add(messageId);
      return {
        success: true,
        messageId,
      };
    } else {
      return {
        success: false,
        error: 'Simulated delivery failure',
      };
    }
  }
  
  async getDeliveryStatus(messageId: string) {
    const delivered = this.deliveredMessages.has(messageId);
    return {
      status: delivered ? 'delivered' : 'failed',
      delivered,
    };
  }
}

/**
 * Twilio SMS Provider
 */
class TwilioSMSProvider implements SMSProvider {
  name = 'Twilio';
  
  async send(to: string, message: string) {
    if (!config.sms.twilio.accountSid || !config.sms.twilio.authToken) {
      return {
        success: false,
        error: 'Twilio credentials not configured',
      };
    }
    
    try {
      // In a real implementation, you would use the Twilio SDK here
      // const client = require('twilio')(config.sms.twilio.accountSid, config.sms.twilio.authToken);
      // const result = await client.messages.create({
      //   body: message,
      //   from: '+1234567890', // Your Twilio phone number
      //   to: to
      // });
      
      // For demo, simulate successful send
      const messageId = `twilio_${Date.now()}`;
      console.log(`[Twilio] Would send to ${to}: ${message}`);
      
      return {
        success: true,
        messageId,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  async getDeliveryStatus(messageId: string) {
    // In a real implementation, query Twilio API for status
    return {
      status: 'delivered',
      delivered: true,
    };
  }
}

/**
 * AWS SNS Provider
 */
class AWSSNSProvider implements SMSProvider {
  name = 'AWS SNS';
  
  async send(to: string, message: string) {
    if (!config.sms.aws.accessKeyId || !config.sms.aws.secretAccessKey) {
      return {
        success: false,
        error: 'AWS credentials not configured',
      };
    }
    
    try {
      // In a real implementation, you would use the AWS SDK here
      // const sns = new AWS.SNS({
      //   accessKeyId: config.sms.aws.accessKeyId,
      //   secretAccessKey: config.sms.aws.secretAccessKey,
      //   region: config.sms.aws.region
      // });
      // const result = await sns.publish({
      //   Message: message,
      //   PhoneNumber: to
      // }).promise();
      
      // For demo, simulate successful send
      const messageId = `aws_${Date.now()}`;
      console.log(`[AWS SNS] Would send to ${to}: ${message}`);
      
      return {
        success: true,
        messageId,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
  
  async getDeliveryStatus(messageId: string) {
    // In a real implementation, query AWS CloudWatch for delivery status
    return {
      status: 'delivered',
      delivered: true,
    };
  }
}

/**
 * AI-powered SMS routing provider selector
 */
export class IntelligentSMSRouter {
  private providers: Map<string, SMSProvider>;
  
  constructor() {
    this.providers = new Map([
      ['demo', new DemoSMSProvider()],
      ['twilio', new TwilioSMSProvider()],
      ['aws', new AWSSNSProvider()],
    ]);
  }
  
  /**
   * Use AI to select the best provider based on destination and current conditions
   */
  async selectOptimalProvider(phoneNumber: string, message: string): Promise<{
    provider: SMSProvider;
    reasoning: string;
  }> {
    try {
      // Use AI to determine the best provider
      const response = await fetch(config.openrouter.baseUrl, {
        method: 'POST',
        headers: getOpenRouterHeaders(),
        body: JSON.stringify({
          model: config.openrouter.defaultModel,
          messages: [
            {
              role: 'system',
              content: `You are an intelligent SMS routing system. Based on the phone number and current provider availability, recommend the best SMS provider. Consider factors like geographic coverage, reliability, and cost.
              
Available providers: Demo (testing), Twilio (premium), AWS SNS (enterprise).

Return a JSON response with:
{
  "provider": "demo|twilio|aws",
  "reasoning": "explanation of choice"
}`,
            },
            {
              role: 'user',
              content: `Select the best SMS provider for phone number: ${phoneNumber}. Message length: ${message.length} characters.`,
            }
          ],
          temperature: 0.3,
          max_tokens: 200,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`AI routing failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      const aiResponse = JSON.parse(data.choices[0].message.content);
      
      const selectedProvider = this.providers.get(aiResponse.provider);
      if (!selectedProvider) {
        throw new Error(`Unknown provider: ${aiResponse.provider}`);
      }
      
      return {
        provider: selectedProvider,
        reasoning: aiResponse.reasoning,
      };
    } catch (error) {
      console.error('AI routing failed, falling back to demo provider:', error);
      
      // Fallback to demo provider
      return {
        provider: this.providers.get('demo')!,
        reasoning: 'AI routing unavailable, using demo provider as fallback',
      };
    }
  }
  
  /**
   * Send SMS using the optimal provider
   */
  async sendSMS(phoneNumber: string, message: string, preferredProvider?: string) {
    let provider: SMSProvider;
    let reasoning: string;
    
    if (preferredProvider && this.providers.has(preferredProvider)) {
      provider = this.providers.get(preferredProvider)!;
      reasoning = `Using user-specified provider: ${preferredProvider}`;
    } else {
      const selection = await this.selectOptimalProvider(phoneNumber, message);
      provider = selection.provider;
      reasoning = selection.reasoning;
    }
    
    const result = await provider.send(phoneNumber, message);
    
    return {
      ...result,
      provider: provider.name,
      reasoning,
    };
  }
  
  /**
   * Get all available providers
   */
  getAvailableProviders() {
    return Array.from(this.providers.entries()).map(([id, provider]) => ({
      id,
      name: provider.name,
    }));
  }
}

// Export singleton instance
export const smsRouter = new IntelligentSMSRouter();