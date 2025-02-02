import "../styles/styles.css";

//GET STATS ON PAGE LOAD

document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("DOMContentLoaded", () => {
        const token = localStorage.getItem("jwtToken");
        console.log("Token being sent:", token);
        if (!token) {
          window.location.href = "/login.html";
          return;
        }
      });
  const token = localStorage.getItem("jwtToken");
  console.log("Token being sent:", token);    
  fetch(`http://localhost:3000/api/stats`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },

  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch stats: " + response.statusText);
      }
      return response.json();
    })
    .then((stats) => {
      updateStats(stats);
    })
    .catch((error) => {
      console.error("Error fetching stats:", error);
    });
});

//UPDATE STATS ON PAGE LOAD

function updateStats(stats) {
  const statElements = document.querySelectorAll(".stat-info");

  statElements.forEach((statElement) => {
    const statName = statElement.querySelector(".stat-name").textContent.trim().toLowerCase();
    const statValueElement = statElement.querySelector(".stat-value");

    if (stats[statName] !== undefined) {
      statValueElement.textContent = stats[statName];
    } else {
      console.error(`Unknown stat: ${statName}`);
    }
  });
}

document.getElementById("logoutButton").addEventListener("click", () => {
  localStorage.removeItem("jwtToken");
  window.location.href = "/login.html"; 
});

// XP BAR SCRIPT

let level = 3;
let currentXP = 300;
let xpToNextLevel = 300;

document.getElementById("level").textContent = level;
let xpFill = document.getElementById("xpFill");

let progress = (currentXP / xpToNextLevel) * 100;
xpFill.style.width = progress + "%";
xpFill.textContent = currentXP + " / " + xpToNextLevel + " XP";
