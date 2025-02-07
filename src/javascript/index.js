import "../styles/styles.css";
import "../styles/notificationPopup.css";
import "../styles/leveling.css"
import { levelUp } from "./leveling.js";
import { showNotification } from "./notificationQueue.js";
import { attendClass } from "./attendClass.js";


document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("DOMContentLoaded", () => {
        const token = localStorage.getItem("jwtToken");
        console.log("Token being sent:", token);
        if (!token) {
          window.location.href = "/login.html";
          return;
        }
      });
  levelUp();
  attendClass();    
  fetchStats();
});

export function fetchStats() {
  const token = localStorage.getItem("jwtToken");
  console.log("Token being sent:", token);
  
  if (!token) {
      window.location.href = "/login.html";
      return;
  }

  fetch(`http://localhost:3000/api/getStats`, {
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
    let level = stats.level;
    let currentXP = stats.current_xp;
    let xpToNextLevel = stats.xp_to_next_level;
    console.log(stats);

    document.getElementById("level").textContent = level;
    let xpFill = document.getElementById("xpFill");

    let progress = (currentXP / xpToNextLevel) * 100;
    xpFill.style.width = progress + "%";
    xpFill.textContent = currentXP + " / " + xpToNextLevel + " XP";
    updateStats(stats);
  })
  .catch((error) => {
      console.error("Error fetching stats:", error);
  });
}

function updateStats(stats) {
  const statElements = document.querySelectorAll(".stat-info");

  statElements.forEach((statElement) => {
    const statName = statElement.querySelector(".stat-name").textContent.trim().toLowerCase();
    const statValueElement = statElement.querySelector(".stat-value");

    if (stats[statName] !== undefined) {
      statValueElement.textContent = stats[statName];
    }
  });
}

document.getElementById("logoutButton").addEventListener("click", () => {
  localStorage.removeItem("jwtToken");
  window.location.href = "/login.html"; 
});


export async function fetchRandomQuests() {
  try {
      const response = await fetch("http://localhost:3000/api/random-quests");
      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const quests = await response.json();
      console.log("Random Quests:", quests);
      
      return quests; // Return the data if needed for UI updates
  } catch (error) {
      console.error("Error fetching quests:", error);
  }
}

fetchRandomQuests();


showNotification("You have entered the dungeon. Prepare for battle!");
showNotification("Level up!", { strength: 1, agility: 2, combat: 0 }); 




