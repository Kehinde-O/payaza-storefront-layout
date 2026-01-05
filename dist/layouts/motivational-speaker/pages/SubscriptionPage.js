'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '../../../components/ui/button';
import { Breadcrumbs } from '../../../components/ui/breadcrumbs';
import { CheckCircle, Star, Zap, Crown, ArrowRight, Users, BookOpen, Video, Headphones } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '../../../lib/utils';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useStore } from '../../../lib/store-context';
import { useToast } from '../../../components/ui/toast';
import { cn } from '../../../lib/utils';
export function SubscriptionPage({ storeConfig }) {
    const router = useRouter();
    const { addToCart } = useStore();
    const { addToast } = useToast();
    const [billingPeriod, setBillingPeriod] = useState('month');
    const pricingTiers = [
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
            icon: _jsx(BookOpen, { className: "w-6 h-6" }),
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
            icon: _jsx(Zap, { className: "w-6 h-6" }),
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
            icon: _jsx(Crown, { className: "w-6 h-6" }),
            color: 'bg-yellow-500',
        },
    ];
    const handleSubscribe = (tier) => {
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
        addToCart(subscriptionItem, 1);
        addToast(`${tier.name} membership added to cart`, 'success');
    };
    const breadcrumbItems = [
        { label: storeConfig.name, href: `/${storeConfig.slug}` },
        { label: 'Subscription', href: `/${storeConfig.slug}/subscription` },
    ];
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-gray-50 to-white", children: _jsxs("div", { className: "container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl", children: [_jsx("div", { className: "mb-8", children: _jsx(Breadcrumbs, { items: breadcrumbItems }) }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, className: "text-center mb-16", children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold uppercase tracking-widest mb-6", children: [_jsx(Star, { className: "w-3 h-3" }), "Choose Your Path"] }), _jsx("h1", { className: "text-5xl md:text-6xl font-serif text-gray-900 mb-6 leading-tight", children: "Membership Plans" }), _jsx("p", { className: "text-xl text-gray-600 max-w-2xl mx-auto mb-8", children: "Unlock your potential with unlimited access to all courses, exclusive content, and a community of like-minded individuals." }), _jsxs("div", { className: "flex items-center justify-center gap-4", children: [_jsx("span", { className: cn("text-sm font-medium", billingPeriod === 'month' ? 'text-gray-900' : 'text-gray-500'), children: "Monthly" }), _jsx("button", { onClick: () => setBillingPeriod(billingPeriod === 'month' ? 'year' : 'month'), className: cn("relative w-14 h-8 rounded-full transition-colors", billingPeriod === 'year' ? 'bg-yellow-500' : 'bg-gray-300'), children: _jsx(motion.div, { layout: true, className: cn("absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg", billingPeriod === 'year' ? 'right-1' : 'left-1') }) }), _jsxs("span", { className: cn("text-sm font-medium", billingPeriod === 'year' ? 'text-gray-900' : 'text-gray-500'), children: ["Yearly", _jsx("span", { className: "ml-2 text-yellow-600 font-bold", children: "Save 17%" })] })] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8 mb-16", children: pricingTiers.map((tier, index) => (_jsxs(motion.div, { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: index * 0.1 }, className: cn("relative bg-white rounded-2xl border-2 p-8 flex flex-col", tier.popular
                            ? "border-yellow-500 shadow-2xl scale-105"
                            : "border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all"), children: [tier.popular && (_jsx("div", { className: "absolute -top-4 left-1/2 -translate-x-1/2", children: _jsx("div", { className: "px-4 py-1 bg-yellow-500 text-black text-xs font-bold uppercase tracking-wider rounded-full", children: "Most Popular" }) })), _jsx("div", { className: cn("w-12 h-12 rounded-full flex items-center justify-center text-white mb-6", tier.color), children: tier.icon }), _jsx("h3", { className: "text-2xl font-serif text-gray-900 mb-2", children: tier.name }), _jsx("p", { className: "text-gray-600 mb-6", children: tier.description }), _jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "flex items-baseline gap-2", children: [_jsx("span", { className: "text-5xl font-bold text-gray-900", children: tier.price === 0 ? 'Free' : formatCurrency(tier.price, storeConfig.settings?.currency || 'USD') }), tier.price > 0 && (_jsxs("span", { className: "text-gray-500", children: ["/", tier.period === 'month' ? 'mo' : 'yr'] }))] }), tier.price > 0 && billingPeriod === 'year' && (_jsxs("p", { className: "text-sm text-gray-500 mt-1", children: [formatCurrency(tier.price / 12, storeConfig.settings?.currency || 'USD'), " per month"] }))] }), _jsx("ul", { className: "space-y-4 mb-8 flex-1", children: tier.features.map((feature, i) => (_jsxs("li", { className: "flex items-start gap-3", children: [_jsx(CheckCircle, { className: "w-5 h-5 text-green-500 shrink-0 mt-0.5" }), _jsx("span", { className: "text-gray-700", children: feature })] }, i))) }), _jsxs(Button, { size: "lg", onClick: () => handleSubscribe(tier), className: cn("w-full h-14 rounded-full font-bold text-lg transition-all", tier.popular
                                    ? "bg-yellow-500 text-black hover:bg-yellow-400 hover:shadow-xl transform hover:-translate-y-1"
                                    : tier.id === 'free'
                                        ? "bg-gray-900 text-white hover:bg-gray-800"
                                        : "bg-black text-white hover:bg-gray-800"), children: [tier.id === 'free' ? 'Get Started Free' : 'Subscribe Now', _jsx(ArrowRight, { className: "ml-2 h-5 w-5" })] })] }, tier.id))) }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 }, className: "bg-white rounded-2xl border-2 border-gray-200 p-8 mb-16", children: [_jsx("h2", { className: "text-3xl font-serif text-gray-900 mb-8 text-center", children: "What's Included" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: [
                                {
                                    icon: _jsx(Video, { className: "w-8 h-8" }),
                                    title: 'Unlimited Courses',
                                    description: 'Access to all video courses, audiobooks, and PDF guides',
                                },
                                {
                                    icon: _jsx(Users, { className: "w-8 h-8" }),
                                    title: 'Community Access',
                                    description: 'Join a community of like-minded individuals on the same journey',
                                },
                                {
                                    icon: _jsx(Headphones, { className: "w-8 h-8" }),
                                    title: 'Live Sessions',
                                    description: 'Monthly Q&A sessions and exclusive masterclasses',
                                },
                            ].map((feature, i) => (_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-700", children: feature.icon }), _jsx("h3", { className: "text-xl font-semibold text-gray-900 mb-2", children: feature.title }), _jsx("p", { className: "text-gray-600", children: feature.description })] }, i))) })] }), _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 }, className: "text-center", children: [_jsx("h2", { className: "text-3xl font-serif text-gray-900 mb-8", children: "Frequently Asked Questions" }), _jsx("div", { className: "max-w-3xl mx-auto space-y-4", children: [
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
                            ].map((faq, i) => (_jsxs("div", { className: "bg-gray-50 rounded-lg p-6 text-left", children: [_jsx("h4", { className: "font-semibold text-gray-900 mb-2", children: faq.question }), _jsx("p", { className: "text-gray-600", children: faq.answer })] }, i))) })] }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 }, className: "mt-16 text-center", children: _jsxs("div", { className: "bg-gradient-to-br from-gray-900 to-black rounded-2xl p-12 text-white", children: [_jsx("h2", { className: "text-4xl font-serif mb-4", children: "Ready to Transform Your Life?" }), _jsx("p", { className: "text-xl text-gray-300 mb-8 max-w-2xl mx-auto", children: "Join thousands of students who are already on their journey to success." }), _jsx(Link, { href: `/${storeConfig.slug}/services`, children: _jsxs(Button, { size: "lg", className: "h-16 px-12 rounded-full bg-yellow-500 text-black hover:bg-yellow-400 font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all", children: ["Browse All Courses", _jsx(ArrowRight, { className: "ml-2 h-5 w-5" })] }) })] }) })] }) }));
}
