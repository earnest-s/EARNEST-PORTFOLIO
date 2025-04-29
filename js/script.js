// Typing Animation
const textArray = [
  "Turning Data into Insights...",
  "Data Analyst | IoT Enthusiast",
  "Building AI Solutions"
];
let typingIndex = 0;
let charIndex = 0;
const typingText = document.getElementById("typing-text");

function typeText() {
  if (charIndex < textArray[typingIndex].length) {
    typingText.textContent += textArray[typingIndex].charAt(charIndex);
    charIndex++;
    setTimeout(typeText, 100);
  } else {
    setTimeout(eraseText, 2000);
  }
}

function eraseText() {
  if (charIndex > 0) {
    typingText.textContent = textArray[typingIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(eraseText, 50);
  } else {
    typingIndex = (typingIndex + 1) % textArray.length;
    setTimeout(typeText, 500);
  }
}

// Apply Theme (dark/light) from localStorage or system preference
function applyTheme(savedTheme = null) {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = savedTheme || localStorage.getItem("theme") || (prefersDark ? "dark" : "light");
  document.body.classList.toggle("dark", theme === "dark");
  document.getElementById("theme-toggle").textContent = theme === "dark" ? "☀️" : "🌙";
}

// Smooth Page Transition on Link Click
function setupPageTransitions() {
  document.querySelectorAll('a[href]').forEach(link => {
    if (link.getAttribute('target') !== '_blank' && !link.getAttribute('href').startsWith('#')) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        document.body.classList.add("fade-out");
        setTimeout(() => {
          window.location.href = href;
        }, 300); // matches fade-out transition
      });
    }
  });
}

// Loader Spinner Hide After Page Load
function hideLoader() {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.display = "none";
  }
}

// Initialize Everything
document.addEventListener("DOMContentLoaded", () => {
  // Typing animation
  if (typingText) {
    setTimeout(typeText, 1000);
  }

  // Theme setup
  applyTheme();
  
  // Theme toggle button
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const newTheme = document.body.classList.contains("dark") ? "light" : "dark";
      localStorage.setItem("theme", newTheme);
      applyTheme(newTheme);
    });
  }

  // Page fade-in
  document.body.classList.add("fade-in");

  // Setup page transitions
  setupPageTransitions();
});

// Loader hide after full window load
window.addEventListener("load", hideLoader);
