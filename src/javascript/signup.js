import "../styles/signup.css";

document.querySelector("form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = {
      firstName: document.getElementById("first-name").value,
      lastName: document.getElementById("last-name").value,
      username: document.getElementById("username").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
      confirmPassword: document.getElementById("confirm-password").value,
    };

    try {
      const response = await fetch("http://localhost:3000/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("User registered successfully!");
        window.location.href = "./login.html";
      } else {
        const errorMessage = await response.text();
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    }
  });