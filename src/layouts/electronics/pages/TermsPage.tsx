'use client';

import { StoreConfig } from '@/lib/store-types';
import { ScrollText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface TermsPageProps {
  storeConfig: StoreConfig;
}

export function TermsPage({ storeConfig }: TermsPageProps) {
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
              <ScrollText className="w-6 h-6" style={{ color: primaryColor }} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
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
            Please read these Terms of Service (&quot;Terms&quot;, &quot;Terms of Service&quot;) carefully before using the {storeConfig.name} 
            website (the &quot;Service&quot;) operated by {storeConfig.name} (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;).
          </p>

          <h3>1. Conditions of Use</h3>
          <p>
            By using this website, you certify that you have read and reviewed this Agreement and that you agree to comply with its terms. 
            If you do not want to be bound by the terms of this Agreement, you are advised to leave the website accordingly. {storeConfig.name} 
            only grants use and access of this website, its products, and its services to those who have accepted its terms.
          </p>

          <h3>2. Privacy Policy</h3>
          <p>
            Before you continue using our website, we advise you to read our privacy policy regarding our user data collection. 
            It will help you better understand our practices.
          </p>

          <h3>3. Age Restriction</h3>
          <p>
            You must be at least 18 (eighteen) years of age before you can use this website. By using this website, you warrant that you are 
            at least 18 years of age and you may legally adhere to this Agreement. {storeConfig.name} assumes no responsibility for liabilities 
            related to age misrepresentation.
          </p>

          <h3>4. Intellectual Property</h3>
          <p>
            You agree that all materials, products, and services provided on this website are the property of {storeConfig.name}, its affiliates, 
            directors, officers, employees, agents, suppliers, or licensors including all copyrights, trade secrets, trademarks, patents, 
            and other intellectual property. You also agree that you will not reproduce or redistribute the {storeConfig.name}&apos;s intellectual property 
            in any way, including electronic, digital, or new trademark registrations.
          </p>

          <h3>5. User Accounts</h3>
          <p>
            As a user of this website, you may be asked to register with us and provide private information. You are responsible for ensuring 
            the accuracy of this information, and you are responsible for maintaining the safety and security of your identifying information. 
            You are also responsible for all activities that occur under your account or password.
          </p>

          <h3>6. Applicable Law</h3>
          <p>
            By visiting this website, you agree that the laws of the location where {storeConfig.name} is based, without regard to principles of 
            conflict laws, will govern these terms and conditions, or any dispute of any sort that might come between {storeConfig.name} and you, 
            or its business partners and associates.
          </p>

          <h3>7. Disputes</h3>
          <p>
            Any dispute related in any way to your visit to this website or to products you purchase from us shall be arbitrated by state or 
            federal court and you consent to exclusive jurisdiction and venue of such courts.
          </p>

          <h3>8. Indemnification</h3>
          <p>
            You agree to indemnify {storeConfig.name} and its affiliates and hold {storeConfig.name} harmless against legal claims and demands 
            that may arise from your use or misuse of our services. We reserve the right to select our own legal counsel.
          </p>

          <h3>9. Limitation on Liability</h3>
          <p>
            {storeConfig.name} is not liable for any damages that may occur to you as a result of your misuse of our website.
          </p>
          <p>
            {storeConfig.name} reserves the right to edit, modify, and change this Agreement any time. We shall let our users know of these changes 
            through electronic mail. This Agreement is an understanding between {storeConfig.name} and the user, and this supersedes and replaces all 
            prior agreements regarding the use of this website.
          </p>
        </div>
      </div>
    </div>
  );
}

