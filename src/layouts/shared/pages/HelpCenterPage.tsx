'use client';

import { StoreConfig } from '@/lib/store-types';
import { Search, ChevronDown, ChevronUp, Mail, Phone, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface HelpCenterPageProps {
  storeConfig: StoreConfig;
}

export function HelpCenterPage({ storeConfig }: HelpCenterPageProps) {
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

  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenIndex(openIndex === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-16 sm:py-24 text-center max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-6">
            {faqConfig?.title || "How can we help you?"}
          </h1>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search for answers..." 
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:border-transparent text-lg"
              style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { title: "Track Order", icon: MessageCircle, desc: "Check your order status" },
            { title: "Shipping Info", icon: Mail, desc: "Delivery times & costs" },
            { title: "Returns", icon: Phone, desc: "Start a return or exchange" }
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <item.icon className="h-8 w-8 mb-4" style={{ color: primaryColor }} />
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="space-y-12">
          {faqs.map((section, sectionIdx) => (
            <div key={sectionIdx}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{section.category}</h2>
              <div className="space-y-4">
                {section.questions.map((faq, faqIdx) => {
                  const id = `${sectionIdx}-${faqIdx}`;
                  const isOpen = openIndex === id;
                  
                  return (
                    <div 
                      key={faqIdx} 
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-all duration-200"
                    >
                      <button
                        onClick={() => toggleAccordion(id)}
                        className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                      
                      <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
                      >
                        <div className="p-5 pt-0 text-gray-600 border-t border-gray-100 bg-gray-50/50">
                          {faq.a}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-20 bg-white rounded-2xl p-8 md:p-12 border border-gray-100 shadow-lg text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still need help?</h2>
          <p className="text-gray-500 mb-8 max-w-lg mx-auto">
            Our support team is available Monday through Friday, 9am to 6pm EST. We usually respond within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="px-8 py-6 text-base"
              style={{ backgroundColor: primaryColor }}
            >
              Contact Support
            </Button>
            <Button variant="outline" className="px-8 py-6 text-base">
              Email Us
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

