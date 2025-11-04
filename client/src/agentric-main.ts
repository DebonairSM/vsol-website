import './styles/agentric.css';
import { initNavigation } from './components/navigation';
import { initSmoothScroll } from './utils/smooth-scroll';

// Load agentric page content
async function loadAgenticContent() {
  try {
    const response = await fetch('/data/agentric-content.json');
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

    // Populate featured product section
    if (data.featuredProduct) {
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
            const logoMap: Record<string, { src: string, alt: string }> = {
              'openai': { src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/openai/openai-original.svg', alt: 'ChatGPT/OpenAI' },
              'anthropic': { src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTYgMkwxMC41IDI4TDIxLjUgMjhMMTYgMloiIGZpbGw9IiNDQzc4NTYiLz48L3N2Zz4=', alt: 'Claude/Anthropic' },
              'grok': { src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNCIgc3Ryb2tlPSIjMUQ5QkYwIiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBkPSJNMTIgMTJMMjAgMjBNMjAgMTJMMTIgMjAiIHN0cm9rZT0iIzFEOUJGMCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=', alt: 'Grok/xAI' }
            };
            const logoInfo = logoMap[logo];
            return logoInfo ? `<img src="${logoInfo.src}" alt="${logoInfo.alt}" class="service-logo" title="${logoInfo.alt}">` : '';
          }).join('');
          logosHtml = `<div class="service-logos">${logoImages}</div>`;
        } else if (service.icons && service.icons.length > 0) {
          const iconHtml = service.icons.map((icon: string) => `<span class="service-icon">${icon}</span>`).join('');
          logosHtml = `<div class="service-logos">${iconHtml}</div>`;
        }
        
        const cardContent = `
          ${logosHtml}
          <h3 class="text-xl font-bold mb-3" style="color: #8b5cf6;">${service.title}</h3>
          <p class="text-gray-700 text-sm leading-relaxed">${service.description}</p>
        `;
        
        if (service.link) {
          return `
            <a href="${service.link}" class="card-agentric card-agentric-link" onclick="window.location.href='${service.link}'; return false;">
              ${cardContent}
              <div class="mt-4 text-cyan-600 font-medium text-sm">Learn More →</div>
            </a>
          `;
        } else {
          return `<div class="card-agentric">${cardContent}</div>`;
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
    
    if (ctaTitle) ctaTitle.textContent = data.cta.title;
    if (ctaDescription) ctaDescription.textContent = data.cta.description;
    if (ctaButton) {
      ctaButton.textContent = data.cta.buttonText;
      ctaButton.setAttribute('href', `mailto:${data.cta.email}`);
    }

    console.log('Agentric content loaded successfully');
  } catch (error) {
    console.error('Failed to load agentric content:', error);
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

    // Initialize navigation
    initNavigation();

    // Initialize smooth scrolling
    initSmoothScroll();

    // Load content
    await loadAgenticContent();

    console.log('Agentric page initialized successfully');
  } catch (error) {
    console.error('Failed to initialize agentric page:', error);
  }
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

