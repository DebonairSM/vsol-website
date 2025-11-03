import './styles/main.css';
import { initNavigation } from './components/navigation';
import { loadContent } from './services/content';
import { initSmoothScroll } from './utils/smooth-scroll';
import { Carousel } from './components/carousel';

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
    await loadContent();

    // Initialize carousel after content is loaded
    setTimeout(() => {
      try {
        new Carousel('events-carousel', 5000);
      } catch (error) {
        console.error('Failed to initialize carousel:', error);
      }
    }, 100);

    console.log('VSol website initialized successfully');
  } catch (error) {
    console.error('Failed to initialize application:', error);
  }
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

