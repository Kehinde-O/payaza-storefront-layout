'use client';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Button } from '../../../components/ui/button';
import { Clock, Star, ArrowRight, User, Sparkles } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '../../../lib/store-context';
import { formatCurrency, filterActiveServices } from '../../../lib/utils';
import { getBannerImage, getServiceImage, getTeamMemberImage, getTextContent, getFeaturesList, getLayoutText } from '../../../lib/utils/asset-helpers';
import { TestimonialCard } from '../../shared/components/TestimonialCard';
export function BookingHomePage({ storeConfig: initialConfig }) {
    const { store } = useStore();
    const storeConfig = store || initialConfig;
    const primaryColor = storeConfig.branding.primaryColor;
    const layoutConfig = storeConfig.layoutConfig;
    // In preview mode, use mock services if none are available
    const isPreview = (typeof window !== 'undefined' && window.__IS_PREVIEW__) || storeConfig.layoutConfig?.isPreview;
    const rawServices = storeConfig.services || [];
    const activeServices = filterActiveServices(rawServices);
    // Use real active services if available, otherwise if in preview, use all services (including drafts), 
    // and if still none, use mock data
    const services = activeServices.length > 0
        ? activeServices
        : (isPreview && rawServices.length > 0
            ? rawServices
            : (isPreview ? [
                { id: 'mock-1', name: 'Premium Haircut', description: 'Expert styling and precision cut', price: 50, duration: 45, categoryId: 'cat-1', status: 'active', image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800', slug: 'premium-haircut' },
                { id: 'mock-2', name: 'Beard Grooming', description: 'Trim and shape with straight razor finish', price: 30, duration: 30, categoryId: 'cat-1', status: 'active', image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800', slug: 'beard-grooming' },
                { id: 'mock-3', name: 'Full Facial Spa', description: 'Deep cleansing and hydration treatment', price: 85, duration: 60, categoryId: 'cat-2', status: 'active', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800', slug: 'full-facial-spa' }
            ] : []));
    const heroBg = getBannerImage(storeConfig, 'hero_bg', 'https://images.unsplash.com/photo-1457972729786-0411a3b2b626?q=80&w=2070&auto=format&fit=crop');
    return (_jsxs("div", { className: "min-h-screen bg-white", children: [_jsxs("section", { "data-section": "hero", className: "relative h-[85vh] min-h-[600px] w-full overflow-hidden flex items-center bg-gray-900", children: [_jsxs("div", { className: "absolute inset-0 z-0", children: [_jsx(Image, { src: heroBg, alt: "Makeup Studio", fill: true, className: "object-cover", unoptimized: true }), _jsx("div", { className: "absolute inset-0 bg-black/40" })] }), _jsx("div", { className: "container mx-auto px-4 relative z-10 text-white", children: _jsxs("div", { className: "max-w-2xl animate-fade-in-up", children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium mb-6", children: [_jsx(Sparkles, { className: "w-4 h-4" }), _jsx("span", { children: getTextContent(storeConfig, 'hero_badge', 'Premium Beauty Studio') })] }), _jsx("h1", { className: "text-4xl md:text-5xl lg:text-7xl font-light mb-6 tracking-tight leading-tight", children: (() => {
                                        const titleText = layoutConfig?.sections?.hero?.title || getTextContent(storeConfig, 'hero_title', 'Reveal Your\nInner Radiance.');
                                        const lines = titleText.split('\n');
                                        return lines.map((line, i) => (_jsx("span", { children: i === lines.length - 1 ? (_jsx("span", { className: "font-bold", children: line })) : (_jsxs(_Fragment, { children: [line, " ", _jsx("br", {})] })) }, i)));
                                    })() }), _jsx("p", { className: "text-xl md:text-2xl text-gray-200 mb-10 font-light leading-relaxed max-w-lg", children: layoutConfig?.sections?.hero?.subtitle || getTextContent(storeConfig, 'hero_subtitle', storeConfig.description || "Enhance your natural beauty with our professional makeup artistry.") }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [_jsx(Link, { href: `/${storeConfig.slug}/book`, children: _jsx(Button, { size: "lg", className: "h-14 px-8 rounded-full text-lg font-medium bg-white text-black hover:bg-gray-100 transition-colors", children: layoutConfig?.sections?.hero?.primaryCTA || getLayoutText(storeConfig, 'booking.bookAppointment', getTextContent(storeConfig, 'book_btn', 'Book Appointment')) }) }), _jsx(Link, { href: `/${storeConfig.slug}/services`, children: _jsx(Button, { size: "lg", variant: "outline", className: "h-14 px-8 rounded-full text-lg font-medium border-white/80 text-white bg-white/5 hover:bg-white/15 hover:text-white transition-colors backdrop-blur-sm shadow-lg", children: layoutConfig?.sections?.hero?.secondaryCTA || getLayoutText(storeConfig, 'booking.viewServices', getTextContent(storeConfig, 'view_services_btn', 'View Services')) }) })] })] }) })] }), _jsx("section", { "data-section": "featuredServices", className: "py-12 md:py-20 px-4 bg-gray-50/50", children: _jsxs("div", { className: "container mx-auto max-w-7xl", children: [_jsxs("div", { className: "flex justify-between items-end mb-8 md:mb-12", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-bold text-gray-900 mb-2", children: layoutConfig?.sections?.featuredServices?.title || getLayoutText(storeConfig, 'sections.featuredServices.title', getTextContent(storeConfig, 'services_section_title', 'Signature Looks')) }), _jsx("p", { className: "text-gray-500", children: layoutConfig?.sections?.featuredServices?.subtitle || getLayoutText(storeConfig, 'sections.featuredServices.subtitle', getTextContent(storeConfig, 'services_section_subtitle', 'Curated styles for every occasion')) })] }), _jsxs(Link, { href: `/${storeConfig.slug}/services`, className: "flex items-center gap-2 text-sm font-bold tracking-wide uppercase hover:underline", style: { color: primaryColor }, children: [layoutConfig?.sections?.featuredServices?.viewAllLabel || getLayoutText(storeConfig, 'sections.featuredServices.viewAll', getTextContent(storeConfig, 'services_view_all', 'View All')), ' ', _jsx(ArrowRight, { className: "w-4 h-4" })] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: services.slice(0, 3).map((service) => (_jsxs(Link, { href: `/${storeConfig.slug}/book?service=${service.slug}`, className: "group cursor-pointer", children: [_jsxs("div", { className: "relative aspect-[4/3] overflow-hidden rounded-2xl mb-6 bg-gray-200", children: [_jsx(Image, { src: getServiceImage(service.image, storeConfig, "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2069&auto=format&fit=crop"), alt: service.name, fill: true, className: "object-cover transition-transform duration-700 group-hover:scale-110", unoptimized: true }), _jsx("div", { className: "absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold shadow-sm", children: formatCurrency(service.price, service.currency || storeConfig.settings?.currency || 'USD') })] }), _jsx("h3", { className: "text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-600 transition-colors", children: service.name }), _jsx("p", { className: "text-gray-500 line-clamp-2 mb-4", children: service.description }), _jsxs("div", { className: "flex items-center gap-4 text-sm text-gray-400", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Clock, { className: "w-4 h-4" }), " ", service.duration, " mins"] }), service.provider && (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(User, { className: "w-4 h-4" }), " ", service.provider.name] }))] })] }, service.id))) })] }) }), _jsx("section", { "data-section": "team", className: "py-12 md:py-24 px-4 bg-white", children: _jsx("div", { className: "container mx-auto max-w-7xl", children: (() => {
                        const teamMembers = storeConfig.layoutConfig?.pages?.team?.members || [];
                        const fallbackTeam = [
                            {
                                name: 'Sarah Mitchell',
                                role: 'Lead Artist',
                                photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400"
                            }
                        ];
                        const members = teamMembers.length > 0 ? teamMembers : (isPreview ? fallbackTeam : []);
                        const featuredMember = members[0] || {
                            name: getLayoutText(storeConfig, 'sections.team.memberName', getTextContent(storeConfig, 'team_member_name', 'Sarah Mitchell')),
                            role: getLayoutText(storeConfig, 'sections.team.memberRole', getTextContent(storeConfig, 'team_member_role', 'Lead Makeup Artist')),
                            photo: getTeamMemberImage(storeConfig, 'Sarah Mitchell', 'specialist_image', "https://blog.sugar.ng/files/styles/width-640/public/We%20Just%20Found%20the%20Perfect%20Nikkai%20Bridal%20Look%20for%20You.jpg?itok=HGIlGdwB")
                        };
                        return (_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "aspect-[4/5] rounded-[2rem] overflow-hidden bg-gray-100 relative", children: _jsx(Image, { src: featuredMember.photo, alt: featuredMember.name, fill: true, className: "object-cover", unoptimized: true }) }), _jsxs("div", { className: "absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur p-6 rounded-2xl shadow-xl", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900", children: featuredMember.name }), _jsx("p", { className: "text-gray-500 mb-4", children: featuredMember.role }), _jsxs("div", { className: "flex items-center gap-1 text-yellow-500", children: [_jsx(Star, { className: "w-4 h-4 fill-current" }), _jsx("span", { className: "font-bold text-black", children: "5.0" }), _jsx("span", { className: "text-gray-400 text-sm ml-1", children: "(150+ Reviews)" })] })] })] }), _jsxs("div", { className: "space-y-8", children: [_jsx("h2", { className: "text-4xl md:text-5xl font-light text-gray-900 leading-tight", children: (() => {
                                                const defaultTitle = storeConfig.pageFeatures?.teamPage
                                                    ? 'Artistry in\nevery brushstroke.'
                                                    : 'Excellence in\nevery detail.';
                                                const titleText = layoutConfig?.sections?.team?.title || getLayoutText(storeConfig, 'sections.team.title', getTextContent(storeConfig, 'team_section_title', defaultTitle));
                                                const lines = titleText.split('\n');
                                                return lines.map((line, i) => (_jsx("span", { children: i === lines.length - 1 ? (_jsx("span", { className: "font-bold", children: line })) : (_jsxs(_Fragment, { children: [line, " ", _jsx("br", {})] })) }, i)));
                                            })() }), _jsx("p", { className: "text-xl text-gray-500 font-light leading-relaxed", children: layoutConfig?.sections?.team?.subtitle || getLayoutText(storeConfig, 'sections.team.subtitle', getTextContent(storeConfig, 'team_desc', storeConfig.pageFeatures?.teamPage
                                                ? "Our team of certified makeup artists brings passion and precision to every look. Whether it's your big day or a night out, we create looks that enhance your natural beauty."
                                                : "We bring passion and precision to every look. Whether it's your big day or a night out, we create looks that enhance your natural beauty.")) }), _jsx("div", { className: "space-y-6", children: getFeaturesList(storeConfig, 'team_feature_', [
                                                "Certified Professional Artists",
                                                "Premium & Luxury Brands",
                                                "Customized Color Matching",
                                                "Long-lasting Techniques"
                                            ]).map((item, i) => (_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 text-gray-900", children: _jsx(Star, { className: "w-5 h-5" }) }), _jsx("span", { className: "text-lg font-medium text-gray-900", children: item })] }, i))) }), storeConfig.pageFeatures?.teamPage && (_jsx(Link, { href: `/${storeConfig.slug}/team`, children: _jsx(Button, { size: "lg", className: "mt-8 h-14 px-8 rounded-full text-lg", style: { backgroundColor: primaryColor }, children: "Meet Our Team" }) })), storeConfig.pageFeatures?.portfolioPage && !storeConfig.pageFeatures?.teamPage && (_jsx(Link, { href: `/${storeConfig.slug}/portfolio`, children: _jsx(Button, { size: "lg", className: "mt-8 h-14 px-8 rounded-full text-lg", style: { backgroundColor: primaryColor }, children: "View Portfolio" }) }))] })] }));
                    })() }) }), layoutConfig?.sections?.testimonials?.show !== false && (_jsxs("section", { "data-section": "testimonials", className: "py-16 md:py-24 px-4 bg-black text-white relative overflow-hidden", children: [_jsx("div", { className: "absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" }), _jsxs("div", { className: "container mx-auto max-w-7xl relative z-10", children: [_jsxs("div", { className: "text-center mb-12", children: [_jsx("h2", { className: "text-2xl md:text-4xl font-bold mb-4", children: layoutConfig?.sections?.testimonials?.title || getLayoutText(storeConfig, 'sections.testimonials.title', 'What Our Clients Say') }), layoutConfig?.sections?.testimonials?.subtitle && (_jsx("p", { className: "text-white/70 text-lg", children: layoutConfig.sections.testimonials.subtitle }))] }), (() => {
                                const backendTestimonials = layoutConfig?.sections?.testimonials?.items || [];
                                const fallbackTestimonials = [
                                    {
                                        id: '1',
                                        name: getLayoutText(storeConfig, 'sections.testimonials.author', getTextContent(storeConfig, 'testimonial_author', 'Emily Davis')),
                                        role: getLayoutText(storeConfig, 'sections.testimonials.role', getTextContent(storeConfig, 'testimonial_role', 'Bridal Client')),
                                        quote: getLayoutText(storeConfig, 'sections.testimonials.quote', getTextContent(storeConfig, 'testimonial_quote', "I've never felt more beautiful. The makeup was flawless and lasted all night. Absolutely stunning work!")),
                                        rating: 5,
                                        image: getTeamMemberImage(storeConfig, 'Emily Davis', 'testimonial_image', "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"),
                                        order: 1
                                    }
                                ];
                                const testimonials = backendTestimonials.length > 0 ? backendTestimonials : (isPreview ? [
                                    {
                                        id: '1',
                                        name: 'Emily Davis',
                                        role: 'Bridal Client',
                                        quote: "I've never felt more beautiful. The makeup was flawless and lasted all night. Absolutely stunning work!",
                                        rating: 5,
                                        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
                                        order: 1
                                    },
                                    {
                                        id: '2',
                                        name: 'Sarah Johnson',
                                        role: 'Fashion Model',
                                        quote: "Professional, creative and punctual. They really know how to work with light and camera!",
                                        rating: 5,
                                        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
                                        order: 2
                                    }
                                ] : []);
                                return (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-8", children: testimonials.slice(0, 3).map((testimonial) => (_jsx("div", { className: "bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10", children: _jsx(TestimonialCard, { testimonial: testimonial }) }, testimonial.id || testimonial.name))) }));
                            })()] })] })), _jsx("section", { "data-section": "marketing", className: "py-24 px-4 bg-gray-50 text-center", children: _jsxs("div", { className: "container mx-auto max-w-2xl", children: [_jsx("h2", { className: "text-3xl md:text-4xl font-bold mb-6", children: layoutConfig?.sections?.marketing?.ctaTitle || getLayoutText(storeConfig, 'sections.cta.title', getTextContent(storeConfig, 'cta_title', 'Ready to glow?')) }), _jsx("p", { className: "text-gray-500 text-lg mb-10", children: layoutConfig?.sections?.marketing?.ctaDescription || getLayoutText(storeConfig, 'sections.cta.description', getTextContent(storeConfig, 'cta_description', 'Book your session today and let us create the perfect look for you.')) }), _jsx(Link, { href: `/${storeConfig.slug}/book`, children: _jsx(Button, { size: "lg", className: "h-16 px-12 rounded-full text-xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1", style: { backgroundColor: primaryColor }, children: layoutConfig?.sections?.marketing?.ctaButton || getLayoutText(storeConfig, 'booking.bookAppointment', 'Book Appointment') }) })] }) })] }));
}
