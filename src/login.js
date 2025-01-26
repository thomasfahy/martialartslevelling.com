const app = require('./server');

document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    // Get the email and password from the form
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Send the login request to the backend
    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Successful login, store the JWT token
            localStorage.setItem('jwtToken', data.token);
            alert('Login successful!');
            // Redirect to the dashboard or homepage
            window.location.href = '/dashboard.html'; // Change this as per your app
        } else {
            // Show error message
            document.getElementById('error-message').textContent = data.message || 'Invalid credentials';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('error-message').textContent = 'An error occurred. Please try again later.';
    }
});
