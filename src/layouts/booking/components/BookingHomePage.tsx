'use client';

import { StoreConfig } from '@/lib/store-types';
import { Button } from '@/components/ui/button';
import { Clock, Star, ArrowRight, User, Sparkles, Quote } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency, filterActiveServices } from '../../../lib/utils';
import { getBannerImage, getServiceImage, getTeamMemberImage, getAssetUrl, getTextContent, getFeaturesList, getLayoutText } from '../../../lib/utils/asset-helpers';
import { TestimonialCard } from '../../shared/components/TestimonialCard';

interface BookingHomePageProps {
  storeConfig: StoreConfig;
}

export function BookingHomePage({ storeConfig }: BookingHomePageProps) {
  const services = filterActiveServices(storeConfig.services || []);
  const primaryColor = storeConfig.branding.primaryColor;
  const layoutConfig = storeConfig.layoutConfig;
  const heroBg = getBannerImage(
    storeConfig,
    'hero_bg',
    'https://images.unsplash.com/photo-1457972729786-0411a3b2b626?q=80&w=2070&auto=format&fit=crop'
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] w-full overflow-hidden flex items-center bg-gray-900">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroBg}
            alt="Makeup Studio"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="container mx-auto px-4 relative z-10 text-white">
          <div className="max-w-2xl animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>{getTextContent(storeConfig, 'hero_badge', 'Premium Beauty Studio')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-light mb-6 tracking-tight leading-tight">
              {(() => {
                const titleText = getTextContent(storeConfig, 'hero_title', 'Reveal Your\nInner Radiance.');
                const lines = titleText.split('\n');
                return lines.map((line, i) => (
                  <span key={i}>
                    {i === lines.length - 1 ? (
                      <span className="font-bold">{line}</span>
                    ) : (
                      <>
                        {line} <br />
                      </>
                    )}
                  </span>
                ));
              })()}
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 font-light leading-relaxed max-w-lg">
              {getTextContent(storeConfig, 'hero_subtitle', storeConfig.description || "Enhance your natural beauty with our professional makeup artistry.")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={`/${storeConfig.slug}/book`}>
                <Button
                  size="lg"
                  className="h-14 px-8 rounded-full text-lg font-medium bg-white text-black hover:bg-gray-100 transition-colors"
                >
                  {getLayoutText(storeConfig, 'booking.bookAppointment', getTextContent(storeConfig, 'book_btn', 'Book Appointment'))}
                </Button>
              </Link>
              <Link href={`/${storeConfig.slug}/services`}>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 px-8 rounded-full text-lg font-medium border-white/80 text-white bg-white/5 hover:bg-white/15 hover:text-white transition-colors backdrop-blur-sm shadow-lg"
                >
                  {getLayoutText(storeConfig, 'booking.viewServices', getTextContent(storeConfig, 'view_services_btn', 'View Services'))}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Stripe */}
      <section className="py-12 md:py-20 px-4 bg-gray-50/50">
        <div className="container mx-auto max-w-7xl">
          <div className="flex justify-between items-end mb-8 md:mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {getLayoutText(
                  storeConfig,
                  'sections.featuredServices.title',
                  getTextContent(storeConfig, 'services_section_title', 'Signature Looks')
                )}
              </h2>
              <p className="text-gray-500">
                {getLayoutText(
                  storeConfig,
                  'sections.featuredServices.subtitle',
                  getTextContent(storeConfig, 'services_section_subtitle', 'Curated styles for every occasion')
                )}
              </p>
            </div>
            <Link href={`/${storeConfig.slug}/services`} className="flex items-center gap-2 text-sm font-bold tracking-wide uppercase hover:underline" style={{ color: primaryColor }}>
              {getLayoutText(
                storeConfig,
                'sections.featuredServices.viewAll',
                getTextContent(storeConfig, 'services_view_all', 'View All')
              )}{' '}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.slice(0, 3).map((service) => (
              <Link href={`/${storeConfig.slug}/book?service=${service.slug}`} key={service.id} className="group cursor-pointer">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-6 bg-gray-200">
                  <Image
                    src={getServiceImage(service.image, storeConfig, "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=2069&auto=format&fit=crop")}
                    alt={service.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    unoptimized
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-bold shadow-sm">
                    {formatCurrency(service.price, service.currency || storeConfig.settings?.currency || 'USD')}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">{service.name}</h3>
                <p className="text-gray-500 line-clamp-2 mb-4">{service.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {service.duration} mins
                  </div>
                  {service.provider && (
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" /> {service.provider.name}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Meet the Specialists */}
      <section className="py-12 md:py-24 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden bg-gray-100 relative">
                <Image
                  src={getTeamMemberImage(storeConfig, 'Sarah Mitchell', 'specialist_image', "https://blog.sugar.ng/files/styles/width-640/public/We%20Just%20Found%20the%20Perfect%20Nikkai%20Bridal%20Look%20for%20You.jpg?itok=HGIlGdwB")}
                  alt="Specialist"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur p-6 rounded-2xl shadow-xl">
                <h3 className="text-xl font-bold text-gray-900">
                  {getLayoutText(storeConfig, 'sections.team.memberName', getTextContent(storeConfig, 'team_member_name', 'Sarah Mitchell'))}
                </h3>
                <p className="text-gray-500 mb-4">
                  {getLayoutText(storeConfig, 'sections.team.memberRole', getTextContent(storeConfig, 'team_member_role', 'Lead Makeup Artist'))}
                </p>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-black">5.0</span>
                  <span className="text-gray-400 text-sm ml-1">(150+ Reviews)</span>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight">
                {(() => {
                  const defaultTitle = storeConfig.pageFeatures?.teamPage
                    ? 'Artistry in\nevery brushstroke.'
                    : 'Excellence in\nevery detail.';
                  // Try new structured text first, then fallback to legacy
                  const titleText = getLayoutText(
                    storeConfig,
                    'sections.team.title',
                    getTextContent(storeConfig, 'team_section_title', defaultTitle)
                  );
                  return titleText.split('\n').map((line, i, arr) => (
                    <span key={i}>
                      {i === arr.length - 1 ? (
                        <span className="font-bold">{line}</span>
                      ) : (
                        <>
                          {line} <br />
                        </>
                      )}
                    </span>
                  ));
                })()}
              </h2>
              <p className="text-xl text-gray-500 font-light leading-relaxed">
                {getLayoutText(
                  storeConfig,
                  'sections.team.subtitle',
                  getTextContent(
                    storeConfig,
                    'team_desc',
                    storeConfig.pageFeatures?.teamPage
                      ? "Our team of certified makeup artists brings passion and precision to every look. Whether it's your big day or a night out, we create looks that enhance your natural beauty."
                      : "We bring passion and precision to every look. Whether it's your big day or a night out, we create looks that enhance your natural beauty."
                  )
                )}
              </p>

              <div className="space-y-6">
                {getFeaturesList(storeConfig, 'team_feature_', [
                  "Certified Professional Artists",
                  "Premium & Luxury Brands",
                  "Customized Color Matching",
                  "Long-lasting Techniques"
                ]).map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-50 text-gray-900">
                      <Star className="w-5 h-5" />
                    </div>
                    <span className="text-lg font-medium text-gray-900">{item}</span>
                  </div>
                ))}
              </div>

              {/* Dynamic CTA based on enabled pages */}
              {storeConfig.pageFeatures?.teamPage && (
                <Link href={`/${storeConfig.slug}/team`}>
                  <Button
                    size="lg"
                    className="mt-8 h-14 px-8 rounded-full text-lg"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Meet Our Team
                  </Button>
                </Link>
              )}
              {storeConfig.pageFeatures?.portfolioPage && !storeConfig.pageFeatures?.teamPage && (
                <Link href={`/${storeConfig.slug}/portfolio`}>
                  <Button
                    size="lg"
                    className="mt-8 h-14 px-8 rounded-full text-lg"
                    style={{ backgroundColor: primaryColor }}
                  >
                    View Portfolio
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials - Conditionally rendered */}
      {layoutConfig?.sections?.testimonials?.show !== false && (
        <section className="py-16 md:py-24 px-4 bg-black text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="container mx-auto max-w-7xl relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-4xl font-bold mb-4">
                {layoutConfig?.sections?.testimonials?.title || getLayoutText(storeConfig, 'sections.testimonials.title', 'What Our Clients Say')}
              </h2>
              {layoutConfig?.sections?.testimonials?.subtitle && (
                <p className="text-white/70 text-lg">
                  {layoutConfig.sections.testimonials.subtitle}
                </p>
              )}
            </div>

            {(() => {
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

              const testimonials = backendTestimonials.length > 0 ? backendTestimonials : fallbackTestimonials;

              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {testimonials.slice(0, 3).map((testimonial) => (
                    <div key={testimonial.id || testimonial.name} className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                      <TestimonialCard testimonial={testimonial} />
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 px-4 bg-gray-50 text-center">
        <div className="container mx-auto max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {getLayoutText(
              storeConfig,
              'sections.cta.title',
              getTextContent(storeConfig, 'cta_title', 'Ready to glow?')
            )}
          </h2>
          <p className="text-gray-500 text-lg mb-10">
            {getLayoutText(
              storeConfig,
              'sections.cta.description',
              getTextContent(storeConfig, 'cta_description', 'Book your session today and let us create the perfect look for you.')
            )}
          </p>
          <Link href={`/${storeConfig.slug}/book`}>
            <Button
              size="lg"
              className="h-16 px-12 rounded-full text-xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
              style={{ backgroundColor: primaryColor }}
            >
              {getLayoutText(storeConfig, 'booking.bookAppointment', 'Book Appointment')}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
