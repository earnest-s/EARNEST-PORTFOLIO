// In-memory storage for application state
const AppState = {
  theme: 'light',
  currentSection: 'home',
  formSubmissionAttempts: 0,
  isLoading: true
};

// Theme Management (using in-memory storage)
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Initialize theme from system preference
function initializeTheme() {
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (prefersDark) {
    AppState.theme = 'dark';
    body.setAttribute('data-theme', 'dark');
    if (themeToggle) {
      themeToggle.querySelector('i').className = 'fas fa-sun';
    }
  } else {
    AppState.theme = 'light';
    body.removeAttribute('data-theme');
    if (themeToggle) {
      themeToggle.querySelector('i').className = 'fas fa-moon';
    }
  }
}

// Toggle theme
function toggleTheme() {
  const isDark = body.getAttribute('data-theme') === 'dark';
  if (isDark) {
    AppState.theme = 'light';
    body.removeAttribute('data-theme');
    if (themeToggle) {
      themeToggle.querySelector('i').className = 'fas fa-moon';
    }
  } else {
    AppState.theme = 'dark';
    body.setAttribute('data-theme', 'dark');
    if (themeToggle) {
      themeToggle.querySelector('i').className = 'fas fa-sun';
    }
  }
}

// Listen for system theme changes
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (e.matches) {
      AppState.theme = 'dark';
      body.setAttribute('data-theme', 'dark');
      if (themeToggle) {
        themeToggle.querySelector('i').className = 'fas fa-sun';
      }
    } else {
      AppState.theme = 'light';
      body.removeAttribute('data-theme');
      if (themeToggle) {
        themeToggle.querySelector('i').className = 'fas fa-moon';
      }
    }
  });
}

// Typing Animation
const typingText = document.getElementById('typing-text');
const phrases = ['Data Analyst', 'IoT Developer', 'AI Enthusiast', 'Problem Solver'];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingTimeout;

function typeEffect() {
  if (!typingText) return;
  
  const currentPhrase = phrases[phraseIndex];
  
  if (isDeleting) {
    typingText.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingText.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  let typeSpeed = isDeleting ? 50 : 100;

  if (!isDeleting && charIndex === currentPhrase.length) {
    typeSpeed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typeSpeed = 500;
  }

  typingTimeout = setTimeout(typeEffect, typeSpeed);
}

function stopTyping() {
  if (typingTimeout) {
    clearTimeout(typingTimeout);
  }
}

// Navigation Management
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

function showSection(targetId) {
  if (!targetId) return;
  
  AppState.currentSection = targetId;
  
  // Update navigation
  navLinks.forEach(link => link.classList.remove('active'));
  const activeLink = document.querySelector(`[href="#${targetId}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
  }
  
  // Scroll to section
  const targetSection = document.getElementById(targetId);
  if (targetSection) {
    targetSection.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
}

function handleNavClick(e) {
  e.preventDefault();
  const targetId = e.currentTarget.getAttribute('href')?.substring(1);
  if (targetId) {
    showSection(targetId);
  }
}

// Handle page exit for external links
function handlePageExit(href) {
  // Check if GSAP is available before using it
  if (typeof gsap !== 'undefined') {
    // Animate body fade out before leaving
    gsap.to("body", {
      duration: 0.6,
      opacity: 0,
      ease: "power2.inOut",
      onComplete: () => {
        window.location.href = href;
      }
    });
  } else {
    // Fallback without animation
    window.location.href = href;
  }
}

// Intersection Observer for active navigation
function updateActiveNav(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
      const id = entry.target.id;
      if (id && AppState.currentSection !== id) {
        AppState.currentSection = id;
        navLinks.forEach(link => {
          const isActive = link.getAttribute('href') === `#${id}`;
          link.classList.toggle('active', isActive);
        });
      }
    }
  });
}

// Loader Management
const loader = document.getElementById('loader');

function hideLoader() {
  if (!loader) return;
  
  AppState.isLoading = false;
  
  // Check if GSAP is available
  if (typeof gsap !== 'undefined') {
    gsap.to(loader, {
      duration: 0.8,
      opacity: 0,
      ease: "power2.out",
      onComplete: () => {
        if (loader && loader.parentNode) {
          loader.style.display = 'none';
        }
      }
    });
  } else {
    // Fallback without GSAP
    loader.classList.add('hidden');
    setTimeout(() => {
      if (loader && loader.parentNode) {
        loader.style.display = 'none';
      }
    }, 500);
  }
}

function showLoader() {
  if (!loader) return;
  
  AppState.isLoading = true;
  loader.style.display = 'flex';
  loader.classList.remove('hidden');
}

// Section Animation Observer
function animateSectionEntry(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const content = entry.target.querySelector('.section-content');
      if (content) {
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';
      }
    }
  });
}

// Form Handling with Enhanced Security and Debugging
function handleFormSubmission(e) {
  e.preventDefault();
  console.log('Form submission triggered');
  
  const form = e.target;
  const formData = new FormData(form);
  const button = form.querySelector('button[type="submit"]');
  const originalText = button.innerHTML;
  
  // Log form data for debugging
  console.log('Form data entries:');
  for (const [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }
  
  // Rate limiting
  AppState.formSubmissionAttempts++;
  console.log(`Form submission attempt: ${AppState.formSubmissionAttempts}`);
  
  if (AppState.formSubmissionAttempts > 5) {
    console.log('Rate limit exceeded');
    showFormMessage('Too many attempts. Please wait before trying again.', 'error');
    return;
  }
  
  // Validate form data
  const name = formData.get('name')?.trim();
  const email = formData.get('email')?.trim();
  const message = formData.get('message')?.trim();
  
  console.log('Validation check:', { name, email, message });
  
  if (!name || !email || !message) {
    console.log('Validation failed: missing fields');
    showFormMessage('Please fill in all required fields.', 'error');
    return;
  }
  
  if (!isValidEmail(email)) {
    console.log('Validation failed: invalid email');
    showFormMessage('Please enter a valid email address.', 'error');
    return;
  }
  
  console.log('Validation passed, submitting form...');
  
  // Show loading state
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  button.disabled = true;
  
  // Submit form with timeout
  const submissionTimeout = setTimeout(() => {
    console.log('Form submission timeout');
    showFormMessage('Form submission is taking longer than expected. Your message may have been sent.', 'info');
    button.innerHTML = originalText;
    button.disabled = false;
  }, 10000); // 10 second timeout
  
  submitForm(formData)
    .then(() => {
      clearTimeout(submissionTimeout);
      console.log('Form submission successful');
      showFormMessage('Thank you for your message! I will get back to you soon.', 'success');
      form.reset();
      AppState.formSubmissionAttempts = 0; // Reset on success
    })
    .catch((error) => {
      clearTimeout(submissionTimeout);
      console.error('Form submission error:', error);
      showFormMessage('Your message has been prepared. Please check your email client or try again.', 'info');
    })
    .finally(() => {
      button.innerHTML = originalText;
      button.disabled = false;
    });
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Form submission function with multiple fallback methods
async function submitForm(formData) {
  console.log('Form submission started...');
  console.log('Form data:', Object.fromEntries(formData));
  
  // Method 1: Try FormSubmit with proper configuration
  try {
    console.log('Trying FormSubmit method...');
    
    // Create a regular form submission to avoid CORS issues
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://formsubmit.co/earni8105@gmail.com';
    form.style.display = 'none';
    
    // Add all form data as hidden inputs
    for (const [key, value] of formData.entries()) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    }
    
    // Add FormSubmit configuration
    const nextInput = document.createElement('input');
    nextInput.type = 'hidden';
    nextInput.name = '_next';
    nextInput.value = window.location.origin + '/thank-you.html';
    form.appendChild(nextInput);
    
    const captchaInput = document.createElement('input');
    captchaInput.type = 'hidden';
    captchaInput.name = '_captcha';
    captchaInput.value = 'false';
    form.appendChild(captchaInput);
    
    const subjectInput = document.createElement('input');
    subjectInput.type = 'hidden';
    subjectInput.name = '_subject';
    subjectInput.value = 'New Portfolio Contact Form Submission';
    form.appendChild(subjectInput);
    
    document.body.appendChild(form);
    
    // Submit the form
    console.log('Submitting form to FormSubmit...');
    form.submit();
    
    // Clean up
    setTimeout(() => {
      if (form.parentNode) {
        form.remove();
      }
    }, 1000);
    
    return Promise.resolve();
    
  } catch (error) {
    console.error('FormSubmit method failed:', error);
    
    // Method 2: Try fetch with different configuration
    try {
      console.log('Trying fetch method...');
      
      const response = await fetch('https://formsubmit.co/earni8105@gmail.com', {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // This avoids CORS issues but we can't read the response
      });
      
      console.log('Fetch completed (no-cors mode)');
      return Promise.resolve();
      
    } catch (fetchError) {
      console.error('Fetch method failed:', fetchError);
      
      // Method 3: Mailto fallback
      console.log('Using mailto fallback...');
      return mailtoFallback(formData);
    }
  }
}

// Mailto fallback function
function mailtoFallback(formData) {
  console.log('Creating mailto link...');
  
  const name = formData.get('name') || '';
  const email = formData.get('email') || '';
  const message = formData.get('message') || '';
  
  const subject = encodeURIComponent('Portfolio Contact Form Submission');
  const body = encodeURIComponent(
    `Name: ${name}\n` +
    `Email: ${email}\n` +
    `Message: ${message}\n\n` +
    `Sent from: ${window.location.href}`
  );
  
  const mailtoLink = `mailto:earni8105@gmail.com?subject=${subject}&body=${body}`;
  
  // Try to open mailto
  const link = document.createElement('a');
  link.href = mailtoLink;
  link.style.display = 'none';
  document.body.appendChild(link);
  
  try {
    link.click();
    console.log('Mailto link opened');
    return Promise.resolve();
  } catch (error) {
    console.error('Mailto failed:', error);
    return Promise.reject(new Error('All submission methods failed'));
  } finally {
    if (link.parentNode) {
      link.remove();
    }
  }
}

// Show form message
function showFormMessage(message, type = 'info') {
  // Remove existing messages
  const existingMessage = document.querySelector('.form-message');
  if (existingMessage) {
    existingMessage.remove();
  }
  
  // Create new message
  const messageDiv = document.createElement('div');
  messageDiv.className = `form-message ${type}`;
  messageDiv.textContent = message;
  
  // Add styles
  messageDiv.style.cssText = `
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 8px;
    text-align: center;
    font-weight: 500;
    animation: slideDown 0.3s ease;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
  `;
  
  // Insert before form
  const form = document.getElementById('contact-form');
  if (form) {
    form.parentNode.insertBefore(messageDiv, form);
    
    // Remove message after 5 seconds
    setTimeout(() => {
      if (messageDiv && messageDiv.parentNode) {
        messageDiv.remove();
      }
    }, 5000);
  }
}

// Scroll to Top Button
let scrollTopBtn = null;

function createScrollTopButton() {
  if (scrollTopBtn) return;
  
  scrollTopBtn = document.createElement('button');
  scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollTopBtn.className = 'scroll-top-btn';
  scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
  scrollTopBtn.style.display = 'none';
  
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  
  document.body.appendChild(scrollTopBtn);
}

function handleScroll() {
  if (!scrollTopBtn) return;
  
  const shouldShow = window.pageYOffset > 300;
  scrollTopBtn.style.display = shouldShow ? 'flex' : 'none';
}

// Keyboard Navigation
function handleKeyboardNavigation(e) {
  // Handle keyboard navigation for accessibility
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-nav');
  }
}

function handleMouseNavigation() {
  document.body.classList.remove('keyboard-nav');
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Error handling for observers
function createIntersectionObserver(callback, options = {}) {
  try {
    return new IntersectionObserver(callback, {
      threshold: 0.5,
      rootMargin: '0px 0px -50px 0px',
      ...options
    });
  } catch (error) {
    console.warn('IntersectionObserver not supported:', error);
    return null;
  }
}

// Initialize observers
function initializeObservers() {
  const sections = document.querySelectorAll('.section');
  
  if (sections.length > 0) {
    const activeObserver = createIntersectionObserver(updateActiveNav);
    const sectionObserver = createIntersectionObserver(animateSectionEntry, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    if (activeObserver && sectionObserver) {
      sections.forEach(section => {
        activeObserver.observe(section);
        sectionObserver.observe(section);
      });
    }
  }
}

// Event Listeners Setup
function setupEventListeners() {
  // Theme toggle
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Navigation links with fade exit for external pages
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (href && href.startsWith("#")) {
        // In-page scroll
        showSection(href.substring(1));
      } else if (href) {
        // External page (like thank-you.html)
        handlePageExit(href);
      }
    });
  });
  
  // Contact form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmission);
  }
  
  // Scroll events
  window.addEventListener('scroll', debounce(handleScroll, 16));
  
  // Keyboard navigation
  document.addEventListener('keydown', handleKeyboardNavigation);
  document.addEventListener('mousedown', handleMouseNavigation);
  
  // Handle page visibility changes
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopTyping();
    } else if (typingText) {
      setTimeout(typeEffect, 500);
    }
  });
}

// Cleanup function
function cleanup() {
  stopTyping();
  if (scrollTopBtn && scrollTopBtn.parentNode) {
    scrollTopBtn.remove();
  }
}

// Thank you page specific functionality
function initializeThankYouPage() {
  // Check if we're on the thank you page
  if (window.location.pathname.includes('thank-you.html')) {
    // Add a simple animation to the thank you message
    const thankYouContainer = document.querySelector('.thank-you-container');
    if (thankYouContainer) {
      thankYouContainer.style.cssText = `
        text-align: center;
        padding: 100px 20px;
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
      `;
      
      // Animate in after a short delay
      setTimeout(() => {
        thankYouContainer.style.opacity = '1';
        thankYouContainer.style.transform = 'translateY(0)';
      }, 300);
    }
    
    // Auto-redirect after 5 seconds (optional)
    setTimeout(() => {
      const redirectBtn = document.querySelector('a[href*="index.html"]');
      if (redirectBtn && !document.hidden) {
        // Uncomment the line below if you want auto-redirect
        // window.location.href = redirectBtn.href;
      }
    }, 5000);
  }
}

// Initialize GSAP animations (only if GSAP is available)
function initializeGSAPAnimations() {
  // Check if GSAP is loaded
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded, skipping animations');
    return;
  }

  // Register ScrollTrigger if available
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero section GSAP animations
  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroDescription = document.querySelector('.hero-description');
  const heroButtons = document.querySelectorAll('.hero-buttons .btn');

  if (heroTitle) {
    gsap.from(heroTitle, {
      duration: 1,
      y: -50,
      opacity: 0,
      ease: "power2.out"
    });
  }

  if (heroSubtitle) {
    gsap.from(heroSubtitle, {
      duration: 1,
      x: -30,
      opacity: 0,
      delay: 0.3,
      ease: "power2.out"
    });
  }

  if (heroDescription) {
    gsap.from(heroDescription, {
      duration: 1,
      y: 30,
      opacity: 0,
      delay: 0.5,
      ease: "power2.out"
    });
  }

  if (heroButtons.length > 0) {
    gsap.from(heroButtons, {
      duration: 0.6,
      y: 20,
      opacity: 0,
      stagger: 0.2,
      delay: 0.7,
      ease: "back.out(1.7)"
    });
  }

  // Scroll-triggered fade-ins
  if (typeof ScrollTrigger !== 'undefined') {
    const sections = document.querySelectorAll('.section');

    sections.forEach(section => {
      const content = section.querySelector('.section-content');
      if (!content) return;

      gsap.from(content, {
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out"
      });
    });
  }
}

// Initialize application
function initializeApp() {
  console.log('Initializing application...');
  
  // Initialize theme
  initializeTheme();
  
  // Setup event listeners
  setupEventListeners();
  
  // Initialize observers and animations (only for main page)
  if (!window.location.pathname.includes('thank-you.html')) {
    initializeObservers();
    
    // Initialize GSAP animations
    initializeGSAPAnimations();
    
    // Start typing animation if element exists
    if (typingText) {
      setTimeout(() => {
        typeEffect();
      }, 1000);
    }
    
    // Create scroll top button
    setTimeout(createScrollTopButton, 2000);
  } else {
    // Initialize thank you page
    initializeThankYouPage();
  }
  
  // Hide loader after initialization
  setTimeout(() => {
    hideLoader();
    
    // Animate body content fade-in (only if GSAP is available)
    if (typeof gsap !== 'undefined') {
      gsap.from("body", {
        duration: 1,
        opacity: 0,
        ease: "power2.out"
      });
    }
  }, 1200);
}

// DOM Content Loaded - Single event listener
document.addEventListener('DOMContentLoaded', initializeApp);

// Page unload cleanup
window.addEventListener('beforeunload', cleanup);

// Handle errors gracefully
window.addEventListener('error', (e) => {
  console.error('Application error:', e.error);
  // You could implement error reporting here
});

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AppState,
    toggleTheme,
    showSection,
    isValidEmail
  };
}