import './styles/agentic.css';
import { initNavigation } from './components/navigation';
import { initSmoothScroll } from './utils/smooth-scroll';
import { initCookieBanner } from './components/cookie-banner';
import { loadGoogleAnalytics } from './utils/cookie-consent';

// Load agentic page content
async function loadAgenticContent() {
  try {
    const response = await fetch('/data/agentic-content.json');
    const data = await response.json();

    // Populate hero section
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    const heroDescription = document.getElementById('hero-description');
    
    if (heroTitle) heroTitle.textContent = data.hero.title;
    if (heroSubtitle) heroSubtitle.textContent = data.hero.subtitle;
    if (heroDescription) heroDescription.textContent = data.hero.description;

    // Populate introduction section
    const introTitle = document.getElementById('intro-title');
    const introContent = document.getElementById('intro-content');
    
    if (introTitle) introTitle.textContent = data.introduction.title;
    if (introContent) {
      introContent.innerHTML = `<p>${data.introduction.content}</p>`;
    }

    // Populate featured products section
    if (data.featuredProducts) {
      const featuredProductsContainer = document.getElementById('featured-products-container');
      
      if (featuredProductsContainer) {
        featuredProductsContainer.innerHTML = data.featuredProducts.map((product: any) => {
          const cardClass = product.highlight ? 'featured-hero-card' : 'featured-product-card';
          const featuresHtml = product.features.map((feature: string) => `
            <div class="feature-item">
              <span class="text-lg">${feature}</span>
            </div>
          `).join('');
          
          return `
            <div class="${cardClass}">
              <div class="featured-badge">${product.badge}</div>
              <div class="text-center mb-8">
                <h2 class="featured-product-title">${product.title}</h2>
                <div class="accent-bar mx-auto"></div>
              </div>
              <div class="featured-product-content">
                <div class="featured-description">
                  <p class="text-xl text-gray-700 leading-relaxed mb-6">${product.description}</p>
                  <div class="feature-list">${featuresHtml}</div>
                </div>
                <div class="featured-cta">
                  <a href="${product.link}" class="btn-featured-primary">${product.buttonText} →</a>
                </div>
              </div>
            </div>
          `;
        }).join('');
      }
    } else if (data.featuredProduct) {
      // Fallback for old single product format
      const featuredBadge = document.getElementById('featured-badge');
      const featuredTitle = document.getElementById('featured-title');
      const featuredDescription = document.getElementById('featured-description');
      const featuredFeatures = document.getElementById('featured-features');
      const featuredButton = document.getElementById('featured-button');

      if (featuredBadge) featuredBadge.textContent = data.featuredProduct.badge;
      if (featuredTitle) featuredTitle.textContent = data.featuredProduct.title;
      if (featuredDescription) featuredDescription.textContent = data.featuredProduct.description;
      
      if (featuredFeatures && data.featuredProduct.features) {
        featuredFeatures.innerHTML = data.featuredProduct.features.map((feature: string) => `
          <div class="feature-item">
            <span class="text-lg">${feature}</span>
          </div>
        `).join('');
      }

      if (featuredButton) {
        featuredButton.textContent = data.featuredProduct.buttonText || 'Learn More';
        featuredButton.setAttribute('href', data.featuredProduct.link);
      }
    }

    // Populate benefits section
    const benefitsGrid = document.getElementById('benefits-grid');
    if (benefitsGrid && data.benefits) {
      benefitsGrid.innerHTML = data.benefits.map((benefit: any) => `
        <div class="benefit-card">
          <h3 class="text-2xl font-bold mb-4" style="color: #0369a1;">${benefit.title}</h3>
          <p class="text-gray-700 leading-relaxed">${benefit.description}</p>
        </div>
      `).join('');
    }

    // Populate services section
    const servicesTitle = document.getElementById('services-title');
    const servicesGrid = document.getElementById('services-grid');
    
    if (servicesTitle) servicesTitle.textContent = data.services.title;
    if (servicesGrid && data.services.items) {
      servicesGrid.innerHTML = data.services.items.map((service: any) => {
        // Build logos/icons section if they exist
        let logosHtml = '';
        if (service.logos && service.logos.length > 0) {
          const logoImages = service.logos.map((logo: string) => {
            const logoMap: Record<string, { src: string, alt: string, style?: string }> = {
              'openai': { 
                // OpenAI logo - using high-quality SVG with proper branding colors
                src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIHJ4PSIxNiIgZmlsbD0iIzEwYTM3ZiIvPjxwYXRoIGQ9Ik00Ni4yIDIyLjVDNTEuMiAyMi41IDU1LjMgMjYuMyA1Ni4zIDMxLjJDNjIuMiAzMiA2Ni43IDM3LjEgNjYuNyA0My4yQzY2LjcgNDguMyA2My41IDUyLjcgNTkgNTQuNUM1OSA2MC44IDUzLjkgNjUuOSA0Ny42IDY1LjlDNDQuMyA2NS45IDQxLjIgNjQuNiAzOC45IDYyLjNDMzQuOCA2NS42IDI5LjIgNjcuMiAyMy4zIDY1LjdDMTYuMyA2My43IDExIDU3LjkgOS40IDUwLjhDMTAgNDQuNyAxMy42IDM5LjMgMTguOCAzNi41QzE3LjYgMzEgMTkuNyAyNS41IDIzLjkgMjEuNEMyNy45IDE3LjMgMzMuNiAxNS4yIDM5LjQgMTUuNUM0MS45IDE1LjUgNDQuOCAxNi4yIDQ2LjIgMjIuNVoiIGZpbGw9IiMwMDAwMDAiLz48cGF0aCBkPSJNMzEgNDRDMzEgMzcuNCAzNi40IDMyIDQzIDMyQzQ5LjYgMzIgNTUgMzcuNCA1NSA0NEM1NSA1MC42IDQ5LjYgNTYgNDMgNTZDMzYuNCA1NiAzMSA1MC42IDMxIDQ0WiIgZmlsbD0iI2ZmZmZmZiIvPjwvc3ZnPg==', 
                alt: 'ChatGPT/OpenAI'
              },
              'anthropic': { 
                // Anthropic Claude logo - distinctive A in warm tan/coral
                src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIHJ4PSIxNiIgZmlsbD0iI0NBOTU3RSIvPjxwYXRoIGQ9Ik0yNSA2OEwzNSAxMkw0NSA2OEgyNVoiIGZpbGw9IiNGRkZGRkYiLz48cGF0aCBkPSJNMzUgMTVMNDUgNjhIMzVWMTVaIiBmaWxsPSIjRkZGRkZGIiBmaWxsLW9wYWNpdHk9IjAuNjUiLz48cGF0aCBkPSJNMzUgNjhMNDUgMTJMNTUgNjhINDVaIiBmaWxsPSIjRkZGRkZGIi8+PHBhdGggZD0iTTQ1IDE1TDU1IDY4SDQ1VjE1WiIgZmlsbD0iI0ZGRkZGRiIgZmlsbC1vcGFjaXR5PSIwLjY1Ii8+PC9zdmc+', 
                alt: 'Claude/Anthropic'
              },
              'grok': { 
                // xAI Grok logo - X design with sharp angles
                src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iODAiIHJ4PSIxNiIgZmlsbD0iIzAwMDAwMCIvPjxwYXRoIGQ9Ik0xOCAyMkgzMEw0MCA0MEwyNSA1OEgxM0wyOCA0MEwxOCAyMloiIGZpbGw9IiNGRkZGRkYiLz48cGF0aCBkPSJNNTAgMjJINjJMNTIgNDBMNjcgNThINTVMNDAgNDBMNTAgMjJaIiBmaWxsPSIjRkZGRkZGIi8+PC9zdmc+', 
                alt: 'Grok/xAI'
              }
            };
            const logoInfo = logoMap[logo];
            if (!logoInfo) return '';
            const styleAttr = logoInfo.style ? ` style="${logoInfo.style}"` : '';
            return `<img src="${logoInfo.src}" alt="${logoInfo.alt}" class="service-logo" title="${logoInfo.alt}"${styleAttr}>`;
          }).join('');
          logosHtml = `<div class="service-logos">${logoImages}</div>`;
        } else if (service.icons && service.icons.length > 0) {
          const iconHtml = service.icons.map((icon: string) => {
            // Check if it's a Material Icon name (no emoji characters)
            if (icon.match(/^[a-z_]+$/)) {
              return `<span class="material-icons service-material-icon">${icon}</span>`;
            }
            // Otherwise treat as emoji
            return `<span class="service-icon">${icon}</span>`;
          }).join('');
          logosHtml = `<div class="service-logos">${iconHtml}</div>`;
        }
        
        const cardContent = `
          ${logosHtml}
          <h3 class="text-xl font-bold mb-3" style="color: #8b5cf6;">${service.title}</h3>
          <p class="text-gray-700 text-sm leading-relaxed">${service.description}</p>
        `;
        
        if (service.link) {
          return `
            <a href="${service.link}" class="card-agentic card-agentic-link" onclick="window.location.href='${service.link}'; return false;">
              ${cardContent}
              <div class="mt-4 text-cyan-600 font-medium text-sm">Learn More →</div>
            </a>
          `;
        } else {
          return `<div class="card-agentic">${cardContent}</div>`;
        }
      }).join('');
    }

    // Populate Agent Master profile section
    const profileName = document.getElementById('profile-name');
    const profileTitle = document.getElementById('profile-title');
    const profileBio = document.getElementById('profile-bio');
    const profileQuote = document.getElementById('profile-quote');
    const expertiseTags = document.getElementById('expertise-tags');
    
    if (profileName) {
      profileName.textContent = data.agentMaster.name;
      profileName.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)';
      profileName.style.backgroundClip = 'text';
      profileName.style.webkitBackgroundClip = 'text';
      profileName.style.webkitTextFillColor = 'transparent';
    }
    if (profileTitle) {
      profileTitle.textContent = data.agentMaster.title;
      profileTitle.style.color = '#06b6d4';
    }
    if (profileBio) profileBio.innerHTML = `<p>${data.agentMaster.bio}</p>`;
    if (profileQuote) profileQuote.innerHTML = `<p>"${data.agentMaster.quote}"</p>`;
    
    if (expertiseTags && data.agentMaster.expertise) {
      expertiseTags.innerHTML = data.agentMaster.expertise.map((skill: string) => `
        <span class="expertise-tag">${skill}</span>
      `).join('');
    }

    // Populate CTA section
    const ctaTitle = document.getElementById('cta-title');
    const ctaDescription = document.getElementById('cta-description');
    const ctaButton = document.getElementById('cta-button');
    const ctaCalendlyButton = document.getElementById('cta-calendly-button');
    
    if (ctaTitle) ctaTitle.textContent = data.cta.title;
    if (ctaDescription) ctaDescription.textContent = data.cta.description;
    if (ctaButton) {
      ctaButton.textContent = data.cta.buttonText;
      ctaButton.setAttribute('href', `mailto:${data.cta.email}`);
    }
    if (ctaCalendlyButton && data.cta.calendlyUrl) {
      if (data.cta.calendlyText) {
        ctaCalendlyButton.textContent = `📅 ${data.cta.calendlyText}`;
      }
      ctaCalendlyButton.setAttribute('href', data.cta.calendlyUrl);
    }

    console.log('Agentic content loaded successfully');
  } catch (error) {
    console.error('Failed to load agentic content:', error);
  }
}

// Initialize the application
async function init() {
  try {
    // Set current year in footer
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
      yearElement.textContent = new Date().getFullYear().toString();
    }

    // Initialize cookie consent banner
    initCookieBanner();

    // Load Google Analytics if consent is given
    // Replace 'G-XXXXXXXXXX' with your actual Google Analytics measurement ID
    loadGoogleAnalytics('G-XXXXXXXXXX');

    // Initialize navigation
    initNavigation();

    // Initialize smooth scrolling
    initSmoothScroll();

    // Load content
    await loadAgenticContent();

    console.log('Agentic page initialized successfully');
  } catch (error) {
    console.error('Failed to initialize agentic page:', error);
  }
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

