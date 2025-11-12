import './styles/sunny.css';

// Smooth scroll navigation
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Skip if href is just "#"
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                const navHeight = document.querySelector('.nav')?.getBoundingClientRect().height || 0;
                const targetPosition = targetElement.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navigation scroll effect
    const nav = document.querySelector('.nav');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            nav?.classList.add('scrolled');
        } else {
            nav?.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Intersection Observer for reveal animations
    const revealElements = document.querySelectorAll('.intro-card, .use-case-card, .sunny-feature');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal', 'active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        element.classList.add('reveal');
        revealObserver.observe(element);
    });
    
    // Form validation and submission handling
    const tryForm = document.getElementById('tryForm');
    
    if (tryForm) {
        tryForm.addEventListener('submit', handleFormSubmit);
    }
    
    function handleFormSubmit(e: Event) {
        e.preventDefault();
        
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        
        // Basic validation
        const requiredFields = form.querySelectorAll('[required]') as NodeListOf<HTMLInputElement>;
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = 'var(--color-danger, #ef4444)';
                
                // Reset border color on input
                field.addEventListener('input', () => {
                    field.style.borderColor = '';
                }, { once: true });
            }
        });
        
        if (!isValid) {
            showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Email validation
        const emailInput = form.querySelector('input[type="email"]') as HTMLInputElement;
        if (emailInput && !isValidEmail(emailInput.value)) {
            emailInput.style.borderColor = 'var(--color-danger, #ef4444)';
            showNotification('Please enter a valid email address', 'error');
            return;
        }
        
        // Show loading state
        const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        const originalText = submitButton.textContent || '';
        submitButton.textContent = 'Saving...';
        submitButton.disabled = true;
        
        // Prepare data for API
        const leadData = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            company: (formData.get('company') as string) || '',
            description: (formData.get('description') as string) || '',
            form_type: 'sunny'
        };
        
        // Send to backend API
        fetch('/api/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(leadData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Redirect to Calendly
            const calendlyUrl = 'https://calendly.com/vsol/meeting-with-bandeira';
            window.location.href = calendlyUrl;
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Something went wrong. Please try again.', 'error');
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        });
    }
    
    function isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showNotification(message: string, type: 'info' | 'success' | 'error' = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        const bgColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#8b5cf6';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 1.5rem;
            background-color: ${bgColor};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
            font-weight: 500;
        `;
        
        // Add animation styles if not already present
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
    
    // Conversation demo animation
    const conversationDemo = document.querySelector('.conversation-demo');
    
    if (conversationDemo) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateConversation();
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.3
        });
        
        observer.observe(conversationDemo);
    }
    
    function animateConversation() {
        const chatBubbles = document.querySelectorAll('.chat-bubble');
        const transformIndicator = document.querySelector('.transformation-indicator');
        const systemPreview = document.querySelector('.system-preview');
        
        // Animate chat bubbles
        chatBubbles.forEach((bubble, index) => {
            const el = bubble as HTMLElement;
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.5s ease-out';
            
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 400);
        });
        
        // Animate transformation indicator
        if (transformIndicator) {
            const el = transformIndicator as HTMLElement;
            el.style.opacity = '0';
            el.style.transform = 'scale(0.8)';
            el.style.transition = 'all 0.5s ease-out';
            
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'scale(1)';
            }, chatBubbles.length * 400);
        }
        
        // Animate system preview
        if (systemPreview) {
            const el = systemPreview as HTMLElement;
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.5s ease-out';
            
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, (chatBubbles.length + 1) * 400);
        }
    }
    
    // Process timeline animation
    const processSteps = document.querySelectorAll('.process-step');
    
    if (processSteps.length > 0) {
        const processObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const el = entry.target as HTMLElement;
                    const index = Array.from(processSteps).indexOf(entry.target);
                    
                    setTimeout(() => {
                        el.style.opacity = '0';
                        el.style.transform = 'translateX(-20px)';
                        el.style.transition = 'all 0.6s ease-out';
                        
                        setTimeout(() => {
                            el.style.opacity = '1';
                            el.style.transform = 'translateX(0)';
                        }, 50);
                    }, index * 200);
                    
                    processObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });
        
        processSteps.forEach(step => {
            processObserver.observe(step);
        });
    }
    
    // Sunny pulse animation enhancement
    const sunnyAvatar = document.querySelector('.sunny-avatar');
    
    if (sunnyAvatar) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    sunnyAvatar.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });
        
        observer.observe(sunnyAvatar);
    }
    
    // Add active state to navigation based on scroll position
    window.addEventListener('scroll', debounce(() => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
            const sectionHeight = section.offsetHeight;
            const scrollPosition = window.pageYOffset + 200;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id') || '';
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }, 100));
});

// Handle page visibility for pausing animations
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is not visible
        document.body.style.animationPlayState = 'paused';
    } else {
        // Resume animations when page becomes visible
        document.body.style.animationPlayState = 'running';
    }
});

// Performance optimization: debounce function
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;
    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null;
            func(...args);
        };
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Log page load performance
window.addEventListener('load', () => {
    if (window.performance && window.performance.timing) {
        const perfData = window.performance.timing;
        // Wait a bit to ensure loadEventEnd is set
        setTimeout(() => {
            const loadTime = perfData.loadEventEnd - perfData.navigationStart;
            if (loadTime > 0 && loadTime < 60000) { // Valid time between 0 and 60 seconds
                console.log(`Sunny page load time: ${loadTime}ms`);
            }
        }, 0);
    }
});

