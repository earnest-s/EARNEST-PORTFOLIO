// In-memory storage for application state
const AppState = {
  theme: 'light',
  currentSection: 'home',
  formSubmissionAttempts: 0
  // Remove isLoading property
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

// Update the showSection function
function showSection(targetId) {
  if (!targetId) return;
  
  AppState.currentSection = targetId;
  
  // Update navigation
  navLinks.forEach(link => link.classList.remove('active'));
  const activeLink = document.querySelector(`[href="#${targetId}"]`);
  if (activeLink) {
    activeLink.classList.add('active');
    
    // Scroll to section with offset for header height
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      const headerHeight = document.querySelector('.header').offsetHeight;
      const targetPosition = targetSection.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
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
    if (entry.isIntersecting) {
      const id = entry.target.id;
      if (id) {
        AppState.currentSection = id;
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          const isActive = href === `#${id}`;
          link.classList.toggle('active', isActive);
        });
      }
    }
  });
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
  
  const form = e.target;
  const formData = new FormData(form);
  const button = form.querySelector('button[type="submit"]');
  const originalText = button.innerHTML;
  
  // Rate limiting check
  AppState.formSubmissionAttempts++;
  if (AppState.formSubmissionAttempts > 5) {
    return;
  }
  
  // Validate form data
  const name = formData.get('name')?.trim();
  const email = formData.get('email')?.trim();
  const message = formData.get('message')?.trim();
  
  if (!name || !email || !message || !isValidEmail(email)) {
    return;
  }
  
  // Show loading state
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  button.disabled = true;
  
  // Create and submit form directly
  const submitForm = document.createElement('form');
  submitForm.method = 'POST';
  submitForm.action = 'https://formsubmit.co/earni8105@gmail.com';
  submitForm.style.display = 'none';
  
  // Add form data
  for (const [key, value] of formData.entries()) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    submitForm.appendChild(input);
  }
  
  // Add FormSubmit configuration
  const nextInput = document.createElement('input');
  nextInput.type = 'hidden';
  nextInput.name = '_next';
  nextInput.value = window.location.origin + '/thank-you';
  submitForm.appendChild(nextInput);
  
  const captchaInput = document.createElement('input');
  captchaInput.type = 'hidden';
  captchaInput.name = '_captcha';
  captchaInput.value = 'false';
  submitForm.appendChild(captchaInput);
  
  const subjectInput = document.createElement('input');
  subjectInput.type = 'hidden';
  subjectInput.name = '_subject';
  subjectInput.value = 'New Portfolio Contact Form Submission';
  submitForm.appendChild(subjectInput);
  
  // Submit form
  document.body.appendChild(submitForm);
  submitForm.submit();
  
  // Clean up
  setTimeout(() => {
    if (submitForm.parentNode) {
      submitForm.remove();
    }
  }, 1000);
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
    nextInput.value = window.location.origin + '/thank-you'; // Remove .ejs extension
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
    const activeObserver = new IntersectionObserver(updateActiveNav, {
      threshold: 0.2, // Reduced threshold for earlier detection
      rootMargin: '-100px 0px -50px 0px' // Adjusted rootMargin to account for header
    });
    
    const sectionObserver = new IntersectionObserver(animateSectionEntry, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    sections.forEach(section => {
      activeObserver.observe(section);
      sectionObserver.observe(section);
    });
  }
}

// Event Listeners Setup
function setupEventListeners() {
  // Theme toggle
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Navigation links with improved handling
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        const targetId = href.substring(1);
        showSection(targetId);
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
  if (window.location.pathname.includes('thank-you.ejs')) {
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
  if (typeof gsap === 'undefined') {
    console.warn('GSAP not loaded, skipping animations');
    return;
  }

  // Hero section animations
  const heroTitle = document.querySelector('.hero-title');
  const heroSubtitle = document.querySelector('.hero-subtitle');
  const heroDescription = document.querySelector('.hero-description');
  const heroButtons = document.querySelector('.hero-buttons'); // Changed to target container

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

  // Animate buttons container instead of individual buttons
  if (heroButtons) {
    gsap.from(heroButtons, {
      duration: 0.6,
      y: 20,
      opacity: 0,
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

  // SVG animations
  const svg = document.querySelector('.hero-svg');
  if (svg && typeof gsap !== 'undefined') {
    // Animate grid pattern
    gsap.from('pattern path', {
      opacity: 0,
      duration: 1,
      stagger: 0.1
    });

    // Animate axes
    gsap.from('.chart-container line', {
      scaleX: 0,
      scaleY: 0,
      duration: 1,
      transformOrigin: 'left bottom',
      stagger: 0.2
    });

    // Animate floating elements
    gsap.to('.float-item', {
      y: -20,
      duration: 2,
      repeat: -1,
      yoyo: true,
      stagger: {
        each: 0.5,
        from: "random"
      },
      ease: "sine.inOut"
    });

    // Add hover effect to data points
    document.querySelectorAll('.data-point').forEach(point => {
      point.addEventListener('mouseenter', () => {
        gsap.to(point, {
          scale: 1.5,
          duration: 0.3
        });
      });
      point.addEventListener('mouseleave', () => {
        gsap.to(point, {
          scale: 1,
          duration: 0.3
        });
      });
    });
  }
}

// Skills Tabs Filtering
document.addEventListener('DOMContentLoaded', function () {
  const tabs = document.querySelectorAll('.skills-tab');
  const skillBoxes = document.querySelectorAll('.skill-box');
  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.getAttribute('data-category');
      skillBoxes.forEach(box => {
        if (cat === 'all' || box.getAttribute('data-category') === cat) {
          box.style.display = 'flex';
        } else {
          box.style.display = 'none';
        }
      });
    });
  });
});

// Initialize application
function initializeApp() {
  console.log('Initializing application...');
  
  // Initialize theme
  initializeTheme();
  
  // Setup event listeners
  setupEventListeners();
  
  // Initialize observers and animations (only for main page)
  if (!window.location.pathname.includes('thank-you.ejs')) {
    initializeObservers();
    initializeGSAPAnimations();
    
    if (typingText) {
      setTimeout(() => {
        typeEffect();
      }, 1000);
    }
    
    setTimeout(createScrollTopButton, 2000);
  } else {
    initializeThankYouPage();
  }
  
  // Animate body content fade-in (only if GSAP is available)
  if (typeof gsap !== 'undefined') {
    gsap.from("body", {
      duration: 0.5, // Reduced from 1 to 0.5 for faster initial load
      opacity: 0,
      ease: "power2.out"
    });
  }
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

// Add to initializeGSAPAnimations()
if (typeof ScrollTrigger !== 'undefined' && typeof MorphSVGPlugin !== 'undefined') {
  // Animate the SVG paths in hero section
  const svgPaths = document.querySelectorAll(".hero-svg rect, .hero-svg polyline");
  
  gsap.from(svgPaths, {
    scrollTrigger: {
      trigger: "#home",
      start: "top center",
      end: "bottom center",
      scrub: 1
    },
    scaleY: 0,
    transformOrigin: "bottom center",
    stagger: 0.1,
    ease: "power2.inOut"
  });

  // Create a more complex path animation for the line chart
  const linePath = document.querySelector(".hero-svg polyline");
  if (linePath) {
    const originalPoints = linePath.getAttribute("points");
    const pointsArray = originalPoints.split(" ").map(p => p.split(","));
    
    // Create a wavy starting state
    const startPoints = pointsArray.map(([x,y], i) => 
      [x, Number(y) + (i % 2 === 0 ? 30 : -30)].join(",")
    ).join(" ");
    
    gsap.fromTo(linePath, 
      { attr: { points: startPoints } },
      {
        attr: { points: originalPoints },
        duration: 2,
        ease: "elastic.out(1, 0.3)",
        scrollTrigger: {
          trigger: "#home",
          start: "top 60%"
        }
      }
    );
  }
}

// Add floating data nodes like GSAP's homepage
function createFloatingNodes() {
  const container = document.querySelector(".hero-right");
  if (!container) return;
  
  // Create 15 floating nodes
  for (let i = 0; i < 15; i++) {
    const node = document.createElement("div");
    node.className = "floating-node";
    node.style.cssText = `
      position: absolute;
      width: ${6 + Math.random() * 10}px;
      height: ${6 + Math.random() * 10}px;
      background: rgba(255,255,255,${0.2 + Math.random() * 0.3});
      border-radius: 50%;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
    `;
    container.appendChild(node);
    
    // Animate each node independently
    gsap.to(node, {
      x: `${-20 + Math.random() * 40}px`,
      y: `${-20 + Math.random() * 40}px`,
      duration: 3 + Math.random() * 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }
}

// Add to navigation click handler
function showSection(targetId) {
  // Only animate if GSAP is available
  if (typeof gsap !== 'undefined') {
    const currentSection = document.querySelector(`#${AppState.currentSection}`);
    const targetSection = document.getElementById(targetId);
    
    if (currentSection && targetSection) {
      const tl = gsap.timeline({
        onComplete: () => {
          // Actual scroll happens after animation
          targetSection.scrollIntoView({ behavior: 'auto', block: 'start' });
        }
      });
      
      tl.to(currentSection.querySelector('.section-content'), {
        opacity: 0,
        y: 50,
        duration: 0.4,
        ease: "power2.in"
      })
      .fromTo(targetSection.querySelector('.section-content'),
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 0.6, ease: "back.out(1.2)" },
        "-=0.2"
      );
    }
  }
  
  // Update navigation state
  AppState.currentSection = targetId;
  navLinks.forEach(link => link.classList.remove('active'));
  document.querySelector(`[href="#${targetId}"]`).classList.add('active');
}

// Enhanced button hover effects
document.querySelectorAll('.btn, .project-link').forEach(button => {
  // Add shine effect element
  const shine = document.createElement('div');
  shine.className = 'btn-shine';
  shine.style.cssText = `
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      to right,
      rgba(255,255,255,0) 0%,
      rgba(255,255,255,0.8) 50%,
      rgba(255,255,255,0) 100%
    );
    transform: rotate(30deg);
    opacity: 0;
    pointer-events: none;
  `;
  button.style.position = 'relative';
  button.style.overflow = 'hidden';
  button.appendChild(shine);
  
  // Hover animation
  button.addEventListener('mouseenter', () => {
    gsap.to(button, {
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out"
    });
    gsap.to(shine, {
      x: '100%',
      opacity: 0.6,
      duration: 0.8,
      ease: "power2.out"
    });
  });
  
  button.addEventListener('mouseleave', () => {
    gsap.to(button, {
      scale: 1,
      duration: 0.4,
      ease: "elastic.out(1, 0.5)"
    });
    gsap.to(shine, {
      x: '-100%',
      opacity: 0,
      duration: 0.3
    });
  });
});

// Add scroll progress indicator
function createScrollIndicator() {
  const indicator = document.createElement('div');
  indicator.className = 'scroll-indicator';
  indicator.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 4px;
    background: var(--primary-color);
    width: 0%;
    z-index: 1000;
    transform-origin: left center;
  `;
  document.body.appendChild(indicator);
  
  ScrollTrigger.create({
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    onUpdate: self => {
      gsap.to(indicator, {
        width: `${self.progress * 100}%`,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  });
}