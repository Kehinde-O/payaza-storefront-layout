'use client';

import { StoreConfig } from '@/lib/store-types';
import { Search, Package, Truck, CheckCircle, Clock, MapPin, AlertCircle, Loader2, XCircle, RotateCcw } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
// Note: orderService removed - this page is shared and not editable in the editor
// Order tracking functionality not available in preview mode
import { useToast } from '@/components/ui/toast';
import { useLoading } from '@/lib/loading-context';

interface TrackOrderPageProps {
  storeConfig: StoreConfig;
}

export function TrackOrderPage({ storeConfig }: TrackOrderPageProps) {
  const primaryColor = storeConfig.branding.primaryColor;
  const searchParams = useSearchParams();
  const [orderId, setOrderId] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [orderStatus, setOrderStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();
  const { startBackendLoading, stopBackendLoading } = useLoading();

  // Ref for auto-scrolling
  const resultsRef = useRef<HTMLDivElement>(null);

  // Read orderNumber from URL params and auto-fetch if present
  useEffect(() => {
    const orderNumberFromUrl = searchParams?.get('orderNumber');
    if (orderNumberFromUrl) {
      setOrderId(orderNumberFromUrl);
      // Auto-fetch tracking details
      const fetchOrder = async () => {
        setIsSearching(true);
        setOrderStatus(null);
        setError(null);
        startBackendLoading();

        try {
          // Note: orderService removed - order tracking not available in preview mode
          setError('Order tracking is not available in preview mode. This feature requires the order service.');
          setOrderStatus(null);
        } catch (error: any) {
          handleTrackingError(error);
        } finally {
          setIsSearching(false);
          stopBackendLoading();
        }
      };
      fetchOrder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Auto-scroll to results when orderStatus is populated
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (orderStatus && resultsRef.current) {
      timer = setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [orderStatus]);

  const processOrderData = (orderData: any) => {
    // Define status progression order
    const statusOrder: Record<string, number> = {
      'pending': 0,
      'confirmed': 1,
      'processing': 2,
      'shipped': 3,
      'delivered': 4,
      'cancelled': -1,
      'refunded': -1,
      'returned': -1,
    };

    const currentStatusOrder = statusOrder[orderData.status] ?? 0;
    const isTerminalState = ['cancelled', 'refunded', 'returned'].includes(orderData.status);

    // Define all timeline stages with icons
    const timelineStages = [
      { key: 'pending', label: 'Order Placed', icon: CheckCircle, order: 0 },
      { key: 'confirmed', label: 'Confirmed', icon: Package, order: 1 },
      { key: 'processing', label: 'Processing', icon: Clock, order: 2 },
      { key: 'shipped', label: 'Shipped', icon: Truck, order: 3 },
      { key: 'delivered', label: 'Delivered', icon: CheckCircle, order: 4 },
    ];

    // Create a map of backend timeline events by status
    const timelineEventsMap: Record<string, any> = {};
    if (orderData.timeline && orderData.timeline.length > 0) {
      orderData.timeline
        .filter((event: any) => {
          const eventStatusOrder = statusOrder[event.status] ?? 0;
          if (eventStatusOrder < 0) {
            return event.status === orderData.status;
          }
          return eventStatusOrder <= currentStatusOrder;
        })
        .forEach((event: any) => {
          timelineEventsMap[event.status] = event;
        });
    }

    // Get terminal state event if order is cancelled/refunded/returned
    const terminalEvent = timelineEventsMap[orderData.status] || 
      (isTerminalState ? {
        status: orderData.status,
        message: orderData.status === 'cancelled' ? 'Order Cancelled' : 
                 orderData.status === 'refunded' ? 'Order Refunded' : 
                 'Order Returned',
        timestamp: orderData.updatedAt || orderData.createdAt
      } : null);

    // Determine the last completed normal stage for terminal states
    let lastCompletedStage = -1;
    if (isTerminalState) {
      // Find the highest order stage that has a timeline event
      const completedStages = timelineStages
        .filter(s => timelineEventsMap[s.key])
        .map(s => s.order);
      lastCompletedStage = completedStages.length > 0 ? Math.max(...completedStages) : 0;
    }

    // Build complete timeline with all 5 stages
    const timeline = timelineStages.map((stage, index) => {
      const stageOrder = stage.order;
      let isPast = false;
      let isActive = false;
      let isFuture = false;
      let isTerminated = false;
      let shouldShowTerminal = false;

      if (isTerminalState) {
        // For terminal states, determine which stage to show the terminal state at
        // Show terminal state at the next stage after the last completed one
        const terminalStageIndex = lastCompletedStage + 1;
        
        if (stageOrder <= lastCompletedStage) {
          // Past completed stages
          isPast = true;
          isActive = false;
          isFuture = false;
        } else if (stageOrder === terminalStageIndex) {
          // This is where we show the terminal state
          shouldShowTerminal = true;
          isActive = true;
          isTerminated = true;
        } else {
          // Future stages - hide them
          isFuture = true;
        }
      } else {
        // Normal flow
        isPast = stageOrder < currentStatusOrder;
        isActive = stageOrder === currentStatusOrder;
        isFuture = stageOrder > currentStatusOrder;
      }

      // Get event data from backend timeline if available
      const event = timelineEventsMap[stage.key];
      let date = '-';
      let statusLabel = stage.label;
      let icon = stage.icon;

      if (shouldShowTerminal && terminalEvent) {
        // Replace this stage with terminal state
        statusLabel = terminalEvent.message || `Order ${orderData.status}`;
        icon = orderData.status === 'cancelled' ? XCircle : 
               orderData.status === 'refunded' ? RotateCcw : 
               RotateCcw;
        if (terminalEvent.timestamp) {
          date = new Date(terminalEvent.timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        }
      } else if (event) {
        // Use backend timeline data with accurate timestamp
        statusLabel = event.message || event.statusDescription || stage.label;
        if (event.timestamp) {
          date = new Date(event.timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        }
      } else if (isPast || isActive) {
        // For past/active stages without backend data, use order timestamps
        if (stageOrder === 0) {
          // Order Placed - use createdAt
          date = new Date(orderData.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        } else if (isActive || (isPast && orderData.updatedAt)) {
          // Active or past stages - use updatedAt
          date = new Date(orderData.updatedAt || orderData.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        }
      }

      return {
        key: shouldShowTerminal ? orderData.status : stage.key,
        status: statusLabel,
        date: date,
        isPast,
        isActive,
        isFuture,
        isTerminated,
        icon: icon,
        orderStatus: orderData.status,
        shouldHide: isTerminalState && stageOrder > lastCompletedStage + 1, // Hide stages after terminal state
      };
    }).filter(stage => !stage.shouldHide); // Remove hidden stages

    setOrderStatus({
      id: orderData.orderNumber,
      trackingNumber: orderData.trackingNumber,
      status: orderData.status,
      date: new Date(orderData.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      total: `${orderData.currency || 'USD'} ${Number(orderData.total).toFixed(2)}`,
      items: orderData.items?.map((item: any) => ({
        name: item.product?.name || item.name || 'Product',
        quantity: item.quantity,
        price: `${orderData.currency || 'USD'} ${Number(item.price).toFixed(2)}`,
        image: item.product?.images?.[0] || item.image // Assuming potential image property
      })) || [],
      timeline: timeline,
      carrier: orderData.carrier,
      trackingUrl: orderData.trackingUrl,
      estimatedDeliveryDate: orderData.estimatedDeliveryDate
    });
  };

  const handleTrackingError = (error: any) => {
    console.error('Error tracking order:', error);

    // Handle specific error cases
    if (error.status === 429) {
      setError('Too many tracking requests. Please wait a few minutes and try again.');
      addToast('Too many tracking requests. Please try again later.', 'error');
    } else if (error.status === 403 || error.message?.includes('confirmed orders')) {
      setError('Order tracking is only available for confirmed orders and above. Your order may still be pending confirmation.');
      addToast('This order cannot be tracked yet. Tracking is only available for confirmed orders.', 'error');
    } else {
      const errorMessage = error.message || 'Failed to track order. Please check your order number and try again.';
      setError(errorMessage);
      addToast(errorMessage, 'error');
    }
    setOrderStatus(null);
  };

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setOrderStatus(null);
    setError(null);
    startBackendLoading();

    try {
      // Note: orderService removed - order tracking not available in preview mode
      setError('Order tracking is not available in preview mode. This feature requires the order service.');
      setOrderStatus(null);

    } catch (error: any) {
      handleTrackingError(error);
    } finally {
      setIsSearching(false);
      stopBackendLoading();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* Premium Hero Section */}
      <div className="w-full bg-white relative overflow-hidden pb-12 pt-24 sm:pt-32 px-4 shadow-sm z-10">
        {/* Background Decoration */}
        <div className="absolute inset-0 z-0 opacity-30">
          <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-gray-100 to-transparent" />
          <div className="absolute top-[-100px] right-[-100px] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-gray-50 to-gray-100 blur-3xl opacity-50" />
          <div className="absolute top-[100px] left-[-200px] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-gray-50 to-gray-200 blur-3xl opacity-40" />
        </div>

        <div className="relative z-10 container mx-auto max-w-2xl text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-gray-100 text-gray-600 text-xs font-bold tracking-widest uppercase mb-6">
            Order Status
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-gray-900 tracking-tight mb-6 leading-tight">
            Track your <span className="relative inline-block">
              package
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-yellow-300 opacity-50 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </h1>
          <p className="text-lg text-gray-500 mb-10 max-w-lg mx-auto">
            Enter your order details below to get real-time status updates, delivery estimates, and shipment progress.
          </p>

          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 p-6 sm:p-8 transition-all hover:shadow-2xl">
            <form onSubmit={handleTrackOrder} className="space-y-4 text-left">
              <div>
                <label htmlFor="orderId" className="block text-sm font-bold text-gray-700 mb-1.5 ml-1">
                  Order Number
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 group-focus-within:text-gray-800 transition-colors" />
                  </div>
                  <input
                    id="orderId"
                    type="text"
                    placeholder="ORD-..."
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-gray-100 transition-all font-medium"
                    required
                    disabled={isSearching}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5 ml-1">
                  <label htmlFor="email" className="block text-sm font-bold text-gray-700">
                    Email Address
                  </label>
                  <span className="text-xs text-gray-400 font-medium tracking-wide uppercase">Optional</span>
                </div>
                <div className="relative group">
                  <input
                    id="email"
                    type="email"
                    placeholder="hello@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full px-4 py-4 bg-gray-50 border border-transparent rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-gray-100 transition-all font-medium"
                    disabled={isSearching}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-2 ml-1">Necessary for tracking guest orders.</p>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800 font-medium">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-14 mt-4 rounded-xl text-base font-bold shadow-lg shadow-gray-200 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
                style={{ backgroundColor: primaryColor }}
                disabled={isSearching || !orderId}
              >
                {isSearching ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Locating Order...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Track Shipment
                    <Truck className="w-5 h-5 ml-1" />
                  </span>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {orderStatus && (
        <div ref={resultsRef} className="w-full max-w-4xl mx-auto px-4 pb-20 -mt-10 relative z-20">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-forwards">

            {/* Header */}
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 md:p-10 bg-gray-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold tracking-wider text-sm text-gray-400 uppercase">Order Summary</span>
                  </div>

                  <h2 className="text-3xl font-black text-white mb-2 tracking-tight">#{orderStatus.id}</h2>
                  <p className="text-gray-400 font-medium mb-8">Placed on {orderStatus.date}</p>

                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-800">
                      <span className="text-gray-400">Total Amount</span>
                      <span className="text-xl font-bold">{orderStatus.total}</span>
                    </div>
                    {orderStatus.trackingNumber && (
                      <div className="flex justify-between items-center py-3 border-b border-gray-800">
                        <span className="text-gray-400">Tracking Number</span>
                        <span className="font-mono bg-gray-800 px-2 py-1 rounded text-sm">{orderStatus.trackingNumber}</span>
                      </div>
                    )}
                    {orderStatus.carrier && (
                      <div className="flex justify-between items-center py-3 border-b border-gray-800">
                        <span className="text-gray-400">Carrier</span>
                        <span className="font-medium">{orderStatus.carrier}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-8 md:p-10 bg-white flex flex-col justify-center">
                <div className="mb-8">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-2 block">Current Status</span>
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${orderStatus.status === 'delivered' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' :
                      orderStatus.status === 'shipped' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' :
                        orderStatus.status === 'processing' || orderStatus.status === 'confirmed' ? 'bg-yellow-500 animate-pulse' :
                          orderStatus.status === 'cancelled' ? 'bg-red-500' :
                            'bg-gray-500'
                      }`} />
                    <h3 className={`text-3xl font-black capitalize ${orderStatus.status === 'delivered' ? 'text-green-600' :
                      orderStatus.status === 'cancelled' ? 'text-red-600' :
                        'text-gray-900'
                      }`}>
                      {orderStatus.status}
                    </h3>
                  </div>
                </div>

                {orderStatus.estimatedDeliveryDate && (
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-2">Estimated Delivery</p>
                    <p className="text-xl font-bold text-gray-900">
                      {new Date(orderStatus.estimatedDeliveryDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}

                {/* Hidden for now - Track on Carrier Website button */}
                {false && orderStatus.trackingUrl && (
                  <a
                    href={orderStatus.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 flex items-center justify-center w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors group"
                  >
                    Track on Carrier Website
                    <Truck className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </a>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="p-8 md:p-10 border-t border-gray-100 bg-gray-50/50">
              <h3 className="text-xl font-bold text-gray-900 mb-8">Shipment Progress</h3>

              <div className="relative pl-4 md:pl-0">
                {/* Vertical Line Mobile */}
                <div className="absolute left-[27px] top-4 bottom-4 w-[2px] bg-gray-200 md:hidden"></div>

                {/* Horizontal Line Desktop */}
                <div className="hidden md:block absolute top-[28px] left-[50px] right-[50px] h-[2px] bg-gray-200"></div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4">
                  {orderStatus.timeline.map((step: any, index: number) => {
                    const Icon = step.icon;
                    const stepIsTerminalState = ['cancelled', 'refunded', 'returned'].includes(step.key);
                    
                    // Determine styling based on stage state
                    let iconBgColor = 'bg-white';
                    let iconBorderColor = 'border-gray-200';
                    let iconTextColor = 'text-gray-300';
                    let iconScale = '';
                    let iconShadow = '';
                    let textColor = 'text-gray-400';
                    let dateColor = 'text-gray-400';

                    if (step.isTerminated && step.isActive) {
                      // Terminal state (cancelled/refunded/returned)
                      iconBgColor = 'bg-white';
                      iconBorderColor = 'border-red-500';
                      iconTextColor = 'text-red-600';
                      iconShadow = 'shadow-lg shadow-red-500/30';
                      iconScale = 'scale-110';
                      textColor = 'text-red-700';
                      dateColor = 'text-red-600';
                    } else if (step.isActive && !stepIsTerminalState) {
                      // Active stage - color based on which stage is active
                      if (step.key === 'confirmed') {
                        iconBgColor = 'bg-white';
                        iconBorderColor = 'border-yellow-500';
                        iconTextColor = 'text-yellow-600';
                        iconShadow = 'shadow-lg shadow-yellow-500/30';
                        iconScale = 'scale-110';
                        textColor = 'text-gray-900';
                        dateColor = 'text-gray-600';
                      } else if (step.key === 'processing') {
                        iconBgColor = 'bg-white';
                        iconBorderColor = 'border-blue-500';
                        iconTextColor = 'text-blue-600';
                        iconShadow = 'shadow-lg shadow-blue-500/30';
                        iconScale = 'scale-110';
                        textColor = 'text-gray-900';
                        dateColor = 'text-gray-600';
                      } else if (step.key === 'shipped') {
                        iconBgColor = 'bg-white';
                        iconBorderColor = 'border-blue-500';
                        iconTextColor = 'text-blue-600';
                        iconShadow = 'shadow-lg shadow-blue-500/30';
                        iconScale = 'scale-110';
                        textColor = 'text-gray-900';
                        dateColor = 'text-gray-600';
                      } else if (step.key === 'delivered') {
                        iconBgColor = 'bg-white';
                        iconBorderColor = 'border-green-500';
                        iconTextColor = 'text-green-600';
                        iconShadow = 'shadow-lg shadow-green-500/30';
                        iconScale = 'scale-110';
                        textColor = 'text-gray-900';
                        dateColor = 'text-gray-600';
                      } else {
                        // Pending
                        iconBgColor = 'bg-white';
                        iconBorderColor = 'border-gray-400';
                        iconTextColor = 'text-gray-600';
                        iconShadow = 'shadow-md';
                        iconScale = 'scale-105';
                        textColor = 'text-gray-900';
                        dateColor = 'text-gray-600';
                      }
                    } else if (step.isPast) {
                      // Past completed stages - greyed out but visible
                      iconBgColor = 'bg-white';
                      iconBorderColor = 'border-gray-300';
                      iconTextColor = 'text-gray-400';
                      iconShadow = '';
                      iconScale = '';
                      textColor = 'text-gray-500';
                      dateColor = 'text-gray-400';
                    } else {
                      // Future stages - greyed out
                      iconBgColor = 'bg-white';
                      iconBorderColor = 'border-gray-200';
                      iconTextColor = 'text-gray-300';
                      iconShadow = '';
                      iconScale = '';
                      textColor = 'text-gray-400';
                      dateColor = 'text-gray-300';
                    }

                    return (
                      <div key={index} className="relative z-10 flex flex-col items-center justify-start group">
                        {/* Dot/Icon */}
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 flex-shrink-0 transition-all duration-300 z-10 ${iconBgColor} ${iconBorderColor} ${iconTextColor} ${iconShadow} ${iconScale}`}>
                          <Icon className="w-6 h-6" />
                        </div>

                        {/* Content - Properly centered under icon */}
                        <div className="mt-4 text-center w-full">
                          <p className={`font-semibold text-sm md:text-base mb-1.5 leading-tight ${textColor}`}>
                            {step.status}
                          </p>
                          <p className={`text-xs font-mono tracking-wide ${dateColor}`}>
                            {step.date}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="p-8 md:p-10 border-t border-gray-100 bg-white">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Items in Shipment</h3>
              <div className="space-y-4">
                {orderStatus.items.map((item: any, index: number) => (
                  <div key={index} className="flex items-center p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all group">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-white transition-colors">
                      <Package className="w-8 h-8 opacity-50" />
                    </div>
                    <div className="ml-5 flex-1 p-2">
                      <h4 className="font-bold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                    </div>
                    <div className="font-bold text-gray-900 text-lg">
                      {item.price}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

