// Loading Screen
window.addEventListener('load', () => {
    document.getElementById('loading').style.display = 'none';
});

// Typed.js Typing Effect
var typed = new Typed('.typing', {
    strings: ["Data Analyst", "AI Enthusiast", "IoT Developer", "Creative Thinker"],
    typeSpeed: 80,
    backSpeed: 50,
    loop: true
});

// ScrollReveal Animations for Sections and Titles
ScrollReveal().reveal('section', {
    duration: 1200,
    origin: 'bottom',
    distance: '70px',
    easing: 'ease-in-out',
    reset: false,
    opacity: 0,
    scale: 0.9,
    viewFactor: 0.2
});

ScrollReveal().reveal('h2', {
    duration: 1000,
    origin: 'top',
    distance: '30px',
    delay: 200,
    reset: false
});

// tsParticles Background
tsParticles.load("particles-js", {
    fullScreen: { enable: false },
    particles: {
        number: { value: 80 },
        color: { value: "#4caf50" },
        shape: { type: "circle" },
        opacity: { value: 0.5 },
        size: { value: { min: 1, max: 5 } },
        move: { enable: true, speed: 1 },
        links: { enable: true, distance: 150, color: "#4caf50", opacity: 0.4 }
    }
});

// Dark/Light Mode Toggle
const modeToggle = document.getElementById('modeToggle');
modeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
});

// Dynamic Navbar Background on Scroll
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.background = "rgba(0,0,0,0.9)";
    } else {
        navbar.style.background = "rgba(0,0,0,0.6)";
    }
});

// Back to Top Button
const backToTop = document.getElementById("backToTop");

window.onscroll = function() {
    if (document.body.scrollTop > 400 || document.documentElement.scrollTop > 400) {
        backToTop.style.display = "block";
    } else {
        backToTop.style.display = "none";
    }
};

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Snackbar on Form Submit
const contactForm = document.getElementById('contactForm');
const snackbar = document.getElementById('snackbar');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    snackbar.className = "show";
    setTimeout(() => {
        snackbar.className = snackbar.className.replace("show", "");
    }, 3000);
    contactForm.reset();
});
