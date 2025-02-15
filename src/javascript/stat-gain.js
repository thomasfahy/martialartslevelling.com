import { fetchStats } from "./index";
import { createLevelUpPopup } from "./notificationQueue";

export async function updateUserStats(statChanges, xpPerStat = 50) {
  console.log("statChanges");
  const token = localStorage.getItem("jwtToken");

  if (!token) {
    alert("You need to be logged in to update stats!");
    window.location.href = "./login.html";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/getStats", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      alert(`Error getting stats: ${errorMessage}`);
      return;
    }

    const currentStats = await response.json();
    const preLevel = currentStats.level;

    const updatedStats = {
      patterns: currentStats.patterns + (statChanges.patterns || 0),
      technique: currentStats.technique + (statChanges.technique || 0),
      strength: currentStats.strength + (statChanges.strength || 0),
      agility: currentStats.agility + (statChanges.agility || 0),
      flexibility: currentStats.flexibility + (statChanges.flexibility || 0),
      combat: currentStats.combat + (statChanges.combat || 0),
      level: currentStats.level,
      current_xp: currentStats.current_xp + xpPerStat * (statChanges.patterns + statChanges.technique + statChanges.strength + statChanges.agility + statChanges.flexibility + statChanges.combat),
      xp_to_next_level: currentStats.xp_to_next_level,
    };

    if (updatedStats.current_xp >= updatedStats.xp_to_next_level) {
      updatedStats.level += 1;
      updatedStats.current_xp -= updatedStats.xp_to_next_level;
      updatedStats.xp_to_next_level = updatedStats.xp_to_next_level + 40;
    }

    const updateResponse = await fetch("http://localhost:3000/api/updateStats", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedStats),
    });
    if (updateResponse.ok){
      if (updatedStats.level != preLevel){
        createLevelUpPopup(updatedStats.level, updatedStats);
      };
      fetchStats();
    }
    if (!updateResponse.ok) {
      const errorMessage = await updateResponse.text();
      alert(`Error updating stats: ${errorMessage}`);
      return;
    }

  } catch (error) {
    console.error("Error in updating stats:", error);
    alert("An error occurred while updating stats.");
  }
}

  