'use client';

import { useState } from 'react';
import { StoreConfig } from '../../../lib/store-types';
import { Button } from '../../../components/ui/button';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, CheckCircle } from 'lucide-react';
import { useStore } from '../../../lib/store-context';
import Image from 'next/image';

interface ContactPageProps {
    storeConfig: StoreConfig;
}

export function ContactPage({ storeConfig: initialConfig }: ContactPageProps) {
    const { store } = useStore();
    const storeConfig = store || initialConfig;
    const contactConfig = storeConfig.layoutConfig?.pages?.contact;
    const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormState('submitting');
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setFormState('success');
    };

    return (
        <div className="min-h-screen bg-white pb-20">
            {/* Header Section */}
            {contactConfig?.contactHeader?.show !== false && (
                <section data-section="hero" className="relative bg-gray-900 text-white py-20 overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                        <Image
                            src={contactConfig?.backgroundImage || "https://images.unsplash.com/photo-1596524430615-b46475ddff6e?q=80&w=2070&auto=format&fit=crop"}
                            alt="Contact Background"
                            fill
                            className="w-full h-full object-cover"
                            unoptimized
                        />
                        <div className="absolute inset-0 bg-black/60" />
                    </div>
                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
                            {contactConfig?.contactHeader?.title || contactConfig?.title || "Get in Touch"}
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light">
                            {contactConfig?.contactHeader?.subtitle || contactConfig?.subtitle || "We'd love to hear from you. Here's how you can reach us."}
                        </p>
                    </div>
                </section>
            )}

            <div data-section="form" className="container mx-auto px-4 -mt-10 relative z-20 max-w-6xl">
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col lg:flex-row">

                    {/* Contact Information (Left/Top) */}
                    <div className="lg:w-2/5 p-8 md:p-12 text-white relative overflow-hidden" style={{ backgroundColor: 'var(--store-primary)' }}>
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-black opacity-10 rounded-full blur-2xl"></div>

                        <h2 className="text-2xl font-bold mb-8 relative z-10">{contactConfig?.infoTitle || "Contact Information"}</h2>
                        <p className="mb-10 text-white/90 leading-relaxed relative z-10">
                            {contactConfig?.infoDescription || "Fill out the form and our team will get back to you within 24 hours."}
                        </p>

                        <div className="space-y-8 relative z-10">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                    <Phone className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-1">Call Us</h3>
                                    <p className="text-white/80">+1 (555) 123-4567</p>
                                    <p className="text-white/80">+1 (555) 987-6543</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-1">Email Us</h3>
                                    <p className="text-white/80">hello@{storeConfig.slug}.com</p>
                                    <p className="text-white/80">support@{storeConfig.slug}.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                    <MapPin className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white mb-1">Visit Us</h3>
                                    <p className="text-white/80">
                                        123 Commerce Blvd,<br />
                                        Suite 100,<br />
                                        Business City, ST 12345
                                    </p>
                                </div>
                            </div>

                            {contactConfig?.contactForm?.showHours !== false && (
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                        <Clock className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-1">Opening Hours</h3>
                                        <p className="text-white/80">Mon - Fri: 9am - 6pm</p>
                                        <p className="text-white/80">Sat: 10am - 4pm</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {contactConfig?.contactForm?.showSocialLinks !== false && (
                            <div className="mt-12 relative z-10">
                                <div className="flex gap-4">
                                    {/* Social Icons Placeholder */}
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 cursor-pointer transition-colors" />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Contact Form (Right/Bottom) */}
                    {contactConfig?.contactForm?.showForm !== false && (
                        <div className="lg:w-3/5 p-8 md:p-12 bg-white relative">
                            <div className="absolute top-0 right-0 p-6 opacity-5">
                                <MessageSquare className="w-32 h-32" />
                            </div>

                            {formState === 'success' ? (
                                <div className="h-full flex flex-col items-center justify-center text-center py-10">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                        <CheckCircle className="w-10 h-10 text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                                    <p className="text-gray-600 max-w-sm mx-auto mb-8">
                                        Thank you for contacting us. We have received your message and will respond as soon as possible.
                                    </p>
                                    <Button
                                        onClick={() => setFormState('idle')}
                                        className="bg-gray-900 hover:bg-gray-800"
                                    >
                                        Send Another Message
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                required
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-gray-900 focus:ring-0 outline-none transition-all"
                                                placeholder="John"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                required
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-gray-900 focus:ring-0 outline-none transition-all"
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                                            <input
                                                type="email"
                                                id="email"
                                                required
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-gray-900 focus:ring-0 outline-none transition-all"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone (Optional)</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-gray-900 focus:ring-0 outline-none transition-all"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="subject" className="text-sm font-medium text-gray-700">Subject</label>
                                        <select
                                            id="subject"
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-gray-900 focus:ring-0 outline-none transition-all"
                                        >
                                            <option value="general">General Inquiry</option>
                                            <option value="support">Customer Support</option>
                                            <option value="orders">Order Status & Returns</option>
                                            <option value="size">Sizing & Styling Advice</option>
                                            <option value="wholesale">Wholesale & Partnerships</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="message" className="text-sm font-medium text-gray-700">Message</label>
                                        <textarea
                                            id="message"
                                            rows={4}
                                            required
                                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-gray-900 focus:ring-0 outline-none transition-all resize-none"
                                            placeholder="How can we help you today?"
                                        ></textarea>
                                    </div>

                                    <div className="pt-2">
                                        <Button
                                            type="submit"
                                            disabled={formState === 'submitting'}
                                            className="w-full py-6 text-lg font-semibold rounded-xl"
                                            style={{ backgroundColor: 'var(--store-primary)' }}
                                        >
                                            {formState === 'submitting' ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                                    Sending...
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-2">
                                                    Send Message
                                                    <Send className="w-4 h-4" />
                                                </span>
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Map Section */}
            {contactConfig?.contactForm?.showMap !== false && (
                <section data-section="map" className="container mx-auto px-4 mt-20 max-w-6xl">
                    <div className="bg-gray-100 rounded-3xl overflow-hidden h-96 w-full relative grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholder for map */}
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.2219901290355!2d-74.00369368400567!3d40.71312937933185!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a23e28c1191%3A0x49f75d3281df052a!2s150%20Park%20Row%2C%20New%20York%2C%20NY%2010007!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            title="Store Location"
                        ></iframe>
                        <div className="absolute top-4 right-4 bg-white p-4 rounded-xl shadow-lg z-10 hidden md:block">
                            <p className="font-bold text-gray-900">{storeConfig.name}</p>
                            <p className="text-sm text-gray-500">123 Commerce Blvd</p>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}

