import './styles/agentric.css';
import { initNavigation } from './components/navigation';
import { initSmoothScroll } from './utils/smooth-scroll';

// Load agentric page content
async function loadAgenticContent() {
  try {
    const response = await fetch('/src/data/agentric-content.json');
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

    // Populate benefits section
    const benefitsGrid = document.getElementById('benefits-grid');
    if (benefitsGrid && data.benefits) {
      benefitsGrid.innerHTML = data.benefits.map((benefit: any) => `
        <div class="benefit-card">
          <h3 class="text-2xl font-bold mb-4 text-accent-400">${benefit.title}</h3>
          <p class="text-gray-300 leading-relaxed">${benefit.description}</p>
        </div>
      `).join('');
    }

    // Populate services section
    const servicesTitle = document.getElementById('services-title');
    const servicesGrid = document.getElementById('services-grid');
    
    if (servicesTitle) servicesTitle.textContent = data.services.title;
    if (servicesGrid && data.services.items) {
      servicesGrid.innerHTML = data.services.items.map((service: any) => `
        <div class="card-agentric">
          <h3 class="text-xl font-bold mb-3 text-accent-400">${service.title}</h3>
          <p class="text-gray-300 text-sm leading-relaxed">${service.description}</p>
        </div>
      `).join('');
    }

    // Populate Agent Master profile section
    const profileName = document.getElementById('profile-name');
    const profileTitle = document.getElementById('profile-title');
    const profileBio = document.getElementById('profile-bio');
    const profileQuote = document.getElementById('profile-quote');
    const expertiseTags = document.getElementById('expertise-tags');
    
    if (profileName) profileName.textContent = data.agentMaster.name;
    if (profileTitle) profileTitle.textContent = data.agentMaster.title;
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

