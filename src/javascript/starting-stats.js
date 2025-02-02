import "../styles/starting-stats.css";

// Helper function to get elements and ensure they exist
const getElement = (id) => document.getElementById(id);

// Token check and validation
const token = localStorage.getItem("jwtToken");
if (!token) {
  console.error("Token is missing or invalid.");
} else {
  console.log("Token being sent:", token);
}

// Check if submit button exists
const submitButton = getElement('starting-stats-submit');
if (!submitButton) {
  console.error("Button not found! Check your HTML.");
} else {
  console.log("Button found, adding event listener.");
  submitButton.addEventListener('click', handleStatsSubmit);
}

function handleStatsSubmit(event) {
  event.preventDefault(); // Prevent form submission (default behavior)

  // Grab all the values from the inputs
  const strength = parseInt(getElement('strength').value);
  const fitness = parseInt(getElement('fitness').value);
  const flexibility = parseInt(getElement('flexibility').value);
  const combat = parseInt(getElement('combat').value);
  const experience = parseInt(getElement('experience').value);
  const belt = parseInt(getElement('belt').value);

  // Log individual values to ensure all fields are correctly populated
  console.log('Strength:', strength);
  console.log('Fitness:', fitness);
  console.log('Flexibility:', flexibility);
  console.log('Combat:', combat);
  console.log('Experience:', experience);
  console.log('Belt:', belt);

  // Validate inputs (ensure they are numbers)
  if ([strength, fitness, flexibility, combat, experience, belt].some(isNaN)) {
    alert("Please ensure all fields are filled with valid numbers.");
    return;
  }

  // Log calculated stats
  console.log("Calculated Stats:", strength + fitness + flexibility + combat + experience + belt);

  const userStats = {
    strength: (strength * 2) + 10,
    agility: (fitness) + (strength) + 8,
    flexibility: (flexibility * 2) + 10,
    combat: (combat * 2) + 10,
    technique: (experience * 2) + 10,
    patterns: (belt * 2) + 10
  };

  // Send stats to server
  fetch('http://localhost:3000/api/signup-stats', {
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userStats)
  })
  .then(response => {
    console.log("Response received:", response);
    return response.json(); // Parse response as JSON
  })
  .then(data => {
    console.log('Success:', data);
    alert('Stats saved successfully!'); // Show success message
    window.location.href = "./index.html"; // Redirect to index.html (or wherever you want)
  })
  .catch(error => {
    console.error('Error:', error);
    alert(`Error saving stats: ${error.message}`);
  });
}
