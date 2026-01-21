'use client';

import { StoreConfig } from '@/lib/store-types';
import { Users, Award, Heart, Leaf, MapPin, Clock, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DotPattern } from '@/components/ui/background-patterns';
import { useStore } from '@/lib/store-context';
import Image from 'next/image';

interface AboutPageProps {
  storeConfig: StoreConfig;
}

export function AboutPage({ storeConfig: initialConfig }: AboutPageProps) {
  const { store } = useStore();
  const storeConfig = store || initialConfig;
  
  const primaryColor = storeConfig.branding.primaryColor;
  const secondaryColor = storeConfig.branding.secondaryColor || primaryColor;
  const aboutConfig = storeConfig.layoutConfig?.pages?.about;

  // Booking-agenda-specific hero image
  const heroImage = aboutConfig?.heroImage || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop';

  const pageTitle = aboutConfig?.title || "Crafting Experiences, Delivering Joy.";
  const pageContent = aboutConfig?.content || storeConfig.description;
  const missionStatement = aboutConfig?.missionStatement;
  const galleryImages = aboutConfig?.gallerySection;

  const values = [
    {
      icon: Award,
      title: "Mastery",
      description: "Our team consists of industry leaders with decades of combined expertise."
    },
    {
      icon: Users,
      title: "Community",
      description: "Building lasting relationships through reliable and consistent service."
    },
    {
      icon: Heart,
      title: "Dedication",
      description: "Your goals are our goals. We are committed to your absolute success."
    },
    {
      icon: Leaf,
      title: "Integrity",
      description: "Honest, transparent, and ethical practices in everything we do."
    }
  ];

  return (
    <div className="min-h-screen bg-white pb-20 overflow-hidden">
      {/* Hero Section */}
      <section data-section="hero" className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="About Us"
            fill
            className="w-full h-full object-cover transform scale-105 animate-pulse-slow"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </div>
        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Est. 2024
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                {pageTitle}
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-2xl leading-relaxed font-light">
                {missionStatement || storeConfig.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section data-section="story" className="py-24 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-0 right-0 -mt-24 -mr-24 w-96 h-96 bg-gray-50 rounded-full blur-3xl -z-10" />

        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              {galleryImages && galleryImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {galleryImages.slice(0, 4).map((img, i) => (
                    <div key={i} className={`relative overflow-hidden rounded-2xl shadow-lg ${i === 0 ? 'col-span-2 aspect-[16/9]' : 'aspect-square'}`}>
                      <Image src={img.image} alt={img.caption || "Gallery Image"} fill className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" unoptimized />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop"
                    alt="Our Team"
                    fill
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-8 left-8 text-white">
                    <p className="font-bold text-lg">The Dream Team</p>
                    <p className="text-white/80 text-sm">Working together to serve you better</p>
                  </div>
                </div>
              )}
              {/* Decorative elements */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center p-4 animate-bounce duration-[3000ms]">
                <Heart className="w-10 h-10" style={{ color: primaryColor, fill: primaryColor }} />
              </div>
            </div>

            <div className="space-y-10">
              <div>
                <span className="text-sm font-bold uppercase tracking-widest mb-3 block" style={{ color: primaryColor }}>
                  Who We Are
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                  Our Journey
                </h2>
                <div className="prose prose-lg text-gray-600 leading-relaxed space-y-6">
                  {pageContent?.split('\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                  {!pageContent && (
                    <>
                      <p>
                        Founded with a bold vision to redefine excellence in the <span className="font-semibold text-gray-900">{storeConfig.type}</span> industry, {storeConfig.name} has grown from a small passion project into a beloved brand. We believe in the power of quality, innovation, and community.
                      </p>
                      <p>
                        Every day, we strive to bring you the best products, curated with care and delivered with a smile. Our team is dedicated to ensuring that your experience with us is nothing short of exceptional.
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {values.map((item, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-gray-100" style={{ backgroundColor: `${primaryColor}10` }}>
                        <item.icon className="h-7 w-7 transition-transform group-hover:scale-110" style={{ color: primaryColor }} />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2 text-lg">{item.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section data-section="stats" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <DotPattern color={primaryColor} cx={2} cy={2} cr={2} width={30} height={30} />
        </div>
        <div className="absolute inset-0" style={{ backgroundColor: `${secondaryColor}15` }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { label: "Sessions Held", value: "12k+" },
              { label: "Elite Experts", value: "20+" },
              { label: "Programs", value: storeConfig.services?.length ? `${storeConfig.services.length}+` : "25+" },
              { label: "Success Rate", value: "99%" }
            ].map((stat, idx) => (
              <div key={idx} className="text-center group">
                <div className="text-5xl md:text-6xl font-black mb-2 tracking-tight transition-transform group-hover:scale-110 duration-300" style={{ color: primaryColor }}>
                  {stat.value}
                </div>
                <div className="text-gray-600 font-bold uppercase tracking-widest text-xs md:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info - Modern Cards */}
      <section data-section="contact-info" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Have questions? We&apos;d love to hear from you. Reach out to our team via email, phone, or visit us at our store.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-8 rounded-[2rem] bg-gray-50 border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <MapPin className="h-8 w-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">Visit Us</h3>
              <p className="text-gray-600 leading-relaxed">
                {storeConfig.contactInfo?.address?.street || '123 Store Street'}<br />
                {storeConfig.contactInfo?.address?.city || 'Commerce City'}, {storeConfig.contactInfo?.address?.state || 'ST'} {storeConfig.contactInfo?.address?.zipCode || '12345'}
              </p>
            </div>

            <div className="group p-8 rounded-[2rem] bg-gray-50 border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center relative overflow-hidden">
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-orange-100 rounded-[2rem] transition-colors pointer-events-none" />
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="h-8 w-8 text-gray-400 group-hover:text-orange-500 transition-colors" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">Email Us</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                {storeConfig.contactInfo?.email || `hello@${storeConfig.slug}.com`}<br />
                {storeConfig.contactInfo?.phone || '+1 (555) 123-4567'}
              </p>
              <Button variant="link" className="text-orange-600 font-bold p-0 h-auto hover:no-underline group-hover:translate-x-1 transition-transform">
                Send a message <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            <div className="group p-8 rounded-[2rem] bg-gray-50 border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <Clock className="h-8 w-8 text-gray-400 group-hover:text-green-500 transition-colors" />
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">Opening Hours</h3>
              <p className="text-gray-600 leading-relaxed">
                {storeConfig.locations?.[0]?.openingHours || (
                  <>
                    Mon - Fri: 9am - 6pm<br />
                    Sat - Sun: 10am - 4pm
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

