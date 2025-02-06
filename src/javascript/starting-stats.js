import "../styles/starting-stats.css";

const getElement = (id) => document.getElementById(id);

const token = localStorage.getItem("jwtToken");
if (!token) {
  console.error("Token is missing or invalid.");
} else {
  console.log("Token being sent:", token);
}

const submitButton = getElement('starting-stats-submit');
if (!submitButton) {
  console.error("Button not found! Check your HTML.");
} else {
  console.log("Button found, adding event listener.");
  submitButton.addEventListener('click', handleStatsSubmit);
}

function handleStatsSubmit(event) {
  event.preventDefault();

  const strength = parseInt(getElement('strength').value);
  const fitness = parseInt(getElement('fitness').value);
  const flexibility = parseInt(getElement('flexibility').value);
  const combat = parseInt(getElement('combat').value);
  const experience = parseInt(getElement('experience').value);
  const belt = parseInt(getElement('belt').value);

  console.log('Strength:', strength);
  console.log('Fitness:', fitness);
  console.log('Flexibility:', flexibility);
  console.log('Combat:', combat);
  console.log('Experience:', experience);
  console.log('Belt:', belt);

  if ([strength, fitness, flexibility, combat, experience, belt].some(isNaN)) {
    alert("Please ensure all fields are filled with valid numbers.");
    return;
  }

  console.log("Calculated Stats:", strength + fitness + flexibility + combat + experience + belt);

  const userStats = {
    strength: (strength * 2) + 10,
    agility: (fitness) + (strength) + 8,
    flexibility: (flexibility * 2) + 10,
    combat: (combat * 2) + 10,
    technique: (experience * 2) + 10,
    patterns: (belt * 2) + 10
  };

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
    return response.json();
  })
  .then(data => {
    console.log('Success:', data);
    alert('Stats saved successfully!');
    window.location.href = "./index.html";
  })
  .catch(error => {
    console.error('Error:', error);
    alert(`Error saving stats: ${error.message}`);
  });
}
