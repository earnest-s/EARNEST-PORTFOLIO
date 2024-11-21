// Update Time and Date
function updateDateTime() {
    const now = new Date();

    // Time
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const time = `${hours}:${minutes}:${seconds}`;
    document.getElementById('time').textContent = time;

    // Date
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const day = days[now.getDay()];
    const month = months[now.getMonth()];
    const date = now.getDate();
    const year = now.getFullYear();
    const fullDate = `${day}, ${month} ${date}, ${year}`;
    document.getElementById('date').textContent = fullDate;
}

// Call the update function every second
setInterval(updateDateTime, 1000);
updateDateTime();

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
