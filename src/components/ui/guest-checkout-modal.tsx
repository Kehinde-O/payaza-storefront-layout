'use client';

import * as React from 'react';
import { Modal } from './modal';
import { Button } from './button';
import { User, Mail, Phone, ShoppingBag, ShieldCheck, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GuestCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  }) => void;
  initialData?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
  };
}

export function GuestCheckoutModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: GuestCheckoutModalProps) {
  const [formData, setFormData] = React.useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
      });
    }
  }, [isOpen, initialData]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9+\-\s()]+$/.test(formData.phone.trim())) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
      });
      onClose();
    } catch (error) {
      console.error('Error submitting guest info:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-4xl p-0 overflow-hidden bg-white rounded-2xl shadow-2xl"
    >
      <div className="flex flex-col md:flex-row min-h-[500px]">
        {/* Left Side - Visual */}
        <div className="hidden md:flex flex-col justify-between w-2/5 bg-gray-900 text-white p-8 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gray-800 rounded-full blur-3xl opacity-20 -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gray-800 rounded-full blur-3xl opacity-20 -ml-32 -mb-32"></div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-6">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-3xl font-bold mb-4 leading-tight">Complete Your Order</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              You're just a few steps away from your purchase. Enter your details to proceed with the secure checkout.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span>Secure Payment Processing</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <span>Guest Checkout Enabled</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 p-6 md:p-8 bg-white">
          <div className="md:hidden mb-6 text-center">
             <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-900 mb-3">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Complete Order</h3>
          </div>

          <form onSubmit={handleSubmit} className="h-full flex flex-col">
            <div className="flex-1 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                {/* First Name */}
                <div className="space-y-1.5">
                  <label htmlFor="firstName" className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    className={cn(
                      "w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all text-sm",
                      errors.firstName
                        ? "border-red-300 focus:ring-red-200"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                    placeholder="John"
                    disabled={isSubmitting}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-600">{errors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div className="space-y-1.5">
                  <label htmlFor="lastName" className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    className={cn(
                      "w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all text-sm",
                      errors.lastName
                        ? "border-red-300 focus:ring-red-200"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                    placeholder="Doe"
                    disabled={isSubmitting}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className={cn(
                      "w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all text-sm",
                      errors.phone
                        ? "border-red-300 focus:ring-red-200"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                    placeholder="+234 812 345 6789"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className={cn(
                      "w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:bg-white transition-all text-sm",
                      errors.email
                        ? "border-red-300 focus:ring-red-200"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                    placeholder="john.doe@example.com"
                    disabled={isSubmitting}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={isSubmitting}
                className="text-gray-500 hover:text-gray-900"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gray-900 hover:bg-gray-800 text-white px-8 h-12 rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group"
              >
                {isSubmitting ? (
                  'Processing...'
                ) : (
                  <>
                    Continue to Payment
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
