document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;

    // Simple validation
    if (name && phone && email) {
        const message = `Thank you, ${name}! We'll contact you soon.`;
        document.getElementById('formMessage').textContent = message;
        document.getElementById('formMessage').classList.remove('hidden');

        // Clear form fields
        document.getElementById('contactForm').reset();
    } else {
        alert('Please fill out all fields.');
    }
});
