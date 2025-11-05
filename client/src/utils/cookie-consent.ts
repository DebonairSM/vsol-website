/**
 * Cookie Consent Management System
 * Handles user consent preferences for cookies with 1-year expiration
 */

export type ConsentLevel = 'all' | 'required' | null;

interface ConsentData {
  level: ConsentLevel;
  timestamp: number;
  expires: number;
}

const STORAGE_KEY = 'cookieConsent';
const CONSENT_DURATION_MS = 365 * 24 * 60 * 60 * 1000; // 1 year

/**
 * Get the current consent data from localStorage
 */
function getConsentData(): ConsentData | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const data: ConsentData = JSON.parse(stored);
    
    // Check if consent has expired
    if (Date.now() > data.expires) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error reading consent data:', error);
    return null;
  }
}

/**
 * Save consent preference to localStorage
 */
function saveConsentData(level: ConsentLevel): void {
  const now = Date.now();
  const data: ConsentData = {
    level,
    timestamp: now,
    expires: now + CONSENT_DURATION_MS
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving consent data:', error);
  }
}

/**
 * Get the current consent level
 */
export function getConsentLevel(): ConsentLevel {
  const data = getConsentData();
  return data ? data.level : null;
}

/**
 * Check if user has given consent for all cookies
 */
export function hasConsentForAll(): boolean {
  return getConsentLevel() === 'all';
}

/**
 * Check if user has given any consent (even if only required)
 */
export function hasGivenConsent(): boolean {
  return getConsentLevel() !== null;
}

/**
 * Set user's consent preference
 */
export function setConsent(level: 'all' | 'required'): void {
  saveConsentData(level);
  
  // Dispatch custom event for other components to react
  window.dispatchEvent(new CustomEvent('consentChanged', { 
    detail: { level } 
  }));
}

/**
 * Clear consent data (useful for testing or user request)
 */
export function clearConsent(): void {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('consentChanged', { 
    detail: { level: null } 
  }));
}

/**
 * Load Google Analytics if consent is given
 */
export function loadGoogleAnalytics(measurementId: string): void {
  if (!hasConsentForAll()) {
    console.log('Google Analytics not loaded: consent not given');
    return;
  }

  // Check if already loaded
  if (window.gtag) {
    console.log('Google Analytics already loaded');
    return;
  }

  // Load Google Analytics script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    anonymize_ip: true // GDPR compliance
  });

  console.log('Google Analytics loaded with consent');
}

// Type declarations for Google Analytics
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

