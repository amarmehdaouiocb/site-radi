// Google Analytics 4 Tracking Utilities
// Replace GA_MEASUREMENT_ID with your actual GA4 ID (e.g., G-XXXXXXXXXX)

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || "";

// Initialize GA4
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// Track custom events
interface EventParams {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export const trackEvent = ({ action, category, label, value }: EventParams) => {
  if (typeof window !== "undefined" && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Predefined conversion events
export const trackFormSubmit = (formType: string) => {
  trackEvent({
    action: "form_submit",
    category: "Conversion",
    label: formType,
  });
};

export const trackCtaClick = (ctaName: string, location: string) => {
  trackEvent({
    action: "cta_click",
    category: "Engagement",
    label: `${ctaName} - ${location}`,
  });
};

export const trackPhoneClick = (location: string) => {
  trackEvent({
    action: "phone_click",
    category: "Conversion",
    label: location,
  });
};

export const trackServiceView = (serviceName: string) => {
  trackEvent({
    action: "service_view",
    category: "Navigation",
    label: serviceName,
  });
};

export const trackPortfolioFilter = (category: string) => {
  trackEvent({
    action: "portfolio_filter",
    category: "Engagement",
    label: category,
  });
};

// TypeScript declaration for gtag
declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "js",
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}
