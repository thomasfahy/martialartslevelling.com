import { fetchStats } from "./index";
import { createStatsPopup } from "./notificationQueue.js";
import { updateUserStats } from "./stat-gain.js";

export function attendClass() {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      window.location.href="/login.html";
      return;
  }
    const attendButton = document.getElementById("attend-class");
    if (!attendButton) {
      console.error("Button with id 'attend-class' not found.");
      return;
    }
    attendButton.addEventListener("click", async () => {
      updateUserStats({
        patterns: 1,
        technique: 1,
        strength: 1,
        agility: 1,
        flexibility: 1,
        combat: 1,
      });
      createStatsPopup(
        "You attended class and gained the following stats:",
        {
            strength: 1,
            agility: 1,
            flexibility: 1,
            combat: 1,
            technique: 1,
            patterns: 1
        }
      );
    });
  }

