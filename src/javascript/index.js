import "../styles/styles.css";
import "../styles/popup.css";
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
  attendClass();    
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


//NOTFICATION POPUP WINDOW

function showNotification(message, stats = {}) {
  const popupContainer = document.createElement("div");
  popupContainer.classList.add("popup-container");
  
  const popup = document.createElement("div");
  popup.classList.add("popup");
  
  const popupHeader = document.createElement("div");
  popupHeader.classList.add("popup-header");
  const headerTitle = document.createElement("h2");
  headerTitle.textContent = "System Message";
  popupHeader.appendChild(headerTitle);
  
  const popupBody = document.createElement("div");
  popupBody.classList.add("popup-body");
  const messageParagraph = document.createElement("p");
  messageParagraph.textContent = message;
  popupBody.appendChild(messageParagraph);
  
  if (stats && Object.keys(stats).length > 0) {
      const statsContainer = document.createElement("div");
      statsContainer.classList.add("notification-stats-container");
      
      const statsMessage = document.createElement("p");
      statsMessage.innerHTML = "You have gained the following <strong style='color: #00a8ff;'>[Stats]</strong>:";
      statsContainer.appendChild(statsMessage);
      
      Object.entries(stats).forEach(([stat, value]) => {
          if (value > 0) {
              const statElement = document.createElement("p");
              statElement.innerHTML = `${stat.charAt(0).toUpperCase() + stat.slice(1)} <span style='color: green;'>+${value}</span>`;
              statsContainer.appendChild(statElement);
          }
      });
      popupBody.appendChild(statsContainer);
  }
  
  const popupFooter = document.createElement("div");
  popupFooter.classList.add("popup-footer");
  const confirmButton = document.createElement("button");
  confirmButton.classList.add("confirm-btn");
  confirmButton.textContent = "Confirm";
  
  confirmButton.addEventListener("click", () => {
      document.body.removeChild(popupContainer);
  });
  
  popupFooter.appendChild(confirmButton);
  
  popup.appendChild(popupHeader);
  popup.appendChild(popupBody);
  popup.appendChild(popupFooter);
  
  popupContainer.appendChild(popup);
  
  document.body.appendChild(popupContainer);
  
}

showNotification("You have entered the dungeon. Prepare for battle!");
showNotification("Level up!", { strength: 1, agility: 2, combat: 0 });



