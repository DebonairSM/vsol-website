/**
 * Cookie Consent Banner Component
 * Displays GDPR-compliant cookie consent UI
 */

import { setConsent, hasGivenConsent } from '../utils/cookie-consent';

export class CookieBanner {
  private banner: HTMLElement | null = null;
  private settingsModal: HTMLElement | null = null;

  constructor() {
    // Only show banner if user hasn't given consent yet
    if (!hasGivenConsent()) {
      this.createBanner();
      this.showBanner();
    }
  }

  private createBanner(): void {
    // Create banner container
    this.banner = document.createElement('div');
    this.banner.id = 'cookie-consent-banner';
    this.banner.className = 'cookie-banner';
    
    this.banner.innerHTML = `
      <div class="cookie-banner-content">
        <div class="cookie-banner-text">
          <p>
            Our websites require some cookies to function properly (required). In addition, 
            other cookies may be used with your consent to analyze site usage, improve the 
            user experience and for advertising. If you prefer that we only use the required 
            cookies, please select 'Accept Only Required', closing this banner without making 
            other selections will accept all cookies.
          </p>
          <p class="cookie-banner-links">
            For more information, please review our 
            <a href="/cookie-policy.html" target="_blank">Cookies Policy</a> and 
            <a href="/privacy-policy.html" target="_blank">Privacy Statement</a>.
          </p>
        </div>
        <div class="cookie-banner-actions">
          <button id="cookie-manage-btn" class="cookie-btn cookie-btn-secondary">
            Manage Cookie Settings
          </button>
          <button id="cookie-required-btn" class="cookie-btn cookie-btn-secondary">
            Accept Only Required
          </button>
          <button id="cookie-accept-btn" class="cookie-btn cookie-btn-primary">
            Accept All
          </button>
        </div>
      </div>
    `;

    // Append to body
    document.body.appendChild(this.banner);

    // Attach event listeners
    this.attachEventListeners();
  }

  private createSettingsModal(): void {
    this.settingsModal = document.createElement('div');
    this.settingsModal.id = 'cookie-settings-modal';
    this.settingsModal.className = 'cookie-modal';
    
    this.settingsModal.innerHTML = `
      <div class="cookie-modal-backdrop"></div>
      <div class="cookie-modal-content">
        <div class="cookie-modal-header">
          <h2>Manage Cookie Settings</h2>
          <button id="cookie-modal-close" class="cookie-modal-close" aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="cookie-modal-body">
          <div class="cookie-category">
            <div class="cookie-category-header">
              <h3>Required Cookies</h3>
              <span class="cookie-category-badge cookie-category-required">Always Active</span>
            </div>
            <p>
              These cookies are necessary for the website to function and cannot be switched off. 
              They are usually only set in response to actions made by you such as setting your 
              privacy preferences, logging in, or filling in forms. This includes cookies from 
              Google Fonts used to display text properly.
            </p>
          </div>

          <div class="cookie-category">
            <div class="cookie-category-header">
              <h3>Analytics & Performance Cookies</h3>
              <label class="cookie-toggle">
                <input type="checkbox" id="analytics-toggle" checked>
                <span class="cookie-toggle-slider"></span>
              </label>
            </div>
            <p>
              These cookies allow us to count visits and traffic sources so we can measure and 
              improve the performance of our site. They help us understand which pages are the 
              most and least popular and see how visitors move around the site. All information 
              these cookies collect is aggregated and anonymous. This includes Google Analytics.
            </p>
          </div>

          <div class="cookie-category">
            <div class="cookie-category-header">
              <h3>Advertising Cookies</h3>
              <label class="cookie-toggle">
                <input type="checkbox" id="advertising-toggle" checked>
                <span class="cookie-toggle-slider"></span>
              </label>
            </div>
            <p>
              These cookies may be set through our site by our advertising partners. They may be 
              used to build a profile of your interests and show you relevant ads on other sites. 
              They work by uniquely identifying your browser and device.
            </p>
          </div>
        </div>
        
        <div class="cookie-modal-footer">
          <button id="cookie-modal-save" class="cookie-btn cookie-btn-primary">
            Save Settings
          </button>
          <button id="cookie-modal-accept-all" class="cookie-btn cookie-btn-secondary">
            Accept All
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(this.settingsModal);
    this.attachModalEventListeners();
  }

  private attachEventListeners(): void {
    const manageBtn = document.getElementById('cookie-manage-btn');
    const requiredBtn = document.getElementById('cookie-required-btn');
    const acceptBtn = document.getElementById('cookie-accept-btn');

    manageBtn?.addEventListener('click', () => this.showSettings());
    requiredBtn?.addEventListener('click', () => this.acceptRequired());
    acceptBtn?.addEventListener('click', () => this.acceptAll());
  }

  private attachModalEventListeners(): void {
    const closeBtn = document.getElementById('cookie-modal-close');
    const saveBtn = document.getElementById('cookie-modal-save');
    const acceptAllBtn = document.getElementById('cookie-modal-accept-all');
    const backdrop = this.settingsModal?.querySelector('.cookie-modal-backdrop');

    closeBtn?.addEventListener('click', () => this.hideSettings());
    backdrop?.addEventListener('click', () => this.hideSettings());
    saveBtn?.addEventListener('click', () => this.saveSettings());
    acceptAllBtn?.addEventListener('click', () => {
      this.acceptAll();
      this.hideSettings();
    });

    // Escape key to close
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && this.settingsModal?.classList.contains('show')) {
        this.hideSettings();
      }
    };
    document.addEventListener('keydown', handleEscape);
  }

  private showBanner(): void {
    setTimeout(() => {
      this.banner?.classList.add('show');
    }, 500);
  }

  private hideBanner(): void {
    this.banner?.classList.remove('show');
    setTimeout(() => {
      this.banner?.remove();
    }, 300);
  }

  private showSettings(): void {
    if (!this.settingsModal) {
      this.createSettingsModal();
    }
    this.settingsModal?.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  private hideSettings(): void {
    this.settingsModal?.classList.remove('show');
    document.body.style.overflow = '';
  }

  private acceptRequired(): void {
    setConsent('required');
    this.hideBanner();
    this.hideSettings();
  }

  private acceptAll(): void {
    setConsent('all');
    this.hideBanner();
    this.hideSettings();
    
    // Reload page to trigger analytics loading
    window.location.reload();
  }

  private saveSettings(): void {
    const analyticsToggle = document.getElementById('analytics-toggle') as HTMLInputElement;
    const advertisingToggle = document.getElementById('advertising-toggle') as HTMLInputElement;

    // If any optional cookie is enabled, save as 'all', otherwise 'required'
    if (analyticsToggle?.checked || advertisingToggle?.checked) {
      setConsent('all');
      this.hideBanner();
      this.hideSettings();
      
      // Reload page to trigger analytics loading
      window.location.reload();
    } else {
      this.acceptRequired();
    }
  }
}

/**
 * Initialize cookie banner
 */
export function initCookieBanner(): void {
  new CookieBanner();
}

