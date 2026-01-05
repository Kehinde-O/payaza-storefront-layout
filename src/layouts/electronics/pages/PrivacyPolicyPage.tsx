'use client';

import { StoreConfig } from '@/lib/store-types';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PrivacyPolicyPageProps {
  storeConfig: StoreConfig;
}

export function PrivacyPolicyPage({ storeConfig }: PrivacyPolicyPageProps) {
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
              <ShieldCheck className="w-6 h-6" style={{ color: primaryColor }} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
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
            At {storeConfig.name}, accessible from {typeof window !== 'undefined' ? window.location.origin : 'our website'}, one of our main priorities is the privacy of our visitors. 
            This Privacy Policy document contains types of information that is collected and recorded by {storeConfig.name} and how we use it.
          </p>
          
          <p>
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.
          </p>

          <h3>Log Files</h3>
          <p>
            {storeConfig.name} follows a standard procedure of using log files. These files log visitors when they visit websites. 
            All hosting companies do this and a part of hosting services&apos; analytics. The information collected by log files include internet protocol (IP) addresses, 
            browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. 
            These are not linked to any information that is personally identifiable. The purpose of the information is for analyzing trends, 
            administering the site, tracking users&apos; movement on the website, and gathering demographic information.
          </p>

          <h3>Cookies and Web Beacons</h3>
          <p>
            Like any other website, {storeConfig.name} uses &quot;cookies&quot;. These cookies are used to store information including visitors&apos; preferences, 
            and the pages on the website that the visitor accessed or visited. The information is used to optimize the users&apos; experience by customizing 
            our web page content based on visitors&apos; browser type and/or other information.
          </p>

          <h3>Privacy Policies</h3>
          <p>
            You may consult this list to find the Privacy Policy for each of the advertising partners of {storeConfig.name}.
          </p>
          <p>
            Third-party ad servers or ad networks uses technologies like cookies, JavaScript, or Web Beacons that are used in their respective 
            advertisements and links that appear on {storeConfig.name}, which are sent directly to users' browser. They automatically receive your 
            IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize 
            the advertising content that you see on websites that you visit.
          </p>
          <p>
            Note that {storeConfig.name} has no access to or control over these cookies that are used by third-party advertisers.
          </p>

          <h3>Third Party Privacy Policies</h3>
          <p>
            {storeConfig.name}'s Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective 
            Privacy Policies of these third-party ad servers for more detailed information. It may include their practices and instructions about how 
            to opt-out of certain options.
          </p>
          <p>
            You can choose to disable cookies through your individual browser options. To know more detailed information about cookie management 
            with specific web browsers, it can be found at the browsers' respective websites.
          </p>

          <h3>Children's Information</h3>
          <p>
            Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, 
            participate in, and/or monitor and guide their online activity.
          </p>
          <p>
            {storeConfig.name} does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you think that 
            your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best 
            efforts to promptly remove such information from our records.
          </p>

          <h3>Online Privacy Policy Only</h3>
          <p>
            This Privacy Policy applies only to our online activities and is valid for visitors to our website with regards to the information that 
            they shared and/or collect in {storeConfig.name}. This policy is not applicable to any information collected offline or via channels 
            other than this website.
          </p>

          <h3>Consent</h3>
          <p>
            By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
          </p>
        </div>
      </div>
    </div>
  );
}

