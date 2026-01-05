'use client';

import { StoreConfig } from '@/lib/store-types';
import { Cookie, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface CookiePolicyPageProps {
  storeConfig: StoreConfig;
}

export function CookiePolicyPage({ storeConfig }: CookiePolicyPageProps) {
  const primaryColor = storeConfig.branding.primaryColor;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <Link 
            href={`/${storeConfig.slug}`}
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
              <Cookie className="w-6 h-6" style={{ color: primaryColor }} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Cookie Policy</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 prose prose-lg max-w-none">
          <p className="text-gray-500 lead">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <p>
            This Cookie Policy explains what cookies are and how we use them. You should read this policy so you can understand what type of cookies we use, 
            or the information we collect using cookies and how that information is used.
          </p>

          <h3>What are cookies?</h3>
          <p>
            Cookies are small text files that are sent to your web browser by a website you visit. A cookie file is stored in your web browser and allows 
            the Service or a third-party to recognize you and make your next visit easier and the Service more useful to you.
          </p>

          <h3>How {storeConfig.name} uses cookies</h3>
          <p>
            When you use and access the Service, we may place a number of cookies files in your web browser. We use cookies for the following purposes:
          </p>
          <ul>
            <li>To enable certain functions of the Service</li>
            <li>To provide analytics</li>
            <li>To store your preferences</li>
            <li>To enable advertisements delivery, including behavioral advertising</li>
          </ul>

          <h3>Types of cookies we use</h3>
          
          <h4>Essential Cookies</h4>
          <p>
            We use essential cookies to authenticate users and prevent fraudulent use of user accounts.
          </p>

          <h4>Preferences Cookies</h4>
          <p>
            We use preferences cookies to remember information that changes the way the Service behaves or looks, such as the &quot;remember me&quot; functionality 
            of a registered user or a user&apos;s language preference.
          </p>

          <h4>Analytics Cookies</h4>
          <p>
            We use analytics cookies to track information how the Service is used so that we can make improvements. We may also use analytics cookies 
            to test new advertisements, pages, features or new functionality of the Service to see how our users react to them.
          </p>

          <h3>Third-party cookies</h3>
          <p>
            In addition to our own cookies, we may also use various third-parties cookies to report usage statistics of the Service, deliver advertisements 
            on and through the Service, and so on.
          </p>

          <h3>What are your choices regarding cookies?</h3>
          <p>
            If you&apos;d like to delete cookies or instruct your web browser to delete or refuse cookies, please visit the help pages of your web browser.
          </p>
          <p>
            Please note, however, that if you delete cookies or refuse to accept them, you might not be able to use all of the features we offer, you may 
            not be able to store your preferences, and some of our pages might not display properly.
          </p>
        </div>
      </div>
    </div>
  );
}

