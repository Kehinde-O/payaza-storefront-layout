'use client';

import { StoreConfig, StoreService } from '@/lib/store-types';
import { Button } from '@/components/ui/button';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { Play, FileText, Headphones, Lock, Star, CheckCircle, Clock, Download, Share2, Heart, ArrowRight, BookOpen, Users, Award, Zap, X } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useStore } from '@/lib/store-context';
import { useToast } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Image from 'next/image';
import { formatCurrency, filterActiveServices } from '@/lib/utils';
import { getServiceImage, getTextContent } from '@/lib/utils/asset-helpers';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ServiceDetailPageProps {
  storeConfig: StoreConfig;
  serviceSlug: string;
}

export function ServiceDetailPage({ storeConfig, serviceSlug }: ServiceDetailPageProps) {
  const services = filterActiveServices(storeConfig.services || []);
  const service = services.find(s => s.slug === serviceSlug);
  const { addToCart, isCartLoading, toggleWishlist, isInWishlist, isWishlistLoading, cart } = useStore();
  const { addToast } = useToast();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'curriculum' | 'reviews'>('overview');
  const [isPlaying, setIsPlaying] = useState(false);

  const hasAccess = useMemo(() => {
    if (service?.accessLevel === 'free' || service?.price === 0) return true;
    // In a real app, we'd check if the user has purchased this specific item or has a subscription
    // For this demo, let's assume they have access if they are authenticated
    return isAuthenticated;
  }, [service, isAuthenticated]);

  // Handle playing video/audio
  const handlePlay = () => {
    if (!hasAccess) {
      handleAddToCart();
      return;
    }
    setIsPlaying(true);
  };

  // Related services
  const relatedServices = useMemo(() => {
    if (!service) return [];
    return services
      .filter(s => s.categoryId === service.categoryId && s.id !== service.id)
      .slice(0, 4);
  }, [service, services]);

  if (!service) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Content Not Found</h1>
          <p className="text-gray-600 mb-4">The content you&apos;re looking for doesn&apos;t exist.</p>
          <Link href={`/${storeConfig.slug}/services`}>
            <Button>Browse All Content</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Determine content type
  let TypeIcon = Play;
  let typeLabel = "Video Course";
  let contentTypeColor = "bg-blue-500";

  if (service.contentType === 'audio') {
    TypeIcon = Headphones;
    typeLabel = "Audiobook";
    contentTypeColor = "bg-purple-500";
  } else if (service.contentType === 'pdf') {
    TypeIcon = FileText;
    typeLabel = "PDF Guide";
    contentTypeColor = "bg-green-500";
  }

  const isLocked = service.accessLevel === 'subscription' || service.accessLevel === 'paid';
  const isFree = service.accessLevel === 'free' || service.price === 0;

  // Breadcrumbs
  const category = storeConfig.categories.find(c => c.id === service.categoryId);
  const baseSlug = storeConfig.slug.startsWith('demo/') ? storeConfig.slug : `/${storeConfig.slug}`;
  const breadcrumbItems = [
    { label: storeConfig.name, href: baseSlug.startsWith('/') ? baseSlug : `/${baseSlug}` },
    { label: 'Services', href: `${baseSlug.startsWith('/') ? baseSlug : '/' + baseSlug}/services` },
    ...(category ? [{ label: category.name, href: `${baseSlug.startsWith('/') ? baseSlug : '/' + baseSlug}/categories/${category.slug}` }] : []),
    { label: service.name, href: `${baseSlug.startsWith('/') ? baseSlug : '/' + baseSlug}/services/${service.slug}` },
  ];

  const handleAddToCart = () => {
    // For services, we add them to cart similar to products
    addToCart(service as any, 1);
    addToast(`${service.name} added to cart`, 'success');
  };

  const handleWishlistClick = async () => {
    if (isWishlistLoading) return;
    
    try {
      const wasInWishlist = isInWishlist(service.id);
      await toggleWishlist(service.id);
      addToast(
        wasInWishlist 
          ? `${service.name} removed from wishlist` 
          : `${service.name} added to wishlist`,
        'success'
      );
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
      addToast('Failed to update wishlist', 'error');
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: service.name,
          text: service.description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        addToast('Link copied to clipboard!', 'success');
      } catch (err) {
        addToast('Failed to copy link', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 max-w-7xl">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs items={breadcrumbItems} />
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mb-20">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero Image/Video/Audio Player */}
            <div className="relative aspect-video bg-black rounded-2xl overflow-hidden group shadow-2xl border border-gray-800">
              {isPlaying && hasAccess ? (
                <div className="absolute inset-0 bg-black flex items-center justify-center">
                  {service.contentType === 'video' ? (
                    <video 
                      src={service.contentUrl} 
                      controls 
                      autoPlay 
                      className="w-full h-full object-contain"
                      poster={getServiceImage(service.image, storeConfig, "")}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : service.contentType === 'audio' ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-900 to-slate-900 text-white">
                      <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mb-6 backdrop-blur-xl border border-white/10 shadow-2xl relative">
                        <Headphones className="w-12 h-12 text-white relative z-10" />
                        <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping opacity-20" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                      <p className="text-gray-400 mb-8">Now Playing • Audiobook</p>
                      <audio src={service.contentUrl} controls autoPlay className="w-full max-w-md h-12" />
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gray-50">
                      <div className="w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                        <FileText className="w-12 h-12 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Resource Ready</h3>
                      <p className="text-gray-500 mb-8 text-center max-w-sm">You have access to this premium guide. Download it below to start reading.</p>
                      <a 
                        href={service.contentUrl} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-black text-white px-10 py-4 rounded-full font-bold hover:bg-gray-800 transition-all flex items-center gap-3 shadow-xl"
                      >
                        <Download className="w-5 h-5" /> Download PDF Guide
                      </a>
                    </div>
                  )}
                  <button 
                    onClick={() => setIsPlaying(false)}
                    className="absolute top-6 right-6 bg-black/40 hover:bg-black/60 p-3 rounded-full backdrop-blur-md transition-all border border-white/10 group/close"
                    title="Close player"
                  >
                    <X className="w-5 h-5 text-white group-hover/close:rotate-90 transition-transform" />
                  </button>
                </div>
              ) : (
                <>
                  <Image
                    src={getServiceImage(service.image, storeConfig, "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop")}
                    alt={service.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  
                  {/* Play/Access Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {hasAccess ? (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsPlaying(true)}
                        className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center shadow-2xl hover:bg-white/20 transition-colors border border-white/30 relative group/play"
                      >
                        <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover/play:blur-2xl transition-all" />
                        {service.contentType === 'pdf' ? (
                          <Download className="w-10 h-10 text-white relative z-10" />
                        ) : (
                          <Play className="w-10 h-10 text-white ml-1 relative z-10" fill="currentColor" />
                        )}
                      </motion.button>
                    ) : (
                      <div className="text-center p-6 backdrop-blur-md bg-black/40 rounded-3xl border border-white/10 max-w-sm mx-4">
                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20">
                          <Lock className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Premium Content</h3>
                        <p className="text-gray-300 text-sm mb-6">This {typeLabel.toLowerCase()} is exclusive to members. Unlock it now to start learning.</p>
                        <Button 
                          onClick={handleAddToCart}
                          className="bg-white text-black hover:bg-gray-200 rounded-full px-8 h-14 font-bold text-base w-full shadow-2xl"
                        >
                          Unlock For {formatCurrency(service.price, service.currency || 'USD')}
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Content Type Badge */}
              <div className="absolute top-6 left-6">
                <div className={cn("px-4 py-2 rounded-full text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 backdrop-blur-md shadow-lg", contentTypeColor)}>
                  <TypeIcon className="w-3 h-3" /> {typeLabel}
                </div>
              </div>

              {/* Access Badge */}
              {!hasAccess && isLocked && (
                <div className="absolute top-6 right-6">
                  <div className="px-4 py-2 rounded-full bg-black/90 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg">
                    <Lock className="w-3 h-3" /> Premium
                  </div>
                </div>
              )}
            </div>

            {/* Title and Meta */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                  {category?.name || 'Course'}
                </span>
                <span className="text-gray-300">•</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold">4.9</span>
                  <span className="text-sm text-gray-500">(127 reviews)</span>
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4 leading-tight">
                {service.name}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex gap-8">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'curriculum', label: 'Curriculum' },
                  { id: 'reviews', label: 'Reviews' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id as any)}
                    className={cn(
                      "pb-4 px-2 text-sm font-semibold transition-colors border-b-2 -mb-px",
                      selectedTab === tab.id
                        ? "text-gray-900 border-gray-900"
                        : "text-gray-500 border-transparent hover:text-gray-700"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="py-8">
              {selectedTab === 'overview' && (
                <div className="space-y-6 prose prose-lg max-w-none">
                  <div>
                    <h3 className="text-2xl font-serif text-gray-900 mb-4">What You&apos;ll Learn</h3>
                    <ul className="space-y-3">
                      {[
                        "Master the fundamentals of mindset transformation",
                        "Develop practical strategies for daily success",
                        "Build confidence and overcome limiting beliefs",
                        "Create actionable plans for your goals",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif text-gray-900 mb-4">Course Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Duration</div>
                          <div className="font-semibold">{service.duration} minutes</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Students</div>
                          <div className="font-semibold">12,345 enrolled</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Level</div>
                          <div className="font-semibold">All Levels</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Award className="w-5 h-5 text-gray-400" />
                        <div>
                          <div className="text-sm text-gray-500">Certificate</div>
                          <div className="font-semibold">Included</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedTab === 'curriculum' && (
                <div className="space-y-4">
                  {[
                    { title: "Introduction", lessons: 3, duration: "15 min" },
                    { title: "Core Concepts", lessons: 8, duration: "45 min" },
                    { title: "Practical Applications", lessons: 5, duration: "30 min" },
                    { title: "Advanced Techniques", lessons: 4, duration: "20 min" },
                    { title: "Conclusion & Next Steps", lessons: 2, duration: "10 min" },
                  ].map((section, i) => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900">{section.title}</h4>
                        <span className="text-sm text-gray-500">{section.duration}</span>
                      </div>
                      <p className="text-sm text-gray-600">{section.lessons} lessons</p>
                    </div>
                  ))}
                </div>
              )}

              {selectedTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-5xl font-bold">4.9</div>
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <div className="text-sm text-gray-600">Based on 127 reviews</div>
                    </div>
                  </div>
                  {[
                    { name: "Sarah Johnson", rating: 5, comment: "This course completely transformed my approach to goal setting. Highly recommend!", date: "2 weeks ago" },
                    { name: "Michael Chen", rating: 5, comment: "Excellent content and delivery. Worth every penny!", date: "1 month ago" },
                    { name: "David Lee", rating: 4, comment: "Great course overall. Some sections could be more detailed.", date: "2 months ago" },
                  ].map((review, i) => (
                    <div key={i} className="border-b border-gray-100 pb-6 last:border-b-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-semibold">{review.name[0]}</span>
                        </div>
                        <div>
                          <div className="font-semibold">{review.name}</div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, j) => (
                                <Star key={j} className={cn("w-3 h-3", j < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300")} />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">{review.date}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 mt-2">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Purchase Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg">
                <div className="mb-6">
                  <div className="text-4xl font-bold text-gray-900 mb-2">
                    {isFree ? 'Free' : formatCurrency(service.price, service.currency || 'USD')}
                  </div>
                  {!isFree && (
                    <div className="text-sm text-gray-500 line-through">
                      {formatCurrency(service.price * 1.5, service.currency || 'USD')}
                    </div>
                  )}
                </div>

                <div className="space-y-4 mb-6">
                  <Button
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={isCartLoading}
                    className="w-full h-14 rounded-full bg-black text-white hover:bg-gray-800 font-bold text-lg"
                  >
                    {isCartLoading ? 'Adding...' : isFree ? 'Enroll Now' : 'Add to Cart'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>

                  {storeConfig.features.wishlist && (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleWishlistClick}
                      disabled={isWishlistLoading}
                      className={cn(
                        "w-full h-14 rounded-full border-2 transition-all",
                        isInWishlist(service.id)
                          ? "border-red-500 bg-red-50 text-red-500 hover:bg-red-100"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <Heart className={cn("w-5 h-5 mr-2", isInWishlist(service.id) && "fill-current")} />
                      {isInWishlist(service.id) ? 'In Wishlist' : 'Add to Wishlist'}
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleShare}
                    className="w-full h-14 rounded-full border-2 border-gray-200"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </Button>
                </div>

                <div className="border-t border-gray-200 pt-6 space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-700">
                      <div className="font-semibold">Lifetime Access</div>
                      <div className="text-gray-500">Access this course forever</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-700">
                      <div className="font-semibold">Certificate of Completion</div>
                      <div className="text-gray-500">Get certified upon completion</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-700">
                      <div className="font-semibold">30-Day Money-Back Guarantee</div>
                      <div className="text-gray-500">Full refund if not satisfied</div>
                    </div>
                  </div>
                </div>

                {isLocked && !isAuthenticated && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <Lock className="w-4 h-4 inline mr-1" />
                      This content requires a membership or purchase.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <div className="mt-20 pt-16 border-t border-gray-200">
            <h2 className="text-3xl font-serif text-gray-900 mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedServices.map((relatedService) => (
                <Link
                  key={relatedService.id}
                  href={`/${storeConfig.slug}/services/${relatedService.slug}`}
                  className="group"
                >
                  <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all">
                    <div className="relative aspect-video bg-gray-200">
                      <Image
                        src={getServiceImage(relatedService.image, storeConfig, "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop")}
                        alt={relatedService.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:underline">
                        {relatedService.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-900">
                          {relatedService.price > 0 ? formatCurrency(relatedService.price, relatedService.currency || 'USD') : 'Free'}
                        </span>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

