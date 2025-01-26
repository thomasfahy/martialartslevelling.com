import "../styles/styles.css";

document.addEventListener("DOMContentLoaded", () => {
    // Fetch the JWT token from localStorage or wherever it's stored
    const token = localStorage.getItem('jwtToken'); // You may need to adjust based on your token storage method
    
    if (!token) {
      alert("Please log in to view your stats.");
      return;
    }
  
    // Fetch the stats from the server
    fetch("/api/stats", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(stats => {
        // Update the stats values in the HTML
        updateStats(stats);
      })
      .catch(error => {
        console.error("Error fetching stats:", error);
      });
  });
  
  // Function to update the stats in the HTML
  function updateStats(stats) {
    // Assuming the stats object contains the following properties:
    // { patterns, technique, strength, agility, flexibility, combat }
    
    const statElements = document.querySelectorAll('.stat-info');
  
    // Set the stat values in the corresponding HTML elements
    statElements.forEach(statElement => {
      const statName = statElement.querySelector('.stat-name').textContent.trim().toLowerCase();
      const statValueElement = statElement.querySelector('.stat-value');
      
      // Update the stat value dynamically
      switch (statName) {
        case 'patterns':
          statValueElement.textContent = stats.patterns || 0;
          break;
        case 'technique':
          statValueElement.textContent = stats.technique || 0;
          break;
        case 'strength':
          statValueElement.textContent = stats.strength || 0;
          break;
        case 'agility':
          statValueElement.textContent = stats.agility || 0;
          break;
        case 'flexibility':
          statValueElement.textContent = stats.flexibility || 0;
          break;
        case 'combat':
          statValueElement.textContent = stats.combat || 0;
          break;
        default:
          console.error("Unknown stat:", statName);
      }
    });
  }
  