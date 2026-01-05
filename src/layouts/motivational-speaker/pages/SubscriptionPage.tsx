'use client';

import { StoreConfig } from '@/lib/store-types';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { CheckCircle, Star, Zap, Crown, ArrowRight, Lock, Users, BookOpen, Video, Headphones, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useStore } from '@/lib/store-context';
import { useToast } from '@/components/ui/toast';
import { cn } from '@/lib/utils';

interface SubscriptionPageProps {
  storeConfig: StoreConfig;
}

interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: number;
  period: 'month' | 'year';
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
  color: string;
}

export function SubscriptionPage({ storeConfig }: SubscriptionPageProps) {
  const router = useRouter();
  const { addToCart } = useStore();
  const { addToast } = useToast();
  const [billingPeriod, setBillingPeriod] = useState<'month' | 'year'>('month');

  const pricingTiers: PricingTier[] = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for getting started',
      price: 0,
      period: 'month',
      features: [
        'Access to 3 free courses',
        'Community forum access',
        'Weekly newsletter',
        'Basic support',
      ],
      icon: <BookOpen className="w-6 h-6" />,
      color: 'bg-gray-500',
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For serious learners',
      price: billingPeriod === 'month' ? 29 : 290,
      period: billingPeriod,
      features: [
        'Unlimited course access',
        'All video courses',
        'Downloadable PDFs',
        'Monthly live Q&A sessions',
        'Priority support',
        'Progress tracking',
      ],
      icon: <Zap className="w-6 h-6" />,
      popular: true,
      color: 'bg-blue-500',
    },
    {
      id: 'elite',
      name: 'Elite',
      description: 'Complete transformation package',
      price: billingPeriod === 'month' ? 99 : 990,
      period: billingPeriod,
      features: [
        'Everything in Pro',
        '1-on-1 coaching sessions (monthly)',
        'Exclusive masterclasses',
        'Early access to new content',
        'Private community access',
        'Personalized learning path',
        'Certificate of completion',
      ],
      icon: <Crown className="w-6 h-6" />,
      color: 'bg-yellow-500',
    },
  ];

  const handleSubscribe = (tier: PricingTier) => {
    if (tier.id === 'free') {
      addToast('Free tier activated! Start exploring our free courses.', 'success');
      setTimeout(() => {
        router.push(`/${storeConfig.slug}/services`);
      }, 1500);
      return;
    }

    // In a real app, this would create a subscription
    // For now, we'll add it to cart as a service/product
    const subscriptionItem = {
      id: `subscription-${tier.id}-${billingPeriod}`,
      name: `${tier.name} Membership (${billingPeriod === 'month' ? 'Monthly' : 'Yearly'})`,
      slug: `subscription-${tier.id}-${billingPeriod}`,
      description: tier.description,
      price: tier.price,
      currency: storeConfig.settings?.currency || 'USD',
      images: ['https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop'],
      categoryId: 'subscriptions',
      inStock: true,
    };

    addToCart(subscriptionItem as any, 1);
    addToast(`${tier.name} membership added to cart`, 'success');
  };

  const breadcrumbItems = [
    { label: storeConfig.name, href: `/${storeConfig.slug}` },
    { label: 'Subscription', href: `/${storeConfig.slug}/subscription` },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold uppercase tracking-widest mb-6">
            <Star className="w-3 h-3" />
            Choose Your Path
          </div>
          <h1 className="text-5xl md:text-6xl font-serif text-gray-900 mb-6 leading-tight">
            Membership Plans
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Unlock your potential with unlimited access to all courses, exclusive content, and a community of like-minded individuals.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={cn("text-sm font-medium", billingPeriod === 'month' ? 'text-gray-900' : 'text-gray-500')}>
              Monthly
            </span>
            <button
              onClick={() => setBillingPeriod(billingPeriod === 'month' ? 'year' : 'month')}
              className={cn(
                "relative w-14 h-8 rounded-full transition-colors",
                billingPeriod === 'year' ? 'bg-yellow-500' : 'bg-gray-300'
              )}
            >
              <motion.div
                layout
                className={cn(
                  "absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg",
                  billingPeriod === 'year' ? 'right-1' : 'left-1'
                )}
              />
            </button>
            <span className={cn("text-sm font-medium", billingPeriod === 'year' ? 'text-gray-900' : 'text-gray-500')}>
              Yearly
              <span className="ml-2 text-yellow-600 font-bold">Save 17%</span>
            </span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pricingTiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={cn(
                "relative bg-white rounded-2xl border-2 p-8 flex flex-col",
                tier.popular
                  ? "border-yellow-500 shadow-2xl scale-105"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all"
              )}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="px-4 py-1 bg-yellow-500 text-black text-xs font-bold uppercase tracking-wider rounded-full">
                    Most Popular
                  </div>
                </div>
              )}

              <div className={cn("w-12 h-12 rounded-full flex items-center justify-center text-white mb-6", tier.color)}>
                {tier.icon}
              </div>

              <h3 className="text-2xl font-serif text-gray-900 mb-2">{tier.name}</h3>
              <p className="text-gray-600 mb-6">{tier.description}</p>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-gray-900">
                    {tier.price === 0 ? 'Free' : formatCurrency(tier.price, storeConfig.settings?.currency || 'USD')}
                  </span>
                  {tier.price > 0 && (
                    <span className="text-gray-500">/{tier.period === 'month' ? 'mo' : 'yr'}</span>
                  )}
                </div>
                {tier.price > 0 && billingPeriod === 'year' && (
                  <p className="text-sm text-gray-500 mt-1">
                    {formatCurrency(tier.price / 12, storeConfig.settings?.currency || 'USD')} per month
                  </p>
                )}
              </div>

              <ul className="space-y-4 mb-8 flex-1">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                onClick={() => handleSubscribe(tier)}
                className={cn(
                  "w-full h-14 rounded-full font-bold text-lg transition-all",
                  tier.popular
                    ? "bg-yellow-500 text-black hover:bg-yellow-400 hover:shadow-xl transform hover:-translate-y-1"
                    : tier.id === 'free'
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "bg-black text-white hover:bg-gray-800"
                )}
              >
                {tier.id === 'free' ? 'Get Started Free' : 'Subscribe Now'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Features Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl border-2 border-gray-200 p-8 mb-16"
        >
          <h2 className="text-3xl font-serif text-gray-900 mb-8 text-center">What&apos;s Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Video className="w-8 h-8" />,
                title: 'Unlimited Courses',
                description: 'Access to all video courses, audiobooks, and PDF guides',
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: 'Community Access',
                description: 'Join a community of like-minded individuals on the same journey',
              },
              {
                icon: <Headphones className="w-8 h-8" />,
                title: 'Live Sessions',
                description: 'Monthly Q&A sessions and exclusive masterclasses',
              },
            ].map((feature, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-700">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-serif text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: 'Can I cancel my subscription anytime?',
                answer: 'Yes, you can cancel your subscription at any time. You\'ll continue to have access until the end of your billing period.',
              },
              {
                question: 'What happens if I upgrade or downgrade?',
                answer: 'You can upgrade or downgrade at any time. Changes take effect immediately, and we\'ll prorate the difference.',
              },
              {
                question: 'Do you offer refunds?',
                answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied, contact us for a full refund.',
              },
            ].map((faq, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-6 text-left">
                <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl p-12 text-white">
            <h2 className="text-4xl font-serif mb-4">Ready to Transform Your Life?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already on their journey to success.
            </p>
            <Link href={`/${storeConfig.slug}/services`}>
              <Button
                size="lg"
                className="h-16 px-12 rounded-full bg-yellow-500 text-black hover:bg-yellow-400 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
              >
                Browse All Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

