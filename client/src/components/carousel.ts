export class Carousel {
  private container: HTMLElement;
  private items: HTMLElement[];
  private currentIndex: number = 0;
  private autoplayInterval: number | null = null;

  constructor(containerId: string, autoplayDelay: number = 5000) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Carousel container with id "${containerId}" not found`);
    }
    this.container = container;
    this.items = Array.from(
      container.querySelectorAll<HTMLElement>('.carousel-item')
    );

    if (this.items.length > 0) {
      this.init();
      if (autoplayDelay > 0) {
        this.startAutoplay(autoplayDelay);
      }
    }
  }

  private init() {
    // Hide all items except the first one
    this.items.forEach((item, index) => {
      if (index === 0) {
        item.classList.add('active');
        item.classList.remove('hidden');
      } else {
        item.classList.remove('active');
        item.classList.add('hidden');
      }
    });

    // Set up navigation buttons
    this.setupControls();

    // Set up indicators
    this.setupIndicators();
  }

  private setupControls() {
    const prevBtn = this.container.querySelector('.carousel-prev');
    const nextBtn = this.container.querySelector('.carousel-next');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.prev());
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.next());
    }
  }

  private setupIndicators() {
    const indicatorsContainer =
      this.container.querySelector('.carousel-indicators');
    if (!indicatorsContainer) return;

    indicatorsContainer.innerHTML = '';

    this.items.forEach((_, index) => {
      const indicator = document.createElement('button');
      indicator.className = `w-3 h-3 rounded-full transition-all ${
        index === 0 ? 'bg-accent-500 w-8' : 'bg-gray-300'
      }`;
      indicator.setAttribute('aria-label', `Go to slide ${index + 1}`);
      indicator.addEventListener('click', () => this.goTo(index));
      indicatorsContainer.appendChild(indicator);
    });
  }

  private updateIndicators() {
    const indicators = this.container.querySelectorAll(
      '.carousel-indicators button'
    );
    indicators.forEach((indicator, index) => {
      if (index === this.currentIndex) {
        indicator.classList.add('bg-accent-500', 'w-8');
        indicator.classList.remove('bg-gray-300');
      } else {
        indicator.classList.remove('bg-accent-500', 'w-8');
        indicator.classList.add('bg-gray-300');
      }
    });
  }

  public next() {
    this.goTo((this.currentIndex + 1) % this.items.length);
  }

  public prev() {
    this.goTo(
      (this.currentIndex - 1 + this.items.length) % this.items.length
    );
  }

  public goTo(index: number) {
    if (index < 0 || index >= this.items.length) return;

    // Hide current item
    this.items[this.currentIndex].classList.remove('active');
    this.items[this.currentIndex].classList.add('hidden');

    // Show new item
    this.currentIndex = index;
    this.items[this.currentIndex].classList.add('active');
    this.items[this.currentIndex].classList.remove('hidden');

    // Update indicators
    this.updateIndicators();

    // Reset autoplay
    if (this.autoplayInterval) {
      this.stopAutoplay();
      this.startAutoplay(5000);
    }
  }

  public startAutoplay(delay: number) {
    this.autoplayInterval = window.setInterval(() => {
      this.next();
    }, delay);
  }

  public stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }

  public destroy() {
    this.stopAutoplay();
  }
}

