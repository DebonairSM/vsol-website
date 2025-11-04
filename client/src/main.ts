import './styles/main.css';
import { initNavigation } from './components/navigation';
import { loadContent } from './services/content';
import { initSmoothScroll } from './utils/smooth-scroll';
import { Carousel } from './components/carousel';

// Initialize booking modal
function initBookingModal() {
  const modal = document.getElementById('booking-modal');
  const closeButton = document.getElementById('close-modal');
  
  if (!modal) return;

  // Function to open modal
  const openModal = () => {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  };

  // Function to close modal
  const closeModal = () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
    document.body.style.overflow = '';
  };

  // Close button click
  closeButton?.addEventListener('click', closeModal);

  // Click outside modal to close
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Escape key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  // Open modal button - use event delegation since it's loaded dynamically
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (target.id === 'open-booking-modal' || target.closest('#open-booking-modal')) {
      e.preventDefault();
      openModal();
    }
  });
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
    await loadContent();

    // Initialize booking modal
    initBookingModal();

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

