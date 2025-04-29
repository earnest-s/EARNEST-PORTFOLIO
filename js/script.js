// Typing effect
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

// Theme toggling
function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark", isDark);
  const toggle = document.getElementById("theme-toggle");
  if (toggle) toggle.textContent = isDark ? "☀️" : "🌙";
  localStorage.setItem("theme", theme);
}

document.addEventListener("DOMContentLoaded", () => {
  // Apply saved or preferred theme
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(saved || (prefersDark ? "dark" : "light"));

  // Toggle theme
  const toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const newTheme = document.body.classList.contains("dark") ? "light" : "dark";
      applyTheme(newTheme);
    });
  }

  // Start typing effect
  if (typingText) setTimeout(typeText, 500);

  // Fade-in transition
  document.body.classList.add("fade-in");

  // Smooth page transition on internal link click
  document.querySelectorAll("a[href]").forEach(link => {
    const href = link.getAttribute("href");
    if (href && !href.startsWith("#") && !link.hasAttribute("target")) {
      link.addEventListener("click", e => {
        e.preventDefault();
        document.body.classList.add("fade-out");
        setTimeout(() => window.location.href = href, 300);
      });
    }
  });
});

// Hide loader after page load
window.addEventListener("load", () => {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";
});
