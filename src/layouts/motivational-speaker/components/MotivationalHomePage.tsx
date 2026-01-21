'use client';

import { StoreConfig } from '@/lib/store-types';
import { Button } from '@/components/ui/button';
import { Play, FileText, Headphones, ArrowRight, Lock, Star, CheckCircle, Mail, ChevronDown, Quote, Youtube, Instagram, Twitter } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency, filterActiveServices } from '@/lib/utils';
import { getBannerImage, getServiceImage, getTextContent } from '@/lib/utils/asset-helpers';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useContext } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useStore } from '@/lib/store-context';
import { AlertModalContext } from '@/components/ui/alert-modal';

interface MotivationalHomePageProps {
    storeConfig: StoreConfig;
}

export function MotivationalHomePage({ storeConfig: initialConfig }: MotivationalHomePageProps) {
    const { store } = useStore();
    const storeConfig = store || initialConfig;

    const { isAuthenticated } = useAuth();
    
    // Safely get alert modal context with fallback
    const alertContext = useContext(AlertModalContext);
    const showAlert = alertContext?.showAlert || ((message: string, type?: 'success' | 'error' | 'info' | 'warning', options?: any) => {
        // Fallback: log to console if provider is not available
        console.log(`[Alert] ${type || 'info'}: ${message}`, options);
    });

    // In preview mode, use mock content if none are available
    const isPreview = (typeof window !== 'undefined' && (window as any).__IS_PREVIEW__) || storeConfig.layoutConfig?.isPreview;

    const rawContent = storeConfig.services || [];
    const activeContent = filterActiveServices(rawContent);

    // Use real active content if available, otherwise if in preview, use all content (including drafts), 
    // and if still none, use mock data
    const contentItems = activeContent.length > 0
        ? activeContent
        : (isPreview && rawContent.length > 0
            ? rawContent
            : (isPreview ? [
                { id: 'mock-1', name: 'Peak Performance Mindset', description: 'Master your internal state and achieve unstoppable focus in any situation.', price: 199, currency: 'USD', status: 'active', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800', slug: 'peak-performance', contentType: 'video' },
                { id: 'mock-2', name: 'Strategic Resilience', description: 'Build the emotional and mental strength to navigate complex challenges with ease.', price: 149, currency: 'USD', status: 'active', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800', slug: 'strategic-resilience', contentType: 'audio' },
                { id: 'mock-3', name: 'Leadership Blueprint', description: 'The comprehensive guide to leading with impact, authenticity, and clear vision.', price: 0, currency: 'USD', status: 'active', image: 'https://images.unsplash.com/photo-1475721027785-f74ec0f711b1?w=800', slug: 'leadership-blueprint', contentType: 'pdf' }
            ] : []));

    const layoutConfig = storeConfig.layoutConfig;
    const [email, setEmail] = useState('');
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    // Assets
    const heroBg = getBannerImage(storeConfig, 'hero_image', 'https://images.unsplash.com/photo-1475721027785-f74ec0f711b1?w=2070&auto=format&fit=crop');
    const heroVideo = storeConfig.layoutConfig?.assignedAssets?.hero_video;
    const speakerImage = getBannerImage(storeConfig, 'bio_image', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop');
    const subBanner = getBannerImage(storeConfig, 'subscription_banner', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=2070&auto=format&fit=crop');

    // Parallax scroll for hero
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    });
    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

    // FAQ Data
    const backendFaqItems = layoutConfig?.sections?.faq?.items;
    const fallbackFaqItems = [
        {
            question: "How do I access my purchased courses?",
            answer: "Once you purchase a course, you'll receive instant access via email. You can also access all your courses from your account dashboard under 'My Learning'."
        },
        {
            question: "Can I download course materials?",
            answer: "Yes! All PDF guides and workbooks are available for download. Video and audio content can be streamed or downloaded for offline viewing."
        },
        {
            question: "What's included in the membership?",
            answer: "Membership includes unlimited access to all courses, exclusive live Q&A sessions, downloadable resources, community access, and priority support."
        },
        {
            question: "Do you offer refunds?",
            answer: "We offer a 30-day money-back guarantee on all courses. If you're not satisfied, contact our support team for a full refund."
        },
        {
            question: "How long do I have access to the content?",
            answer: "For individual course purchases, you have lifetime access. For membership subscribers, access continues as long as your subscription is active."
        }
    ];

    const faqItems = backendFaqItems && backendFaqItems.length > 0 ? backendFaqItems : fallbackFaqItems;

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            // In a real app, this would call an API
            showAlert(
                'Thank you for subscribing to our newsletter! Please check your email inbox to confirm your subscription.',
                'success',
                { title: 'Subscription Successful' }
            );
            setEmail('');
        }
    };

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    return (
        <div className="bg-white font-sans text-gray-900 selection:bg-black selection:text-white">
            {/* HERO SECTION: Cinematic & Full Height with Parallax */}
            <section
                data-section="hero"
                ref={heroRef}
                className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden bg-black"
            >
                <div className="absolute inset-0 z-0">
                    {heroVideo ? (
                        <video
                            src={heroVideo}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover opacity-60"
                        />
                    ) : (
                        <Image
                            src={heroBg}
                            alt="Hero Background"
                            fill
                            className="object-cover opacity-80"
                            priority
                            unoptimized
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
                    {/* Animated gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent animate-pulse" />
                </div>

                <motion.div
                    style={{ opacity: heroOpacity, scale: heroScale }}
                    className="container mx-auto px-6 relative z-10 text-center text-white pt-20"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-4xl mx-auto space-y-8"
                    >
                        <motion.span
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="inline-block py-1.5 px-4 border border-white/30 rounded-full text-sm font-medium tracking-widest uppercase backdrop-blur-md bg-white/5"
                        >
                            {layoutConfig?.sections?.hero?.subtitle || getTextContent(storeConfig, 'hero_subtitle', 'Master Your Mindset')}
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="text-6xl md:text-8xl font-serif font-medium tracking-tight leading-tight"
                        >
                            {layoutConfig?.sections?.hero?.title || getTextContent(storeConfig, 'hero_title', 'Unlock Your True Potential')}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed"
                        >
                            {layoutConfig?.sections?.hero?.description || storeConfig.description || "Join thousands of students learning to master their mindset and achieve their dreams."}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.8 }}
                            className="flex flex-col sm:flex-row gap-6 justify-center pt-8"
                        >
                            <Link href={isAuthenticated ? `/${storeConfig.slug}/account?tab=learning` : `/${storeConfig.slug}/subscription`}>
                                <Button
                                    size="lg"
                                    className="h-16 px-12 rounded-full text-lg font-medium bg-white text-black hover:bg-gray-200 transition-all transform hover:-translate-y-1 hover:shadow-2xl"
                                >
                                    {isAuthenticated ? 'Continue Learning' : (layoutConfig?.sections?.hero?.primaryCTA || getTextContent(storeConfig, 'cta_primary', 'Start Learning Now'))}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link href={`/${storeConfig.slug}/services`}>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="h-16 px-12 rounded-full text-lg font-medium border-2 border-white/40 text-white hover:bg-white hover:text-black hover:border-white transition-all backdrop-blur-sm"
                                >
                                    {layoutConfig?.sections?.hero?.secondaryCTA || 'Explore Catalogue'}
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent opacity-50"
                    />
                </motion.div>
            </section>

            {/* TRUST SECTION: "As Seen In" Ticker with Fixed Logos */}
            <section
                data-section="trust"
                className="py-20 border-y border-gray-100 bg-white overflow-hidden"
            >
                <div className="container mx-auto px-6 mb-10">
                    <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Trusted by Global Institutions</p>
                </div>
                <div className="relative flex overflow-x-hidden group">
                    <div className="animate-scroll flex items-center gap-20 whitespace-nowrap min-w-full">
                        {[
                            { name: "Forbes", logo: "https://logos-world.net/wp-content/uploads/2021/03/Forbes-Logo.png" },
                            { name: "Entrepreneur", logo: "https://logos-world.net/wp-content/uploads/2023/11/Entrepreneur-Logo.png" },
                            { name: "TED", logo: "https://logos-world.net/wp-content/uploads/2023/11/TED-Logo.png" },
                            { name: "Wired", logo: "https://logos-world.net/wp-content/uploads/2023/11/Wired-Logo.png" },
                            { name: "Fast Company", logo: "https://logos-world.net/wp-content/uploads/2023/11/Fast-Company-Logo.png" },
                            { name: "Inc", logo: "https://logos-world.net/wp-content/uploads/2023/11/Inc-Logo.png" },
                            // Duplicate for seamless loop
                            { name: "Forbes", logo: "https://logos-world.net/wp-content/uploads/2021/03/Forbes-Logo.png" },
                            { name: "Entrepreneur", logo: "https://logos-world.net/wp-content/uploads/2023/11/Entrepreneur-Logo.png" },
                            { name: "TED", logo: "https://logos-world.net/wp-content/uploads/2023/11/TED-Logo.png" },
                            { name: "Wired", logo: "https://logos-world.net/wp-content/uploads/2023/11/Wired-Logo.png" },
                            { name: "Fast Company", logo: "https://logos-world.net/wp-content/uploads/2023/11/Fast-Company-Logo.png" },
                            { name: "Inc", logo: "https://logos-world.net/wp-content/uploads/2023/11/Inc-Logo.png" },
                        ].map((brand, i) => (
                            <div key={i} className="flex items-center justify-center w-32 h-10 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700 mx-10">
                                <Image
                                    src={brand.logo}
                                    alt={brand.name}
                                    width={120}
                                    height={40}
                                    className="object-contain max-h-full"
                                    unoptimized
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* BIO SECTION: Editorial Style with Animation */}
            <section
                data-section="about"
                className="py-32 bg-white"
            >
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="lg:col-span-5 relative"
                        >
                            <div className="relative aspect-[4/5] overflow-hidden bg-gray-100 rounded-lg">
                                <Image
                                    src={speakerImage}
                                    alt="Speaker Portrait"
                                    fill
                                    className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out"
                                    unoptimized
                                />
                            </div>
                            {/* Decorative elements with glassmorphism */}
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 border-r-2 border-b-2 border-black/10 -z-10 backdrop-blur-sm bg-white/30" />
                            <div className="absolute -top-6 -left-6 w-32 h-32 border-t-2 border-l-2 border-black/10 -z-10 backdrop-blur-sm bg-white/30" />
                        </motion.div>

                        <div className="lg:col-span-1" /> {/* Spacer */}

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="lg:col-span-6 space-y-10"
                        >
                            <h2 className="text-4xl md:text-6xl font-serif text-gray-900 leading-tight">
                                {layoutConfig?.sections?.about?.title || getTextContent(storeConfig, 'bio_title', "Hi, I'm here to help you grow.")}
                            </h2>
                            <div className="space-y-6 text-xl text-gray-600 font-light leading-relaxed">
                                <p>
                                    {layoutConfig?.sections?.about?.description || getTextContent(storeConfig, 'bio_desc', "I have dedicated my life to helping individuals break through their barriers. My courses are designed to give you practical tools for everyday success.")}
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-100">
                                <div>
                                    <div className="text-4xl font-serif text-gray-900 mb-1">50k+</div>
                                    <div className="text-sm uppercase tracking-wider text-gray-400">Students</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-serif text-gray-900 mb-1">100+</div>
                                    <div className="text-sm uppercase tracking-wider text-gray-400">Modules</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-serif text-gray-900 mb-1">4.9</div>
                                    <div className="text-sm uppercase tracking-wider text-gray-400">Rating</div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="flex items-center gap-4 pt-4">
                                {storeConfig.branding.socialMedia?.youtube && (
                                    <a href={storeConfig.branding.socialMedia.youtube} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                                        <Youtube className="w-5 h-5 text-gray-700" />
                                    </a>
                                )}
                                {storeConfig.branding.socialMedia?.instagram && (
                                    <a href={storeConfig.branding.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                                        <Instagram className="w-5 h-5 text-gray-700" />
                                    </a>
                                )}
                                {storeConfig.branding.socialMedia?.twitter && (
                                    <a href={storeConfig.branding.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                                        <Twitter className="w-5 h-5 text-gray-700" />
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CONTENT GRID: Premium Cards with Hover Effects */}
            <section
                data-section="services"
                className="py-32 bg-gray-50"
            >
                <div className="container mx-auto px-6 max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8"
                    >
                        <div>
                            <span className="text-gray-400 font-bold tracking-widest uppercase text-xs mb-4 block">Catalogue</span>
                            <h2 className="text-4xl md:text-5xl font-serif text-gray-900">
                                {layoutConfig?.sections?.services?.title || 'Latest Materials'}
                            </h2>
                        </div>
                        <Link href={`/${storeConfig.slug}/services`} className="group flex items-center gap-3 text-lg font-medium hover:text-gray-600 transition-colors">
                            {layoutConfig?.sections?.services?.viewAllLabel || 'View All Material'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {contentItems.slice(0, 6).map((item, index) => {
                            // Infer Type & Badge
                            let TypeIcon = Play;
                            let typeLabel = "Course";

                            if (item.contentType === 'audio' || item.categoryId === 'cat2') {
                                TypeIcon = Headphones;
                                typeLabel = "Audiobook";
                            } else if (item.contentType === 'pdf' || item.categoryId === 'cat3') {
                                TypeIcon = FileText;
                                typeLabel = "Guide (PDF)";
                            } else if (item.contentType === 'video') {
                                TypeIcon = Play;
                                typeLabel = "Video Class";
                            }

                            // Access Status
                            const isLocked = item.accessLevel === 'subscription' || item.accessLevel === 'paid';

                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                >
                                    <Link href={`/${storeConfig.slug}/services/${item.slug}`} className="group block h-full">
                                        <article className="bg-white h-full flex flex-col hover:shadow-2xl transition-all duration-500 ease-out border border-gray-200/50 hover:border-gray-300 rounded-lg overflow-hidden">
                                            <div className="relative aspect-[16/10] overflow-hidden bg-gray-200">
                                                <Image
                                                    src={getServiceImage(item.image, storeConfig, "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop")}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                                    unoptimized
                                                />
                                                {/* Badge with glassmorphism */}
                                                <div className="absolute top-4 left-4 flex gap-2">
                                                    <div className="bg-white/90 backdrop-blur-md text-black px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 rounded-full shadow-lg">
                                                        <TypeIcon className="w-3 h-3" /> {typeLabel}
                                                    </div>
                                                    {isLocked && (
                                                        <div className="bg-black/90 backdrop-blur-md text-white px-3 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 rounded-full shadow-lg">
                                                            <Lock className="w-3 h-3" /> Premium
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="p-8 flex flex-col flex-1">
                                                <h3 className="text-2xl font-serif text-gray-900 mb-3 group-hover:underline decoration-1 underline-offset-4 decoration-gray-300">
                                                    {item.name}
                                                </h3>
                                                <p className="text-gray-500 font-light leading-relaxed mb-8 line-clamp-3">
                                                    {item.description}
                                                </p>

                                                <div className="mt-auto pt-6 border-t border-gray-100 flex items-center justify-between">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs uppercase tracking-wider text-gray-400 mb-1">Access</span>
                                                        <span className="font-medium text-lg">
                                                            {item.price > 0 ? formatCurrency(item.price, item.currency || 'USD') : 'Free'}
                                                        </span>
                                                    </div>
                                                    <div className="w-10 h-10 border border-gray-200 rounded-full flex items-center justify-center group-hover:bg-black group-hover:border-black group-hover:text-white transition-all">
                                                        <ArrowRight className="w-4 h-4" />
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    </Link>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* SUBSCRIPTION BANNER: Dark & Gold Premium */}
            <section
                data-section="subscription"
                className="relative py-32 bg-[#0a0a0a] text-white overflow-hidden"
            >
                {/* Abstract BG */}
                <div className="absolute inset-0 opacity-20">
                    <Image
                        src={subBanner}
                        alt="Background"
                        fill
                        className="object-cover"
                        unoptimized
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black via-[#0a0a0a] to-transparent" />

                <div className="container mx-auto px-6 relative z-10 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="text-yellow-500 font-bold tracking-widest uppercase text-xs mb-6 block">
                                {layoutConfig?.sections?.marketing?.subscriptionBadge || 'Inner Circle Access'}
                            </span>
                            <h2 className="text-5xl md:text-7xl font-serif mb-8 leading-none">
                                {layoutConfig?.sections?.marketing?.subscriptionTitle || getTextContent(storeConfig, 'sub_title', 'Join the Movement')}
                            </h2>
                            <p className="text-xl text-gray-400 mb-12 font-light leading-relaxed max-w-lg">
                                {layoutConfig?.sections?.marketing?.subscriptionDescription || getTextContent(storeConfig, 'sub_desc', 'Get unlimited access to all courses, exclusive live sessions, and a community of like-minded individuals.')}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6">
                                <Link href={`/${storeConfig.slug}/subscription`}>
                                    <Button
                                        size="lg"
                                        className="h-16 px-12 rounded-full text-lg font-bold bg-yellow-500 text-black hover:bg-yellow-400 border-0 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                                    >
                                        {layoutConfig?.sections?.marketing?.subscriptionButton || getTextContent(storeConfig, 'sub_cta', 'Become a Member')}
                                        <ArrowRight className="ml-2 h-5 w-5" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>

                        {/* Feature List with glassmorphism */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="bg-white/5 backdrop-blur-md border border-white/10 p-10 lg:p-14 rounded-2xl"
                        >
                            <h3 className="text-2xl font-serif mb-8">Membership Benefits</h3>
                            <ul className="space-y-6">
                                {[
                                    "Unlimited access to all video courses",
                                    "Downloadable PDF workbooks & guides",
                                    "Weekly live Q&A sessions",
                                    "Exclusive community access",
                                    "Priority support"
                                ].map((benefit, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-start gap-4"
                                    >
                                        <CheckCircle className="w-6 h-6 text-yellow-500 shrink-0" />
                                        <span className="text-lg font-light text-gray-200">{benefit}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            {layoutConfig?.sections?.testimonials?.show !== false && (
                <section
                    data-section="testimonials"
                    className="py-32 bg-white"
                >
                    <div className="container mx-auto px-6 max-w-7xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-24"
                        >
                            <h2 className="text-3xl md:text-4xl font-serif mb-4">Success Stories</h2>
                            <div className="w-12 h-1 bg-gray-200 mx-auto" />
                        </motion.div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {(() => {
                                const backendTestimonials = layoutConfig?.sections?.testimonials?.items || [];
                                const fallbackTestimonials = [
                                    { id: '1', name: 'Michael Chen', role: 'Entrepreneur', quote: "Completely changed my perspective on leadership.", rating: 5, image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop', order: 1 },
                                    { id: '2', name: 'Sarah Johnson', role: 'Creative Director', quote: "Worth every penny. The depth of content is unmatched.", rating: 5, image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop', order: 2 },
                                    { id: '3', name: 'David Lee', role: 'Developer', quote: "Simple, practical, and effective. Highly recommend.", rating: 5, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop', order: 3 },
                                ];
                                const testimonials = backendTestimonials.length > 0 ? backendTestimonials : fallbackTestimonials;
                                return testimonials.slice(0, 3).map((testimonial: any, index: number) => (
                                    <motion.div
                                        key={testimonial.id || testimonial.name}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        className="text-center space-y-6"
                                    >
                                        <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden mb-6 ring-4 ring-gray-100">
                                            <Image src={testimonial.image || ''} alt={testimonial.name} fill className="object-cover" unoptimized />
                                        </div>
                                        <div className="flex justify-center gap-1 mb-4 text-yellow-500">
                                            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                        </div>
                                        <Quote className="w-8 h-8 text-gray-300 mx-auto" />
                                        <p className="text-xl font-serif text-gray-800 italic leading-relaxed">"{testimonial.quote}"</p>
                                        <div>
                                            <div className="font-bold uppercase tracking-wider text-sm">{testimonial.name}</div>
                                            <div className="text-gray-400 text-xs mt-1">{testimonial.role}</div>
                                        </div>
                                    </motion.div>
                                ));
                            })()}
                        </div>
                    </div>
                </section>
            )}

            {/* NEWSLETTER SECTION */}
            <section
                data-section="marketing"
                className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden"
            >
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl" />
                </div>
                <div className="container mx-auto px-6 max-w-4xl relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center space-y-8"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-widest">
                            <Mail className="w-3 h-3" />
                            {layoutConfig?.sections?.marketing?.newsletterBadge || 'Stay Connected'}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif">
                            {layoutConfig?.sections?.marketing?.newsletterTitle || 'Join Our Newsletter'}
                        </h2>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light">
                            {layoutConfig?.sections?.marketing?.newsletterSubtitle || 'Get weekly insights, exclusive content, and early access to new courses delivered straight to your inbox.'}
                        </p>
                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder={layoutConfig?.sections?.marketing?.newsletterPlaceholder || 'Enter your email'}
                                required
                                className="flex-1 px-6 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                            />
                            <Button
                                type="submit"
                                size="lg"
                                className="h-14 px-8 rounded-full bg-yellow-500 text-black hover:bg-yellow-400 font-bold text-lg transition-all transform hover:-translate-y-1 hover:shadow-xl"
                            >
                                {layoutConfig?.sections?.marketing?.newsletterButton || 'Subscribe'}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </form>
                        <p className="text-sm text-gray-400">
                            We respect your privacy. Unsubscribe at any time.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section
                data-section="faq"
                className="py-32 bg-white"
            >
                <div className="container mx-auto px-6 max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-16"
                    >
                        <span className="text-gray-400 font-bold tracking-widest uppercase text-xs mb-4 block">Support</span>
                        <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">Frequently Asked Questions</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Everything you need to know about our courses and membership.
                        </p>
                    </motion.div>

                    <div className="space-y-4">
                        {faqItems.map((faq: any, index: number) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-lg transition-shadow"
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                                >
                                    <span className="text-lg font-semibold text-gray-900 pr-8">{faq.question}</span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-gray-500 transition-transform shrink-0 ${openFaqIndex === index ? 'transform rotate-180' : ''
                                            }`}
                                    />
                                </button>
                                {openFaqIndex === index && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="px-6 pb-5"
                                    >
                                        <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                                    </motion.div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
