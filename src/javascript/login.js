import "../styles/loginpage.css";
const token = localStorage.getItem("jwtToken");
console.log("Token being sent:", token);

document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

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
            localStorage.setItem('jwtToken', data.token);

            alert('Login successful!');

            window.location.href = 'index.html';
        } else {

            document.getElementById('error-message').textContent = data.message || 'Invalid credentials';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('error-message').textContent = 'Invalid username or password';
    }
});
