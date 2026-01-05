'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Search, ChevronDown, ChevronUp, Mail, Phone, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../../components/ui/button';
export function HelpCenterPage({ storeConfig }) {
    const primaryColor = storeConfig.branding.primaryColor;
    const faqConfig = storeConfig.layoutConfig?.pages?.faq;
    // Convert flat list of FAQs from config to categorized structure if needed,
    // or just use a default category if the structure doesn't match perfectly.
    // For simplicity, if config items exist, we'll put them in a "General Questions" category.
    const faqs = faqConfig?.items ? [
        {
            category: "Frequently Asked Questions",
            questions: faqConfig.items.map(item => ({ q: item.question, a: item.answer }))
        }
    ] : [
        {
            category: "Ordering & Payment",
            questions: [
                { q: "What payment methods do you accept?", a: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and various local payment methods depending on your region." },
                { q: "Can I modify my order after placing it?", a: "Orders can be modified within 30 minutes of placement. Please contact our support team immediately if you need to make changes." },
                { q: "How do I use a promo code?", a: "You can enter your promo code at checkout in the designated box. The discount will be applied to your total immediately." }
            ]
        },
        {
            category: "Shipping & Delivery",
            questions: [
                { q: "Do you ship internationally?", a: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location." },
                { q: "How long will my order take to arrive?", a: "Standard shipping typically takes 3-5 business days domestically. Express shipping options are available at checkout." },
                { q: "How can I track my order?", a: "Once your order ships, you'll receive a confirmation email with a tracking number and link to track your package." }
            ]
        },
        {
            category: "Returns & Refunds",
            questions: [
                { q: "What is your return policy?", a: "We offer a 30-day return policy for unused items in original packaging. Some exclusions apply to final sale items." },
                { q: "How long do refunds take to process?", a: "Refunds are typically processed within 5-7 business days after we receive your return." }
            ]
        }
    ];
    const [openIndex, setOpenIndex] = useState(null);
    const toggleAccordion = (id) => {
        setOpenIndex(openIndex === id ? null : id);
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 pb-20", children: [_jsx("div", { className: "bg-white border-b", children: _jsxs("div", { className: "container mx-auto px-4 py-16 sm:py-24 text-center max-w-3xl", children: [_jsx("h1", { className: "text-4xl font-bold tracking-tight text-gray-900 mb-6", children: faqConfig?.title || "How can we help you?" }), _jsxs("div", { className: "relative max-w-xl mx-auto", children: [_jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Search for answers...", className: "w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:border-transparent text-lg", style: { '--tw-ring-color': primaryColor } })] })] }) }), _jsxs("div", { className: "container mx-auto px-4 py-12 max-w-4xl", children: [_jsx("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-16", children: [
                            { title: "Track Order", icon: MessageCircle, desc: "Check your order status" },
                            { title: "Shipping Info", icon: Mail, desc: "Delivery times & costs" },
                            { title: "Returns", icon: Phone, desc: "Start a return or exchange" }
                        ].map((item, i) => (_jsxs("div", { className: "bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer", children: [_jsx(item.icon, { className: "h-8 w-8 mb-4", style: { color: primaryColor } }), _jsx("h3", { className: "font-semibold text-lg text-gray-900 mb-2", children: item.title }), _jsx("p", { className: "text-gray-500", children: item.desc })] }, i))) }), _jsx("div", { className: "space-y-12", children: faqs.map((section, sectionIdx) => (_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-6", children: section.category }), _jsx("div", { className: "space-y-4", children: section.questions.map((faq, faqIdx) => {
                                        const id = `${sectionIdx}-${faqIdx}`;
                                        const isOpen = openIndex === id;
                                        return (_jsxs("div", { className: "bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-200", children: [_jsxs("button", { onClick: () => toggleAccordion(id), className: "w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors", children: [_jsx("span", { className: "font-medium text-gray-900", children: faq.q }), isOpen ? (_jsx(ChevronUp, { className: "h-5 w-5 text-gray-500" })) : (_jsx(ChevronDown, { className: "h-5 w-5 text-gray-500" }))] }), _jsx("div", { className: `overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`, children: _jsx("div", { className: "p-5 pt-0 text-gray-600 border-t border-gray-100 bg-gray-50/50", children: faq.a }) })] }, faqIdx));
                                    }) })] }, sectionIdx))) }), _jsxs("div", { className: "mt-20 bg-white rounded-2xl p-8 md:p-12 border border-gray-100 shadow-lg text-center", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4", children: "Still need help?" }), _jsx("p", { className: "text-gray-500 mb-8 max-w-lg mx-auto", children: "Our support team is available Monday through Friday, 9am to 6pm EST. We usually respond within 24 hours." }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [_jsx(Button, { className: "px-8 py-6 text-base", style: { backgroundColor: primaryColor }, children: "Contact Support" }), _jsx(Button, { variant: "outline", className: "px-8 py-6 text-base", children: "Email Us" })] })] })] })] }));
}
