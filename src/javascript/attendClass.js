import { fetchStats } from "./index";
import { showNotification } from "./notificationQueue.js";

export function attendClass() {
    const token = localStorage.getItem("jwtToken");
    const attendButton = document.getElementById("attend-class");
    if (!attendButton) {
      console.error("Button with id 'attend-class' not found.");
      return;
    }
    attendButton.addEventListener("click", async () => {
      try {
        const response = await fetch('http://localhost:3000/api/attendClass', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ increment: 1 }),
        });
        if (response.ok) {
          const data = await response.json();
          fetchStats();
          showNotification("Congratulations, You have attended class today!", { patterns: 1, technique: 1, strength: 1, agility: 1, flexibility: 1, combat: 1 });

        } else {
          console.error("Failed to increment stats.");
        }
      } catch (error) {
        console.error("Error making API call:", error);
      }
    });
  }

  