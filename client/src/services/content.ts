import contentData from '../data/content.json';

export interface ContentData {
  hero: {
    title: string;
    subtitle: string;
    description: string;
  };
  services: {
    title: string;
    subtitle: string;
    mainDescription: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };
  careers: {
    title: string;
    subtitle: string;
    positions: Array<{
      title: string;
      description: string;
      email: string;
      needed: string[];
      desirable: string[];
      bigPlus: string;
    }>;
  };
  events: {
    title: string;
    subtitle: string;
    items: Array<{
      title: string;
      description: string;
      image: string;
    }>;
  };
  contact: {
    title: string;
    subtitle: string;
    location: string;
    address: string;
    additionalLocation?: string;
    mapUrl: string;
    email: string;
    phone: string;
    calendlyUrl?: string;
  };
}

export async function loadContent() {
  const content = contentData as ContentData;

  // Load hero content
  loadHero(content.hero);

  // Load services content
  loadServices(content.services);

  // Load careers content
  loadCareers(content.careers);

  // Load events content
  loadEvents(content.events);

  // Load contact content
  loadContact(content.contact);
}

function loadHero(hero: ContentData['hero']) {
  const descElement = document.getElementById('hero-description');
  if (descElement) {
    descElement.textContent = hero.description;
  }
}

function loadServices(services: ContentData['services']) {
  const section = document.getElementById('services');
  if (!section) return;

  const html = `
    <div class="max-w-6xl mx-auto">
      <!-- Services Header with Logo -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div class="flex">
          <div class="w-2 bg-accent-500 mr-6 flex-shrink-0"></div>
          <div>
            <h2 class="text-4xl md:text-5xl font-bold text-black mb-4 uppercase">${services.title}</h2>
            <p class="text-lg text-black leading-relaxed">${services.mainDescription}</p>
          </div>
        </div>
        <div class="flex justify-center md:justify-end">
          <div class="tech-cloud flex flex-wrap gap-4 max-w-md justify-center items-center p-4">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg" alt=".NET" class="w-12 h-12 hover:scale-110 transition-transform" title=".NET">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" class="w-12 h-12 hover:scale-110 transition-transform" title="Node.js">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" alt="TypeScript" class="w-12 h-12 hover:scale-110 transition-transform" title="TypeScript">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg" alt="SQLite" class="w-12 h-12 hover:scale-110 transition-transform" title="SQLite">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" class="w-12 h-12 hover:scale-110 transition-transform" title="PostgreSQL">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg" alt="Azure" class="w-12 h-12 hover:scale-110 transition-transform" title="Microsoft Azure">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" class="w-10 h-10 hover:scale-110 transition-transform" title="React">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" alt="Docker" class="w-10 h-10 hover:scale-110 transition-transform" title="Docker">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" alt="Redis" class="w-10 h-10 hover:scale-110 transition-transform" title="Redis">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" alt="Git" class="w-10 h-10 hover:scale-110 transition-transform" title="Git">
            <div class="flex items-center gap-1 bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 rounded-full hover:scale-110 transition-transform" title="AI & LLMs">
              <span class="text-2xl">🦙</span>
              <span class="text-white font-semibold text-sm">AI</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        ${services.items
          .map(
            (item) => `
          <div class="card">
            <h3 class="text-2xl font-bold mb-4 text-primary-600">${item.title}</h3>
            <p class="text-gray-700">${item.description}</p>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `;

  section.innerHTML = html;
}

function loadCareers(careers: ContentData['careers']) {
  const section = document.getElementById('career');
  if (!section) return;

  const html = `
    <div class="max-w-6xl mx-auto">
      <div class="flex mb-12">
        <div class="w-2 bg-accent-500 mr-6 flex-shrink-0"></div>
        <div>
          <h2 class="text-4xl md:text-5xl font-bold text-black mb-4 uppercase">${careers.title}</h2>
          <p class="text-xl text-gray-700">${careers.subtitle}</p>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        ${careers.positions
          .map(
            (position) => `
          <div class="card">
            <h3 class="text-2xl font-bold mb-4 text-primary-600">${position.title}</h3>
            <p class="text-gray-700 mb-4">${position.description}</p>
            <p class="text-sm text-gray-600 mb-4">
              If you are interested, send your resume to 
              <a href="mailto:${position.email}" class="text-primary-600 hover:underline">${position.email}</a>
            </p>
            
            <h4 class="font-bold text-lg mt-6 mb-2">Needed Skills</h4>
            <ul class="list-disc list-inside text-gray-700 mb-4">
              ${position.needed.map((skill) => `<li>${skill}</li>`).join('')}
            </ul>
            
            <h4 class="font-bold text-lg mb-2">Desirable</h4>
            <ul class="list-disc list-inside text-gray-700 mb-4">
              ${position.desirable.map((skill) => `<li>${skill}</li>`).join('')}
            </ul>
            
            <h4 class="font-bold text-lg mb-2">Big Plus</h4>
            <p class="text-gray-700">${position.bigPlus}</p>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `;

  section.innerHTML = html;
}

function loadEvents(events: ContentData['events']) {
  const section = document.getElementById('events');
  if (!section) return;

  const html = `
    <div class="max-w-6xl mx-auto">
      <div class="flex mb-12">
        <div class="w-2 bg-accent-500 mr-6 flex-shrink-0"></div>
        <div>
          <h2 class="text-4xl md:text-5xl font-bold text-black mb-4 uppercase">${events.title}</h2>
          <p class="text-xl text-gray-700">${events.subtitle}</p>
        </div>
      </div>
      
      <!-- Carousel -->
      <div id="events-carousel" class="relative">
        <div class="overflow-hidden">
          ${events.items
            .map(
              (event, index) => `
            <div class="carousel-item ${index === 0 ? 'active' : 'hidden'} transition-opacity duration-500">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <img src="${event.image}" alt="${event.title}" class="w-full h-96 object-cover rounded-lg shadow-lg">
                </div>
                <div class="p-8">
                  <h3 class="text-3xl font-bold mb-4 text-primary-600">${event.title}</h3>
                  <p class="text-gray-700 text-lg">${event.description}</p>
                </div>
              </div>
            </div>
          `
            )
            .join('')}
        </div>
        
        <!-- Navigation Buttons -->
        <button class="carousel-prev absolute left-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all">
          <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>
        <button class="carousel-next absolute right-0 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all">
          <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </button>
        
        <!-- Indicators -->
        <div class="carousel-indicators flex justify-center gap-2 mt-8"></div>
      </div>
    </div>
  `;

  section.innerHTML = html;
}

function loadContact(contact: ContentData['contact']) {
  const section = document.getElementById('contacts');
  if (!section) return;

  const html = `
    <div class="max-w-6xl mx-auto">
      <div class="flex mb-12">
        <div class="w-2 bg-accent-500 mr-6 flex-shrink-0"></div>
        <div>
          <h2 class="text-4xl md:text-5xl font-bold text-white mb-4 uppercase">${contact.title}</h2>
          <p class="text-xl text-gray-200">${contact.subtitle}</p>
        </div>
      </div>
      
      <div class="contact-content-wrapper">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 class="text-2xl font-bold mb-4">Location</h3>
            <p class="mb-4">${contact.location}</p>
            <div class="mb-4">
              <p class="font-semibold mb-2">Headquarters:</p>
              <a href="https://goo.gl/maps/3ei5xN3knPN2" target="_blank" class="text-accent-500 hover:underline">
                ${contact.address}
              </a>
            </div>
            ${contact.additionalLocation ? `
            <div class="mb-4">
              <p class="font-semibold mb-2">Additional Presence:</p>
              <p class="text-gray-200">${contact.additionalLocation}</p>
            </div>
            ` : ''}
            <div class="mt-6">
              <iframe 
                src="${contact.mapUrl}" 
                width="100%" 
                height="300" 
                frameborder="0" 
                style="border:0" 
                allowfullscreen
                class="rounded-lg"
              ></iframe>
            </div>
          </div>
          
          <div>
            <h3 class="text-2xl font-bold mb-4">Contact</h3>
            <p class="mb-2">
              Email: <a href="mailto:${contact.email}" class="text-accent-500 hover:underline">${contact.email}</a>
            </p>
            <p class="mb-6">
              Phone: ${contact.phone}
            </p>
            
            ${contact.calendlyUrl ? `
            <button id="open-booking-modal" class="inline-flex items-center gap-2 bg-accent-500 text-white px-6 py-3 rounded-lg hover:bg-accent-600 transition-colors mb-4 font-semibold cursor-pointer">
              <span class="material-icons">calendar_month</span>
              Book a Meeting with Rommel
            </button>
            <br>
            ` : ''}
            
            <a href="https://www.linkedin.com/company/vsol/" target="_blank" class="btn-primary">
              Find us on LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  section.innerHTML = html;
}

