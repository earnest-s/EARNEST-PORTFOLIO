// ==============================
// Typing effect
// ==============================
const typingText = document.getElementById("typing-text");
const textArray = [
  "Turning Data into Insights...",
  "Data Analyst | IoT Enthusiast",
  "Building AI Solutions"
];
let typingIndex = 0;
let charIndex = 0;

function typeText() {
  if (typingText) {
    if (charIndex === 0) typingText.textContent = ""; // clear before typing
    if (charIndex < textArray[typingIndex].length) {
      typingText.textContent += textArray[typingIndex].charAt(charIndex++);
      setTimeout(typeText, 100);
    } else {
      setTimeout(eraseText, 2000);
    }
  }
}

function eraseText() {
  if (charIndex > 0) {
    typingText.textContent = textArray[typingIndex].substring(0, --charIndex);
    setTimeout(eraseText, 50);
  } else {
    typingIndex = (typingIndex + 1) % textArray.length;
    setTimeout(typeText, 500);
  }
}

// ==============================
// Theme toggling (Dark/Light)
// ==============================
function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark", isDark);

  const toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.innerHTML = isDark
      ? '<i class="fas fa-sun"></i>'
      : '<i class="fas fa-moon"></i>';
  }

  localStorage.setItem("theme", theme);
}

// ==============================
// Page Load Setup
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  // Apply saved or system-preferred theme
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (prefersDark ? "dark" : "light"));

  // Toggle theme on click
  const toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const isDark = document.body.classList.contains("dark");
      applyTheme(isDark ? "light" : "dark");
    });
  }

  // Start typing animation
  if (typingText) setTimeout(typeText, 500);

  // Add fade-in effect on load
  document.body.classList.add("fade-in");

  // Add smooth transition between pages
  document.querySelectorAll("a[href]").forEach(link => {
    const href = link.getAttribute("href");
    if (href && !href.startsWith("#") && !link.hasAttribute("target")) {
      link.addEventListener("click", e => {
        e.preventDefault();
        document.body.classList.add("fade-out");
        setTimeout(() => (window.location.href = href), 300);
      });
    }
  });
});

// ==============================
// Hide loader on full page load
// ==============================
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";
});
