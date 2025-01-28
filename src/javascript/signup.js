
import "../styles/signup.css";

console.log("signup working");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");
const passwordError = document.getElementById("passwordError");
const submitButton = document.getElementById("submitButton");

function validatePasswords() {
  if (passwordInput.value !== confirmPasswordInput.value) {
    passwordError.classList.add("visible");
    submitButton.disabled = true;
  } else {
    passwordError.classList.remove("visible");
    submitButton.disabled = false;
  }
}

passwordInput.addEventListener("input", validatePasswords);
confirmPasswordInput.addEventListener("input", validatePasswords);

// Form Submission
document.getElementById("signupForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = {
    username: document.getElementById("username").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  try {
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("Signup successful! Redirecting to login...");
      window.location.href = "/login.html";
    } else {
      const errorData = await response.json();
      alert(`Signup failed: ${errorData.message}`);
    }
  } catch (error) {
    console.error("Error during signup:", error);
    alert("An error occurred. Please try again.");
  }
});