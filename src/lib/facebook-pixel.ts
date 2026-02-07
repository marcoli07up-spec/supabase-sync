// Facebook Pixel Integration - ID: 1280424109613163

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    _fbq: unknown;
  }
}

const PIXEL_ID = '1280424109613163';

// Initialize Facebook Pixel
export function initFacebookPixel() {
  if (typeof window === 'undefined') return;
  
  // Check if already initialized
  if (window.fbq) return;
  
  // Create fbq function
  const fbq = function(...args: unknown[]) {
    if (fbq.callMethod) {
      fbq.callMethod.apply(fbq, args);
    } else {
      fbq.queue.push(args);
    }
  } as typeof window.fbq & { callMethod?: (...args: unknown[]) => void; queue: unknown[]; loaded: boolean; version: string; push: (...args: unknown[]) => void };
  
  if (!window._fbq) window._fbq = fbq;
  fbq.push = fbq;
  fbq.loaded = true;
  fbq.version = '2.0';
  fbq.queue = [];
  window.fbq = fbq;
  
  // Load Facebook Pixel script
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(script);
  
  // Initialize pixel
  window.fbq('init', PIXEL_ID);
  window.fbq('track', 'PageView');
}

// Track Page View
export function trackPageView() {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
}

// Track View Content (product page view)
export function trackViewContent(params: {
  content_name: string;
  content_ids: string[];
  content_type: string;
  value: number;
  currency: string;
}) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'ViewContent', params);
  }
}

// Track Add to Cart
export function trackAddToCart(params: {
  content_name: string;
  content_ids: string[];
  content_type: string;
  value: number;
  currency: string;
}) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'AddToCart', params);
  }
}

// Track Initiate Checkout
export function trackInitiateCheckout(params: {
  content_ids: string[];
  content_type: string;
  num_items: number;
  value: number;
  currency: string;
}) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'InitiateCheckout', params);
  }
}

// Track Add Payment Info
export function trackAddPaymentInfo(params: {
  content_ids: string[];
  content_type: string;
  value: number;
  currency: string;
}) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'AddPaymentInfo', params);
  }
}

// Track Purchase
export function trackPurchase(params: {
  content_name?: string;
  content_ids: string[];
  content_type: string;
  num_items: number;
  value: number;
  currency: string;
}) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Purchase', params);
  }
}

// Track Search
export function trackSearch(params: {
  search_string: string;
  content_ids?: string[];
  content_type?: string;
}) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Search', params);
  }
}

// Track Lead (contact form, newsletter, etc.)
export function trackLead(params?: {
  content_name?: string;
  content_category?: string;
  value?: number;
  currency?: string;
}) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Lead', params || {});
  }
}

// Track Complete Registration
export function trackCompleteRegistration(params?: {
  content_name?: string;
  status?: string;
  value?: number;
  currency?: string;
}) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'CompleteRegistration', params || {});
  }
}

// Track Contact (WhatsApp, phone calls, etc.)
export function trackContact() {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Contact');
  }
}

// Track Custom Event
export function trackCustomEvent(eventName: string, params?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', eventName, params || {});
  }
}
