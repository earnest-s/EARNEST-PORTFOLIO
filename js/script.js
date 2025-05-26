// Theme Management (with localStorage)
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  body.setAttribute('data-theme', 'dark');
  themeToggle.querySelector('i').className = 'fas fa-sun';
}

// Toggle theme
themeToggle.addEventListener('click', () => {
  const isDark = body.getAttribute('data-theme') === 'dark';
  if (isDark) {
    body.removeAttribute('data-theme');
    themeToggle.querySelector('i').className = 'fas fa-moon';
    localStorage.setItem('theme', 'light');
  } else {
    body.setAttribute('data-theme', 'dark');
    themeToggle.querySelector('i').className = 'fas fa-sun';
    localStorage.setItem('theme', 'dark');
  }
});

// Typing Animation
const typingText = document.getElementById('typing-text');
const phrases = ['Data Analyst', 'IoT Developer', 'AI Enthusiast', 'Problem Solver'];
let phraseIndex = 0, charIndex = 0, isDeleting = false;

function typeEffect() {
  const currentPhrase = phrases[phraseIndex];
  typingText.textContent = isDeleting
    ? currentPhrase.substring(0, charIndex - 1)
    : currentPhrase.substring(0, charIndex + 1);
  charIndex += isDeleting ? -1 : 1;

  let typeSpeed = isDeleting ? 50 : 100;
  if (!isDeleting && charIndex === currentPhrase.length) {
    typeSpeed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typeSpeed = 500;
  }

  setTimeout(typeEffect, typeSpeed);
}

// Navigation
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

function showSection(targetId) {
  navLinks.forEach(link => link.classList.remove('active'));
  const activeLink = document.querySelector(`[href="#${targetId}"]`);
  if (activeLink) activeLink.classList.add('active');
  const targetSection = document.getElementById(targetId);
  if (targetSection) targetSection.scrollIntoView({ behavior: 'smooth' });
}

navLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    showSection(targetId);
  });
});

// Update nav-link active class based on scroll position
const updateActiveNav = (entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
};

const activeObserver = new IntersectionObserver(updateActiveNav, { threshold: 0.5 });
sections.forEach(section => activeObserver.observe(section));

// Loader
const loader = document.getElementById('loader');
function hideLoader() {
  loader.classList.add('hidden');
  setTimeout(() => loader.style.display = 'none', 500);
}

// Animate section entry
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const content = entry.target.querySelector('.section-content');
      if (content) {
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';
      }
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.getElementById('contact-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const formData = new FormData(this);
  const button = this.querySelector('button[type="submit"]');
  const originalText = button.innerHTML;
  
  // Show loading state
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  button.disabled = true;
  
  try {
    // Try to submit to FormSubmit
    const response = await fetch('https://formsubmit.co/earni8105@gmail.com', {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      // Success - redirect to thank you page
      window.location.href = 'https://earni.netlify.app/thank-you.html';
    } else {
      throw new Error('Form submission failed');
    }
  } catch (error) {
    // If FormSubmit fails, show success message anyway (since the user might be blocked)
    alert('Thank you for your message! I will get back to you soon.');
    this.reset();
  }
  
  // Reset button
  button.innerHTML = originalText;
  button.disabled = false;
});

// Scroll to Top Button
let scrollTopBtn;
function createScrollTopButton() {
  scrollTopBtn = document.createElement('button');
  scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollTopBtn.className = 'scroll-top-btn';
  scrollTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  document.body.appendChild(scrollTopBtn);
}
window.addEventListener('scroll', () => {
  if (!scrollTopBtn) return;
  scrollTopBtn.style.display = window.pageYOffset > 300 ? 'flex' : 'none';
});
setTimeout(createScrollTopButton, 2000);

// Init
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(typeEffect, 1000);
  setTimeout(hideLoader, 1500);
  sections.forEach(section => sectionObserver.observe(section));
  setTimeout(() => body.classList.add('fade-in'), 100);
});
