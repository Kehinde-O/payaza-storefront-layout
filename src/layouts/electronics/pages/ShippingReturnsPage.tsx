'use client';

import { StoreConfig } from '@/lib/store-types';
import { Truck, RotateCcw, ShieldCheck, Clock } from 'lucide-react';

interface ShippingReturnsPageProps {
  storeConfig: StoreConfig;
}

export function ShippingReturnsPage({ storeConfig }: ShippingReturnsPageProps) {
  const primaryColor = storeConfig.branding.primaryColor;

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="bg-gray-50 border-b">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Shipping & Returns
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Everything you need to know about our delivery methods, shipping times, and return policies.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        
        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-6">
              <Truck className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Free Shipping</h3>
            <p className="text-gray-500">
              Free standard shipping on all domestic orders over ${storeConfig.settings.freeShippingThreshold || 50}. 
              Orders are processed within 1-2 business days.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-6">
              <RotateCcw className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Easy Returns</h3>
            <p className="text-gray-500">
              Not perfect? Return or exchange within 30 days. We provide a pre-paid return label for all domestic returns.
            </p>
          </div>
        </div>

        <div className="space-y-16">
          {/* Shipping Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-1 h-8 rounded-full bg-gray-900" style={{ backgroundColor: primaryColor }}></span>
              Shipping Policy
            </h2>
            
            <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
              <p>
                We strive to deliver your order as quickly and efficiently as possible. All orders are processed within 24-48 hours of being placed, excluding weekends and holidays.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Domestic Shipping</h3>
              <p>
                We offer the following shipping methods for domestic orders:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong>Standard Shipping (3-5 business days):</strong> $5.99 (Free on orders over ${storeConfig.settings.freeShippingThreshold || 50})</li>
                <li><strong>Express Shipping (2 business days):</strong> $12.99</li>
                <li><strong>Overnight Shipping (1 business day):</strong> $24.99</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">International Shipping</h3>
              <p>
                We ship to select international destinations. Shipping rates and delivery times vary depending on the destination and shipping method selected at checkout. Please note that customers are responsible for any customs duties or taxes that may apply.
              </p>
            </div>
          </section>

          {/* Separator */}
          <div className="border-t border-gray-100"></div>

          {/* Returns Policy */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="w-1 h-8 rounded-full bg-gray-900" style={{ backgroundColor: primaryColor }}></span>
              Returns & Exchanges
            </h2>
            
            <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
              <p>
                We want you to be completely satisfied with your purchase. If for any reason you are not, we accept returns of unworn, unwashed, and undamaged items with original tags attached within 30 days of delivery.
              </p>

              <div className="bg-gray-50 rounded-xl p-6 my-6 border border-gray-100">
                <h4 className="font-semibold text-gray-900 mb-2">How to Start a Return</h4>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Visit our returns portal and enter your order number and email.</li>
                  <li>Select the items you wish to return and the reason for the return.</li>
                  <li>Print the prepaid shipping label provided.</li>
                  <li>Pack the items securely and attach the shipping label.</li>
                  <li>Drop off the package at any authorized carrier location.</li>
                </ol>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Refunds</h3>
              <p>
                Once we receive your return, we will inspect the items and process your refund within 5-7 business days. The refund will be issued to the original payment method. Please note that shipping costs are non-refundable.
              </p>
              
              <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">Exchanges</h3>
              <p>
                If you would like to exchange an item for a different size or color, please return the original item for a refund and place a new order.
              </p>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
}

