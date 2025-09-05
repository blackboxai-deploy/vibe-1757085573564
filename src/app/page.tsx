'use client';

import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import Link from 'next/link';

export default function HomePage() {
  const features = [
    {
      title: 'Global OTP SMS',
      description: 'Send OTP messages to 200+ countries with intelligent routing',
      stats: '99.9% delivery rate',
      color: 'bg-blue-500',
    },
    {
      title: 'eSIM Management',
      description: 'Instant eSIM activation for global connectivity',
      stats: '150+ countries',
      color: 'bg-green-500',
    },
    {
      title: 'AI-Powered Routing',
      description: 'Smart provider selection for optimal delivery',
      stats: 'Sub-second routing',
      color: 'bg-purple-500',
    },
    {
      title: 'Enterprise APIs',
      description: 'RESTful APIs with comprehensive documentation',
      stats: '99.99% uptime',
      color: 'bg-orange-500',
    },
  ];

  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      description: 'Perfect for testing and small projects',
      features: [
        '1,000 OTP SMS/month',
        '2 eSIM profiles',
        'Basic analytics',
        'Email support',
      ],
      cta: 'Get Started',
      popular: false,
    },
    {
      name: 'Professional',
      price: '$49/month',
      description: 'For growing businesses',
      features: [
        '50,000 OTP SMS/month',
        '50 eSIM profiles',
        'Advanced analytics',
        'Priority support',
        'Custom branding',
        'Webhook integration',
      ],
      cta: 'Start Free Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large-scale operations',
      features: [
        'Unlimited SMS',
        'Unlimited eSIM profiles',
        'Real-time analytics',
        '24/7 phone support',
        'White-label solution',
        'Dedicated account manager',
        'SLA guarantee',
      ],
      cta: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <div className=\"min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800\">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-slate-900/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded bg-gradient-to-r from-blue-600 to-purple-600"></div>
            <h1 className="text-xl font-bold">GlobalSIM Pro</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Features
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Pricing
            </a>
            <a href="#docs" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              Docs
            </a>
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Global OTP SMS & eSIM Platform
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Send OTP messages worldwide with AI-powered routing and manage global eSIM connectivity 
              through our enterprise-grade APIs. Built for developers, trusted by businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="text-lg px-8 py-3">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/docs">
                <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                  View Documentation
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>✅ No setup fees</span>
              <span>✅ 14-day free trial</span>
              <span>✅ Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id=\"features\" className=\"py-20 px-4 bg-white dark:bg-slate-900\">
        <div className=\"container mx-auto\">
          <div className=\"text-center mb-16\">
            <h2 className=\"text-3xl font-bold mb-4\">Powerful Features</h2>
            <p className=\"text-gray-600 dark:text-gray-300 max-w-2xl mx-auto\">
              Everything you need to build reliable communication systems with global reach
            </p>
          </div>
          <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6\">
            {features.map((feature, index) => (
              <Card key={index} className=\"border-0 shadow-lg hover:shadow-xl transition-shadow\">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.color} mb-4 flex items-center justify-center`}>
                    <div className=\"w-6 h-6 bg-white rounded opacity-80\"></div>
                  </div>
                  <CardTitle className=\"text-lg\">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant=\"secondary\">{feature.stats}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id=\"pricing\" className=\"py-20 px-4\">
        <div className=\"container mx-auto\">
          <div className=\"text-center mb-16\">
            <h2 className=\"text-3xl font-bold mb-4\">Simple, Transparent Pricing</h2>
            <p className=\"text-gray-600 dark:text-gray-300 max-w-2xl mx-auto\">
              Choose the plan that fits your needs. All plans include our core features.
            </p>
          </div>
          <div className=\"grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto\">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative border-2 shadow-lg hover:shadow-xl transition-shadow ${
                  plan.popular ? 'border-blue-500 scale-105' : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {plan.popular && (
                  <div className=\"absolute -top-3 left-1/2 transform -translate-x-1/2\">
                    <Badge className=\"bg-blue-500 text-white px-3 py-1\">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className=\"text-center pb-4\">
                  <CardTitle className=\"text-2xl font-bold\">{plan.name}</CardTitle>
                  <div className=\"text-3xl font-bold text-blue-600\">{plan.price}</div>
                  <CardDescription className=\"mt-2\">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className=\"space-y-4\">
                  <ul className=\"space-y-2\">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className=\"flex items-center text-sm\">
                        <span className=\"text-green-500 mr-2\">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className=\"w-full mt-6\" 
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className=\"py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white\">
        <div className=\"container mx-auto text-center\">
          <h2 className=\"text-3xl font-bold mb-4\">Ready to Get Started?</h2>
          <p className=\"text-xl opacity-90 mb-8 max-w-2xl mx-auto\">
            Join thousands of developers and businesses using GlobalSIM Pro for reliable 
            communication infrastructure.
          </p>
          <div className=\"flex flex-col sm:flex-row gap-4 justify-center\">
            <Link href=\"/register\">
              <Button size=\"lg\" variant=\"secondary\" className=\"text-lg px-8 py-3\">
                Start Free Trial
              </Button>
            </Link>
            <Link href=\"/dashboard\">
              <Button size=\"lg\" variant=\"outline\" className=\"text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-blue-600\">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className=\"bg-slate-900 text-white py-12 px-4\">
        <div className=\"container mx-auto\">
          <div className=\"grid grid-cols-1 md:grid-cols-4 gap-8\">
            <div>
              <div className=\"flex items-center space-x-2 mb-4\">
                <div className=\"h-8 w-8 rounded bg-gradient-to-r from-blue-600 to-purple-600\"></div>
                <h3 className=\"text-lg font-bold\">GlobalSIM Pro</h3>
              </div>
              <p className=\"text-gray-400 text-sm\">
                Global OTP SMS and eSIM management platform for developers and businesses.
              </p>
            </div>
            <div>
              <h4 className=\"font-semibold mb-4\">Product</h4>
              <ul className=\"space-y-2 text-sm text-gray-400\">
                <li><a href=\"#\" className=\"hover:text-white\">Features</a></li>
                <li><a href=\"#\" className=\"hover:text-white\">Pricing</a></li>
                <li><a href=\"#\" className=\"hover:text-white\">Documentation</a></li>
                <li><a href=\"#\" className=\"hover:text-white\">API Reference</a></li>
              </ul>
            </div>
            <div>
              <h4 className=\"font-semibold mb-4\">Support</h4>
              <ul className=\"space-y-2 text-sm text-gray-400\">
                <li><a href=\"#\" className=\"hover:text-white\">Help Center</a></li>
                <li><a href=\"#\" className=\"hover:text-white\">Contact Us</a></li>
                <li><a href=\"#\" className=\"hover:text-white\">Status Page</a></li>
                <li><a href=\"#\" className=\"hover:text-white\">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className=\"font-semibold mb-4\">Company</h4>
              <ul className=\"space-y-2 text-sm text-gray-400\">
                <li><a href=\"#\" className=\"hover:text-white\">About</a></li>
                <li><a href=\"#\" className=\"hover:text-white\">Privacy Policy</a></li>
                <li><a href=\"#\" className=\"hover:text-white\">Terms of Service</a></li>
                <li><a href=\"#\" className=\"hover:text-white\">Security</a></li>
              </ul>
            </div>
          </div>
          <div className=\"border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm\">
            © 2024 GlobalSIM Pro. All rights reserved. Built with Next.js and powered by AI.
          </div>
        </div>
      </footer>
    </div>
  );
}