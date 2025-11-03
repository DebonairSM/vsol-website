export function initNavigation() {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');

  // Mobile menu toggle
  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNav.classList.toggle('hidden');
    });

    // Close mobile menu when clicking a link
    const mobileLinks = mobileNav.querySelectorAll('a');
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.add('hidden');
      });
    });
  }

  // Active section highlighting
  initActiveNavTracking();
}

function initActiveNavTracking() {
  const sections = ['hero', 'services', 'career', 'events', 'contacts'];
  const navLinks = document.querySelectorAll('#nav-menu a, #mobile-nav a');

  // Set up scroll observer
  const observerOptions = {
    rootMargin: '-100px 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id;
        updateActiveNav(sectionId);
      }
    });
  }, observerOptions);

  // Observe all sections
  sections.forEach((sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      observer.observe(section);
    }
  });

  // Update active nav link based on hash on load
  if (window.location.hash) {
    const sectionId = window.location.hash.substring(1);
    updateActiveNav(sectionId);
  } else {
    updateActiveNav('hero');
  }
}

function updateActiveNav(activeSectionId: string) {
  // Get all nav links (both desktop and mobile)
  const desktopLinks = document.querySelectorAll('#nav-menu a');
  const mobileLinks = document.querySelectorAll('#mobile-nav a');
  
  const allLinks = [...Array.from(desktopLinks), ...Array.from(mobileLinks)];

  allLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;

    const linkSectionId = href.substring(1); // Remove the '#'
    const isActive = linkSectionId === activeSectionId;

    // Remove all active classes
    link.classList.remove(
      'bg-accent-500',
      'text-white',
      'hover:bg-accent-600'
    );
    
    // Add back default classes if not active
    if (!isActive) {
      link.classList.add('text-primary-600', 'hover:text-primary-700');
    } else {
      // Remove default classes and add active classes
      link.classList.remove('text-primary-600', 'hover:text-primary-700');
      link.classList.add('bg-accent-500', 'text-white', 'hover:bg-accent-600');
      
      // Ensure rounded corners and padding for active state
      if (!link.classList.contains('px-6')) {
        link.classList.add('px-6', 'py-2', 'rounded');
      }
    }
  });
}

