// ===== MAIN APP INITIALIZATION =====
class MACUTApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeComponents();
        this.setupScrollAnimations();
        this.setupMobileNavigation();
        this.setupPortfolioScroll();
        this.setupContactForm();
        this.setupSmoothScroll();
        this.setupScrollProgress();
    }

    setupEventListeners() {
        // DOM Content Loaded
        document.addEventListener('DOMContentLoaded', () => {
            this.onDOMReady();
        });

        // Window Events
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
        window.addEventListener('resize', this.throttle(this.handleResize.bind(this), 250));
        window.addEventListener('load', this.handleWindowLoad.bind(this));
    }

    // ===== UTILITY FUNCTIONS =====
    throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        return function(...args) {
            const currentTime = Date.now();
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }

    debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // ===== MOBILE NAVIGATION =====
    setupMobileNavigation() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileNav = document.querySelector('.mobile-nav');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        const body = document.body;

        if (!mobileMenuBtn || !mobileNav) return;

        // Toggle mobile menu
        mobileMenuBtn.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Close mobile menu when clicking links
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !mobileNav.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Close mobile menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileNav = document.querySelector('.mobile-nav');
        const body = document.body;

        const isOpen = mobileNav.classList.contains('active');
        
        if (isOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileNav = document.querySelector('.mobile-nav');
        const body = document.body;

        mobileMenuBtn.classList.add('active');
        mobileNav.classList.add('active');
        body.style.overflow = 'hidden';
        
        // Accessibility
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        mobileNav.setAttribute('aria-hidden', 'false');
    }

    closeMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileNav = document.querySelector('.mobile-nav');
        const body = document.body;

        mobileMenuBtn.classList.remove('active');
        mobileNav.classList.remove('active');
        body.style.overflow = '';
        
        // Accessibility
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
    }

    // ===== SMOOTH SCROLL NAVIGATION =====
    setupSmoothScroll() {
        const navLinks = document.querySelectorAll('a[href^="#"]');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    this.scrollToElement(targetElement);
                    this.updateActiveNavLink(targetId);
                }
            });
        });
    }

    scrollToElement(element) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const elementPosition = element.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }

    updateActiveNavLink(targetId) {
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
    }

    // ===== SCROLL PROGRESS & HEADER EFFECTS =====
    setupScrollProgress() {
        this.createScrollProgressBar();
    }

    createScrollProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);
    }

    handleScroll() {
        this.updateScrollProgress();
        this.updateHeaderOnScroll();
        this.updateActiveNavOnScroll();
    }

    updateScrollProgress() {
        const progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) return;

        const scrollTop = window.pageYOffset;
        const docHeight = document.body.offsetHeight;
        const winHeight = window.innerHeight;
        const scrollPercent = scrollTop / (docHeight - winHeight);
        const scrollPercentRounded = Math.round(scrollPercent * 100);

        progressBar.style.width = scrollPercentRounded + '%';
    }

    updateHeaderOnScroll() {
        const header = document.querySelector('.header');
        if (!header) return;

        const scrollTop = window.pageYOffset;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    updateActiveNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        
        let currentSection = '';
        const scrollTop = window.pageYOffset;
        const headerHeight = document.querySelector('.header').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50;
            const sectionHeight = section.offsetHeight;
            
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // ===== PORTFOLIO HORIZONTAL SCROLL =====
    setupPortfolioScroll() {
        const portfolioContainer = document.querySelector('.portfolio-scroll');
        const prevBtn = document.querySelector('#portfolio-prev');
        const nextBtn = document.querySelector('#portfolio-next');
        
        if (!portfolioContainer) return;

        this.portfolioScroll = {
            container: portfolioContainer,
            currentIndex: 0,
            itemWidth: 320, // Including gap
            maxIndex: 0
        };

        this.calculatePortfolioMaxIndex();
        this.setupPortfolioButtons();
        this.setupPortfolioTouch();
        this.updatePortfolioButtons();

        // Recalculate on window resize
        window.addEventListener('resize', this.debounce(() => {
            this.calculatePortfolioMaxIndex();
            this.updatePortfolioButtons();
        }, 250));
    }

    calculatePortfolioMaxIndex() {
        const container = this.portfolioScroll.container;
        const items = container.querySelectorAll('.portfolio-item');
        const containerWidth = container.parentElement.offsetWidth;
        
        this.portfolioScroll.maxIndex = Math.max(0, items.length - Math.floor(containerWidth / this.portfolioScroll.itemWidth));
    }

    setupPortfolioButtons() {
        const prevBtn = document.querySelector('#portfolio-prev');
        const nextBtn = document.querySelector('#portfolio-next');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.portfolioPrevious();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.portfolioNext();
            });
        }
    }

    portfolioPrevious() {
        if (this.portfolioScroll.currentIndex > 0) {
            this.portfolioScroll.currentIndex--;
            this.updatePortfolioPosition();
        }
    }

    portfolioNext() {
        if (this.portfolioScroll.currentIndex < this.portfolioScroll.maxIndex) {
            this.portfolioScroll.currentIndex++;
            this.updatePortfolioPosition();
        }
    }

    updatePortfolioPosition() {
        const container = this.portfolioScroll.container;
        const translateX = -(this.portfolioScroll.currentIndex * this.portfolioScroll.itemWidth);
        
        container.style.transform = `translateX(${translateX}px)`;
        this.updatePortfolioButtons();
    }

    updatePortfolioButtons() {
        const prevBtn = document.querySelector('#portfolio-prev');
        const nextBtn = document.querySelector('#portfolio-next');
        
        if (prevBtn) {
            prevBtn.disabled = this.portfolioScroll.currentIndex === 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.portfolioScroll.currentIndex >= this.portfolioScroll.maxIndex;
        }
    }

    setupPortfolioTouch() {
        const container = this.portfolioScroll.container;
        let touchStartX = 0;
        let touchEndX = 0;
        let isDragging = false;
        let startTranslateX = 0;
        let currentTranslateX = 0;

        container.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            isDragging = true;
            startTranslateX = currentTranslateX;
            container.style.transition = 'none';
        });

        container.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            e.preventDefault();
            const touchCurrentX = e.touches[0].clientX;
            const diffX = touchCurrentX - touchStartX;
            currentTranslateX = startTranslateX + diffX;
            
            container.style.transform = `translateX(${currentTranslateX}px)`;
        });

        container.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            isDragging = false;
            touchEndX = e.changedTouches[0].clientX;
            container.style.transition = 'transform 0.5s ease';
            
            const diffX = touchStartX - touchEndX;
            const threshold = 50;
            
            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    this.portfolioNext();
                } else {
                    this.portfolioPrevious();
                }
            } else {
                this.updatePortfolioPosition();
            }
        });
    }

    // ===== CONTACT FORM =====
    setupContactForm() {
        const form = document.querySelector('#contact-form');
        if (!form) return;

        // Form validation
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmission(form);
        });

        // Package selection buttons
        const packageButtons = document.querySelectorAll('.price-btn');
        packageButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const packageName = btn.getAttribute('data-package');
                this.handlePackageSelection(packageName);
            });
        });
    }

    handlePackageSelection(packageName) {
        const serviceSelect = document.querySelector('#service-type');
        const contactSection = document.querySelector('#contact');
        
        if (serviceSelect) {
            serviceSelect.value = 'brand-identity';
        }
        
        // Scroll to contact form
        this.scrollToElement(contactSection);
        
        // Pre-fill question with package info
        const questionField = document.querySelector('#question');
        if (questionField) {
            questionField.value = `I'm interested in the ${packageName.toUpperCase()} package. Please provide more details about pricing and timeline.`;
        }
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove existing error
        this.clearFieldError(field);

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentElement.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            field.parentElement.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    clearFieldError(field) {
        field.classList.remove('error');
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    async handleFormSubmission(form) {
        const submitBtn = form.querySelector('.form-submit');
        const originalText = submitBtn.textContent;
        
        // Validate all fields
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            this.showFormMessage('Please fix the errors above', 'error');
            return;
        }

        // Show loading state
        submitBtn.textContent = 'SENDING...';
        submitBtn.disabled = true;

        try {
            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Submit to Google Forms
            const response = await this.submitToGoogleForms(data);
            
            this.showFormMessage('Message sent successfully! We\'ll get back to you soon.', 'success');
            form.reset();
            
            // Check if detailed questionnaire was requested
            if (data['detailed-questionnaire']) {
                setTimeout(() => {
                    this.openDetailedQuestionnaire();
                }, 1000);
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showFormMessage('Something went wrong. Please try again or contact us directly at info@macut.rs', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async submitToGoogleForms(data) {
        // PLACEHOLDER: Replace with actual Google Form URL and entry IDs
        const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse';
        
        const formData = new FormData();
        // Map your form fields to Google Form entry IDs
        formData.append('entry.SERVICE_ENTRY_ID', data['service-type']);
        formData.append('entry.NAME_ENTRY_ID', data['name']);
        formData.append('entry.EMAIL_ENTRY_ID', data['email']);
        formData.append('entry.BRAND_ENTRY_ID', data['brand-name']);
        formData.append('entry.QUESTION_ENTRY_ID', data['question']);
        formData.append('entry.QUESTIONNAIRE_ENTRY_ID', data['detailed-questionnaire'] ? 'Yes' : 'No');
        
        // Simulate successful submission for demo
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ ok: true });
            }, 1000);
        });
        
        // Uncomment this for actual Google Forms integration:
        /*
        return fetch(GOOGLE_FORM_URL, {
            method: 'POST',
            body: formData,
            mode: 'no-cors'
        });
        */
    }

    showFormMessage(message, type) {
        const form = document.querySelector('#contact-form');
        let messageElement = document.querySelector('.form-message');
        
        if (!messageElement) {
            messageElement = document.createElement('div');
            messageElement.className = 'form-message';
            form.parentElement.insertBefore(messageElement, form);
        }
        
        messageElement.textContent = message;
        messageElement.className = `form-message ${type}`;
        
        // Auto-hide message after 5 seconds
        setTimeout(() => {
            if (messageElement) {
                messageElement.style.opacity = '0';
                setTimeout(() => messageElement.remove(), 300);
            }
        }, 5000);
    }

    openDetailedQuestionnaire() {
        // PLACEHOLDER: Replace with actual detailed questionnaire URL
        const questionnaireUrl = 'https://docs.google.com/forms/d/e/YOUR_DETAILED_FORM_ID/viewform';
        window.open(questionnaireUrl, '_blank');
    }

    // ===== SCROLL ANIMATIONS =====
    setupScrollAnimations() {
        const animatedElements = document.querySelectorAll('.process-step, .pricing-card, .portfolio-item, .about-content, .beyond-content');
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // ===== PAYHIP INTEGRATION =====
    setupPayHipIntegration() {
        const payHipButtons = document.querySelectorAll('[data-payhip-product]');
        
        payHipButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = button.dataset.payhipProduct;
                this.openPayHipProduct(productId);
            });
        });
    }

    openPayHipProduct(productId) {
        // PLACEHOLDER: Replace with actual PayHip product URLs
        const payHipUrl = `https://payhip.com/b/${productId}`;
        window.open(payHipUrl, '_blank');
    }

    // ===== UTILITY EVENT HANDLERS =====
    handleResize() {
        this.calculatePortfolioMaxIndex();
        this.updatePortfolioButtons();
        this.closeMobileMenu();
    }

    handleWindowLoad() {
        // Hide loading spinner if exists
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 300);
        }
        
        // Initialize any lazy-loaded content
        this.initializeLazyImages();
    }

    initializeLazyImages() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if (lazyImages.length === 0) return;
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    onDOMReady() {
        // Initialize any DOM-dependent functionality
        this.initializeComponents();
        
        // Add loading class to body
        document.body.classList.add('loaded');
        
        // Initialize accessibility features
        this.setupAccessibility();
    }

    initializeComponents() {
        // Initialize any third-party plugins or components
        this.setupPayHipIntegration();
    }

    setupAccessibility() {
        // Keyboard navigation for custom elements
        const focusableElements = document.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
        
        focusableElements.forEach(element => {
            element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    element.click();
                }
            });
        });

        // Skip to main content link
        this.createSkipLink();
    }

    createSkipLink() {
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
}

// ===== ADDITIONAL UTILITY FUNCTIONS =====

// Smooth scroll polyfill for older browsers
if (!window.CSS || !CSS.supports('scroll-behavior', 'smooth')) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/cferdinandi/smooth-scroll@15/dist/smooth-scroll.polyfills.min.js';
    document.head.appendChild(script);
}

// Initialize the app
const macutApp = new MACUTApp();

// ===== PERFORMANCE OPTIMIZATIONS =====

// Preload critical images
const criticalImages = [
    'images/logo.svg',
    'images/hero-bg.jpg'
];

criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = src;
    link.as = 'image';
    document.head.appendChild(link);
});

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// ===== GOOGLE ANALYTICS INTEGRATION (Optional) =====
// Uncomment and replace 'GA_TRACKING_ID' with your actual Google Analytics ID
/*
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'GA_TRACKING_ID');
*/

// ===== EXPORT FOR TESTING =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MACUTApp;
}

// Reviews slider logic - Continuous smooth scrolling
const slider = document.getElementById('reviews-slider');
if (slider) {
  const cards = slider.querySelectorAll('.review-card');
  let translateX = 0;
  const speed = 2; // pixels per frame
  let animationId;

  // Duplicate cards multiple times for seamless infinite scroll
  const originalCards = [...cards];
  originalCards.forEach(card => {
    const clone1 = card.cloneNode(true);
    const clone2 = card.cloneNode(true);
    slider.appendChild(clone1);
    slider.appendChild(clone2);
  });

  function continuousSlide() {
    translateX -= speed;
    
    // Get card dimensions
    const cardWidth = originalCards[0].offsetWidth + 32; // 32px gap
    const singleSetWidth = cardWidth * originalCards.length;
    
    
    slider.style.transform = `translateX(${translateX}px)`;
    animationId = requestAnimationFrame(continuousSlide);
  }

  function startAutoSlide() {
    continuousSlide();
  }
  
  function stopAutoSlide() {
    cancelAnimationFrame(animationId);
  }

  //slider.addEventListener('mouseenter', stopAutoSlide);
  //slider.addEventListener('mouseleave', startAutoSlide);
  startAutoSlide();
}