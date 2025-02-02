import "../styles/starting-stats.css";
const token = localStorage.getItem("jwtToken");
console.log("Token being sent:", token);

    document.getElementById('starting-stats-submit').addEventListener('click', function() {
        const strength = parseInt(document.getElementById('strength').value);
        const fitness = parseInt(document.getElementById('fitness').value);
        const flexibility = parseInt(document.getElementById('flexibility').value);
        const combat = parseInt(document.getElementById('combat').value);
        const experience = parseInt(document.getElementById('experience').value);
        const belt = parseInt(document.getElementById('belt').value);
  
        console.log(strength + fitness + flexibility + combat + experience + belt);

        const userStats = {
          strength: (strength * 2) + 10,
          agility: (fitness * 2) + (strength * 2) + 2,
          flexibility: (flexibility * 2) + 10,
          combat: (combat * 2) + 10,
          technique: (experience * 2) + 10,
          patterns: (belt * 2) + 10
        };
        const token = localStorage.getItem("jwtToken");
        fetch('http://localhost:3000/api/signup-stats', {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userStats)
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert('Stats saved successfully!');
            window.location.href="./index.html";
        })

        .catch((error) => {
            console.error('Error:', error);
            alert('Error saving stats.' + error);

        });

      });