'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreConfig } from '../../../lib/store-types';
import { BookingAgendaSidebar } from '../components/headers/BookingAgendaSidebar';
import { PageAnimateWrapper } from '../../../components/ui/page-animate-wrapper';
import { PageContentLoader } from '../../../components/ui/page-content-loader';
import { useLoading } from '../../../lib/loading-context';
import { getThemeColor, getLayoutText } from '../../../lib/utils/asset-helpers';
import { AlertModalProvider } from '../../../components/ui/alert-modal';
import { Modal } from '../../../components/ui/modal';
import { Button } from '../../../components/ui/button';
import { usePayazaCheckout } from '../../../hooks/use-payaza-checkout';
import { useToast } from '../../../components/ui/toast';
import { useAuth } from '../../../lib/auth-context';
import { filterActiveServices, formatCurrency } from '../../../lib/utils';
import { CheckCircle, Sparkles, Lock } from 'lucide-react';

// Context Definition
interface BookingContextType {
  openBooking: (serviceId?: string) => void;
  closeBooking: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingAgendaLayout');
  }
  return context;
}

interface BookingAgendaLayoutProps {
  children: React.ReactNode;
  storeConfig: StoreConfig;
}

export function BookingAgendaLayout({ children, storeConfig }: BookingAgendaLayoutProps) {
  const { isBackendLoading } = useLoading();
  const { addToast } = useToast();
  const { user, isAuthenticated } = useAuth();

  // Booking Logic State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<number>(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [guestInfo, setGuestInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  // Services Data
  const rawServices = storeConfig.services || [];
  const activeServices = filterActiveServices(rawServices);
  // In preview mode fallback logic is handled in homepage, but for modal we need valid services.
  // If no services, the modal might look empty if opened without a specific service ID.
  const services = activeServices; 

  // Pre-fill form data for authenticated users
  useEffect(() => {
    if (isAuthenticated && user) {
      setGuestInfo(prev => ({
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [isAuthenticated, user]);

  // Payment Hook
  const payazaPublicKey = storeConfig.payment?.payazaPublicKey || process.env.NEXT_PUBLIC_PAYAZA_PUBLIC_KEY || '';
  
  const { checkout, isLoading: isPaymentLoading } = usePayazaCheckout({
    publicKey: payazaPublicKey,
    onSuccess: () => {
        setBookingStep(4); // Success
        addToast('Payment successful & Booking confirmed!', 'success');
    },
    onError: (error) => {
        addToast(error, 'error');
        setBookingStep(2); // Stay on payment step
    },
    onClose: () => {}
  });

  // Booking Actions
  const openBooking = (serviceId?: string) => {
    if (serviceId) setSelectedService(serviceId);
    setSelectedTime(null);
    setBookingStep(1);
    setIsBookingModalOpen(true);
  };

  const closeBooking = () => {
    setIsBookingModalOpen(false);
  };

  // Payment Handling
  const handlePaymentSubmit = async () => {
    if (!selectedService) return;
    
    const service = services.find(s => s.id === selectedService);
    // If service not found (e.g. mock data in preview), we can't proceed with real payment easily.
    // But for layout wrapper, we assume valid data.
    if (!service && services.length > 0) return;

    // Fallback for mock services if needed (simulated)
    const price = service ? service.price : 0;

    setBookingStep(3); // Loading

    // DEMO MODE BYPASS
    if (storeConfig.slug.startsWith('demo/')) {
        setTimeout(() => {
            setBookingStep(4);
            addToast('Payment successful & Booking confirmed!', 'success');
        }, 1500);
        return;
    }

    if (!payazaPublicKey) {
        addToast('Payment gateway not configured', 'error');
        setBookingStep(2);
        return;
    }

    const customerEmail = isAuthenticated && user ? user.email : guestInfo.email;
    const customerFirstName = isAuthenticated && user ? user.firstName : guestInfo.firstName;
    const customerLastName = isAuthenticated && user ? user.lastName : guestInfo.lastName;
    const customerPhone = isAuthenticated && user ? (user.phone || '') : guestInfo.phone;

    await checkout({
        amount: price,
        email: customerEmail,
        firstName: customerFirstName,
        lastName: customerLastName,
        phone: customerPhone,
        reference: `BK-${Date.now()}`,
        currency: storeConfig.settings.currency || 'USD',
    });
  };

  // Generate next 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      date: d,
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: d.getDate(),
      fullDate: d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };
  });

  // Theme Colors
  const bgPrimary = getThemeColor(storeConfig, 'background', 'primary', '#FAFAFA');
  const bgOverlay = getThemeColor(storeConfig, 'background', 'overlay', 'rgba(255,255,255,0.5)');
  const textPrimary = getThemeColor(storeConfig, 'text', 'primary', '#1E293B');
  const blob1 = getThemeColor(storeConfig, 'layoutSpecific', 'blob1', '#FECDD3');
  const blob2 = getThemeColor(storeConfig, 'layoutSpecific', 'blob2', '#DDD6FE');
  const blob3 = getThemeColor(storeConfig, 'layoutSpecific', 'blob3', '#E9D5FF');

  return (
    <BookingContext.Provider value={{ openBooking, closeBooking }}>
      <AlertModalProvider>
        <div className="min-h-screen font-sans" style={{ backgroundColor: bgPrimary, color: textPrimary }}>
          {/* Soft Gradient Background Mesh */}
          <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl animate-blob" style={{ backgroundColor: blob1 }}></div>
            <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" style={{ backgroundColor: blob2 }}></div>
            <div className="absolute -bottom-32 left-20 w-[600px] h-[600px] rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" style={{ backgroundColor: blob3 }}></div>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row max-w-[1600px] mx-auto backdrop-blur-xl min-h-screen shadow-[0_0_100px_rgba(0,0,0,0.05)]" style={{ backgroundColor: bgOverlay }}>
            <BookingAgendaSidebar storeConfig={storeConfig} onBookClick={() => openBooking()} />
            
            <main className="flex-1 min-w-0 overflow-y-auto relative">
              {isBackendLoading && <PageContentLoader />}
              <PageAnimateWrapper>
                {children}
              </PageAnimateWrapper>
            </main>
          </div>

          {/* Booking Modal */}
          <Modal isOpen={isBookingModalOpen} onClose={closeBooking} title={bookingStep === 2 ? getLayoutText(storeConfig, 'booking.completePayment', 'Complete Payment') : getLayoutText(storeConfig, 'booking.confirmBooking', 'Confirm Appointment')} className="max-w-md bg-white rounded-3xl overflow-hidden">
             {bookingStep === 1 && (
                <div className="space-y-6">
                   <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100">
                      <h4 className="font-bold text-rose-900 text-sm uppercase tracking-wide mb-3">Summary</h4>
                      <div className="space-y-2 text-sm">
                         <div className="flex justify-between">
                            <span className="text-rose-700">Date</span>
                            <span className="font-bold text-slate-900">{days[selectedDate].fullDate}</span>
                         </div>
                         <div className="flex justify-between">
                            <span className="text-rose-700">Service</span>
                            <span className="font-bold text-slate-900">{selectedService ? services.find(s => s.id === selectedService)?.name : 'Select a service'}</span>
                         </div>
                         <div className="flex justify-between pt-2 border-t border-rose-200/50">
                            <span className="text-rose-900 font-bold">Total</span>
                            <span className="font-bold text-slate-900 text-lg">{formatCurrency(selectedService ? (services.find(s => s.id === selectedService)?.price || 0) : 0, (selectedService ? services.find(s => s.id === selectedService)?.currency : null) || storeConfig.settings?.currency || 'USD')}</span>
                         </div>
                      </div>
                   </div>
                   
                   <div className="space-y-4">
                      <div>
                         <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Available Times</label>
                         <div className="grid grid-cols-3 gap-2">
                            {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'].map(time => (
                               <button 
                                 key={time} 
                                 onClick={() => setSelectedTime(time)}
                                 className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${selectedTime === time ? 'bg-rose-600 text-white border-rose-600' : 'border-gray-200 hover:border-rose-500 hover:text-rose-600 hover:bg-rose-50 focus:ring-2 focus:ring-rose-500 focus:outline-none'}`}
                               >
                                  {time}
                               </button>
                            ))}
                         </div>
                      </div>

                      <div>
                         <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Your Details</label>
                         <div className="grid grid-cols-2 gap-3 mb-3">
                            <input 
                                type="text" 
                                placeholder="First Name" 
                                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-rose-500 outline-none"
                                value={guestInfo.firstName}
                                onChange={(e) => setGuestInfo({...guestInfo, firstName: e.target.value})}
                            />
                            <input 
                                type="text" 
                                placeholder="Last Name" 
                                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-rose-500 outline-none"
                                value={guestInfo.lastName}
                                onChange={(e) => setGuestInfo({...guestInfo, lastName: e.target.value})}
                            />
                         </div>
                         <div className="grid grid-cols-2 gap-3">
                            <input 
                                type="email" 
                                placeholder="Email" 
                                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-rose-500 outline-none"
                                value={guestInfo.email}
                                onChange={(e) => setGuestInfo({...guestInfo, email: e.target.value})}
                            />
                            <input 
                                type="tel" 
                                placeholder="Phone" 
                                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:border-rose-500 outline-none"
                                value={guestInfo.phone}
                                onChange={(e) => setGuestInfo({...guestInfo, phone: e.target.value})}
                            />
                         </div>
                      </div>

                      <div>
                         <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Special Requests</label>
                         <textarea className="w-full border border-gray-200 rounded-xl p-3 text-sm h-24 resize-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 outline-none transition-all" placeholder="Any allergies or preferences?"></textarea>
                      </div>
                   </div>

                   <Button 
                      onClick={() => {
                          if (!guestInfo.email || !guestInfo.firstName || !guestInfo.lastName) {
                              addToast('Please fill in your details', 'error');
                              return;
                          }
                          if (!selectedTime) {
                              addToast('Please select a time', 'error');
                              return;
                          }
                          setBookingStep(2);
                      }} 
                      className="w-full bg-slate-900 hover:bg-slate-800 h-12 rounded-xl text-lg font-medium shadow-lg"
                   >
                      Continue to Payment
                   </Button>
                </div>
             )}

             {bookingStep === 2 && (
                <div className="space-y-6 animate-in slide-in-from-right duration-300">
                   <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-xl" />
                      <div className="relative z-10">
                         <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Amount to Pay</p>
                         <p className="text-3xl font-serif font-bold">{formatCurrency(selectedService ? (services.find(s => s.id === selectedService)?.price || 0) : 0, (selectedService ? services.find(s => s.id === selectedService)?.currency : null) || storeConfig.settings?.currency || 'USD')}</p>
                         <div className="flex items-center gap-2 mt-4 text-xs text-slate-300">
                            <Lock className="h-3 w-3" /> Secure Payaza Transaction
                         </div>
                      </div>
                   </div>

                   <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <h4 className="font-bold text-sm mb-2 text-slate-900">Billing Details</h4>
                      <div className="text-sm text-slate-600 space-y-1">
                         <p><span className="font-medium text-slate-900">Name:</span> {guestInfo.firstName} {guestInfo.lastName}</p>
                         <p><span className="font-medium text-slate-900">Email:</span> {guestInfo.email}</p>
                         <p><span className="font-medium text-slate-900">Phone:</span> {guestInfo.phone}</p>
                      </div>
                   </div>

                   <Button onClick={handlePaymentSubmit} disabled={isPaymentLoading} className="w-full bg-rose-600 hover:bg-rose-700 h-12 rounded-xl text-lg font-medium shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2">
                      {isPaymentLoading ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                            Processing...
                          </>
                      ) : (
                          <>Pay & Confirm Booking</>
                      )}
                   </Button>
                   <button type="button" onClick={() => setBookingStep(1)} className="w-full text-sm text-slate-500 font-medium hover:text-slate-800">Back to Details</button>
                </div>
             )}
             
             {bookingStep === 3 && (
                <div className="py-16 flex flex-col items-center justify-center space-y-4">
                   <div className="relative">
                      <div className="w-16 h-16 border-4 border-rose-100 border-t-rose-600 rounded-full animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <Sparkles className="h-6 w-6 text-rose-600 animate-pulse" />
                      </div>
                   </div>
                   <p className="text-slate-500 font-medium">Processing secure payment...</p>
                </div>
             )}

             {bookingStep === 4 && (
                <div className="py-10 text-center space-y-6">
                   <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-900/10 animate-in zoom-in duration-300">
                      <CheckCircle className="h-10 w-10" />
                   </div>
                   <div>
                      <h3 className="text-2xl font-serif font-bold text-slate-900">Payment Successful!</h3>
                      <p className="text-slate-500 mt-2 max-w-[250px] mx-auto leading-relaxed">Your appointment is confirmed. We&apos;ve sent a receipt to your email.</p>
                   </div>
                   <Button onClick={closeBooking} className="w-full bg-slate-900 hover:bg-black h-12 rounded-xl font-medium">Done</Button>
                </div>
             )}
          </Modal>
        </div>
      </AlertModalProvider>
    </BookingContext.Provider>
  );
}
