// Time and Date Update
function updateDateTime() {
    const now = new Date();

    // Time
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const time = `${hours}:${minutes}:${seconds}`;
    document.getElementById('time').innerHTML = time;

    // Date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fullDate = now.toLocaleDateString('en-US', options);
    document.getElementById('date').innerHTML = fullDate;
}

setInterval(updateDateTime, 1000);
updateDateTime();

// Dark Mode Toggle
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('change', () => {
    document.body.classList.toggle('light-mode');
});

// Contact Form Handling
document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;

    if (name && phone && email) {
        const message = `Thank you, ${name}! We'll contact you soon.`;
        document.getElementById('formMessage').textContent = message;
        document.getElementById('formMessage').classList.remove('hidden');
        document.getElementById('contactForm').reset();
    } else {
        alert('Please fill out all fields.');
    }
});
