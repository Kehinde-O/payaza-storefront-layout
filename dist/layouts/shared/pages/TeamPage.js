'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Award, MapPin } from 'lucide-react';
import Image from 'next/image';
export function TeamPage({ storeConfig }) {
    const primaryColor = storeConfig.branding.primaryColor;
    const teamConfig = storeConfig.layoutConfig?.pages?.team;
    // Use config providers or fallback to mock data
    const providers = teamConfig?.members || [
        {
            id: 'p1',
            name: 'Dr. Sarah Mitchell',
            role: 'Lead Specialist',
            photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop',
            bio: 'Dedicated to providing exceptional care with over 10 years of professional experience in the field.',
            experience: '12 Years',
            location: 'Main Branch'
        },
        {
            id: 'p2',
            name: 'James Wilson',
            role: 'Senior Consultant',
            photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop',
            bio: 'Expert in personalized solutions and client-focused strategies for optimal results.',
            experience: '8 Years',
            location: 'Downtown'
        },
        {
            id: 'p3',
            name: 'Emily Chen',
            role: 'Practitioner',
            photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop',
            bio: 'Passionate about helping clients achieve their goals through proven methodologies.',
            experience: '5 Years',
            location: 'Main Branch'
        }
    ];
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsxs("div", { className: "bg-white pt-32 pb-20 px-4 text-center border-b border-gray-100", children: [_jsx("h1", { className: "text-4xl md:text-5xl font-light mb-6 tracking-tight text-gray-900", children: teamConfig?.title || "Meet Our Team" }), _jsx("p", { className: "text-gray-500 max-w-2xl mx-auto text-lg font-light leading-relaxed", children: teamConfig?.description || `The talented professionals behind ${storeConfig.name}.` })] }), _jsx("div", { className: "container mx-auto px-4 max-w-6xl py-16", children: _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: providers.map((provider, idx) => (_jsxs("div", { className: "bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col", children: [_jsxs("div", { className: "aspect-[4/5] overflow-hidden bg-gray-100 relative group", children: [_jsx(Image, { src: provider.photo, alt: provider.name, fill: true, className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105", unoptimized: true }), _jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" })] }), _jsxs("div", { className: "p-8 flex-1 flex flex-col", children: [_jsxs("div", { className: "mb-4", children: [_jsx("h3", { className: "text-xl font-bold text-gray-900 mb-1", children: provider.name }), _jsx("p", { className: "text-sm font-medium uppercase tracking-wide opacity-80", style: { color: primaryColor }, children: provider.role })] }), _jsx("p", { className: "text-gray-500 text-sm mb-8 leading-relaxed flex-1", children: provider.bio }), _jsxs("div", { className: "pt-6 border-t border-gray-50 flex items-center justify-between text-xs font-medium text-gray-400", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(Award, { className: "w-4 h-4" }), provider.experience || 'Expert'] }), _jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx(MapPin, { className: "w-4 h-4" }), provider.location || 'Available'] })] })] })] }, idx))) }) })] }));
}
