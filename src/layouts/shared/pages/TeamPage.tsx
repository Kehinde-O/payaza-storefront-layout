'use client';

import { StoreConfig } from '@/lib/store-types';
import { Star, Award, MapPin } from 'lucide-react';
import Image from 'next/image';

interface TeamPageProps {
  storeConfig: StoreConfig;
}

export function TeamPage({ storeConfig }: TeamPageProps) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="bg-white pt-32 pb-20 px-4 text-center border-b border-gray-100">
        <h1 className="text-4xl md:text-5xl font-light mb-6 tracking-tight text-gray-900">
          {teamConfig?.title || "Meet Our Team"}
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg font-light leading-relaxed">
          {teamConfig?.description || `The talented professionals behind ${storeConfig.name}.`}
        </p>
      </div>

      <div className="container mx-auto px-4 max-w-6xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {providers.map((provider, idx) => (
            <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
              <div className="aspect-[4/5] overflow-hidden bg-gray-100 relative group">
                <Image 
                  src={provider.photo} 
                  alt={provider.name} 
                  fill
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{provider.name}</h3>
                  <p className="text-sm font-medium uppercase tracking-wide opacity-80" style={{ color: primaryColor }}>
                    {provider.role}
                  </p>
                </div>
                
                <p className="text-gray-500 text-sm mb-8 leading-relaxed flex-1">
                  {provider.bio}
                </p>
                
                <div className="pt-6 border-t border-gray-50 flex items-center justify-between text-xs font-medium text-gray-400">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4" />
                    {(provider as any).experience || 'Expert'}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {(provider as any).location || 'Available'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
