import "../styles/styles.css";

document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("DOMContentLoaded", () => {
        const token = localStorage.getItem("jwtToken");
        console.log("Token being sent:", token);
        if (!token) {
          window.location.href = "/login.html";
          return;
        }
      });

  fetch(`/api/stats`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`, // Send token in header
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
