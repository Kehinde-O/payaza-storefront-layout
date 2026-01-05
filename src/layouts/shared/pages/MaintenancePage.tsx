'use client';

import { StoreConfig } from '@/lib/store-types';
import { Wrench, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface MaintenancePageProps {
  storeConfig: StoreConfig;
}

export function MaintenancePage({ storeConfig }: MaintenancePageProps) {
  const primaryColor = storeConfig.branding.primaryColor || '#000000';
  const secondaryColor = storeConfig.branding.secondaryColor || primaryColor;

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${primaryColor}08 0%, ${secondaryColor}05 50%, ${primaryColor}08 100%)`,
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: primaryColor }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: secondaryColor }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="text-center max-w-3xl w-full relative z-10">
        {/* Store Logo/Name */}
        {storeConfig.branding?.logo && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <img
              src={storeConfig.branding.logo}
              alt={storeConfig.name}
              className="h-16 w-auto mx-auto object-contain"
            />
          </motion.div>
        )}

        {/* Animated Maintenance Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div 
            className="w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center shadow-2xl"
            style={{
              backgroundColor: `${primaryColor}15`,
              border: `2px solid ${primaryColor}30`,
            }}
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Wrench 
                className="w-12 h-12"
                style={{ color: primaryColor }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6"
        >
          <h1 
            className="text-5xl md:text-6xl font-black mb-4 tracking-tight"
            style={{
              background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Under Maintenance
          </h1>
          <div 
            className="w-32 h-1 mx-auto rounded-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${primaryColor}, transparent)`,
            }}
          />
        </motion.div>

        {/* Main Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-4 mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {storeConfig.name} is Currently Being Updated
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            This store is currently under maintenance. If you are the owner of this store, you need to launch it to make it visible to customers.
          </p>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-12"
        >
          <div 
            className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl backdrop-blur-sm border-2"
            style={{
              backgroundColor: `${primaryColor}08`,
              borderColor: `${primaryColor}20`,
            }}
          >
            <Sparkles 
              className="w-5 h-5"
              style={{ color: primaryColor }}
            />
            <span className="text-sm font-semibold text-gray-700">
              We&apos;re working hard to bring you an amazing experience
            </span>
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="/"
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
            style={{
              backgroundColor: primaryColor,
            }}
          >
            <span>Browse Other Stores</span>
            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-16 pt-8 border-t border-gray-200"
        >
          <p className="text-sm text-gray-500">
            Check back soon for updates
          </p>
        </motion.div>
      </div>
    </div>
  );
}

