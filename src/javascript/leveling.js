
export function levelUp() {
    const token = localStorage.getItem("jwtToken");
    const levelUpButton = document.getElementById("level-up");
    
    levelUpButton.addEventListener("click", () => {
        // Create overlay
        const overlay = document.createElement("div");
        overlay.id = "quest-overlay";
        
        // Create popup
        const popup = document.createElement("div");
        popup.id = "quest-popup";

        // Title
        const title = document.createElement("h2");
        title.innerText = "Select a Quest";
        popup.appendChild(title);

        // Generate quest tiles
        const questContainer = document.createElement("div");
        questContainer.id = "quest-container";
        
        const quests = [
            { name: "Goblin Hunt", size: "Small Quest", color: "#00a8ff", time: "10 min", stats: ["Strength"], description: "Hunt down a pack of goblins." },
            { name: "Cave Exploration", size: "Medium Quest", color: "yellow", time: "30 min", stats: ["Endurance", "Dexterity"], description: "Explore a deep cave and uncover its secrets." },
            { name: "Dragon's Lair", size: "Boss Fight", color: "darkred", time: "60 min", stats: ["Strength", "Intelligence"], description: "Face a mighty dragon in battle." }
        ];

        quests.forEach(quest => {
            const questTile = document.createElement("div");
            questTile.className = "quest-tile"
            questTile.style.padding = "15px";
            questTile.style.borderRadius = "10px";
            questTile.style.textAlign = "center";
            
            questTile.innerHTML = `
                <h3>${quest.name}</h3>
                <p style="color: ${quest.color}; font-weight: bold;">${quest.size}</p>
                <p><strong>Time:</strong> ${quest.time}</p>
                <p><strong>Stats:</strong> ${quest.stats.join(", ")}</p>
                <p>${quest.description}</p>
                <button class="accept-quest" data-quest="${quest.name}">Accept</button>
                <button class="reject-quest">Reject</button>
            `;
            
            questContainer.appendChild(questTile);
        });
    
        popup.appendChild(questContainer);
        
        const closeButton = document.createElement("button");
        closeButton.id = "quest-close-button";
        closeButton.innerText = "Close";

        closeButton.addEventListener("click", () => {
            document.body.removeChild(overlay);
        });
        popup.appendChild(closeButton);

        overlay.appendChild(popup);
        document.body.appendChild(overlay);

        document.querySelectorAll(".accept-quest").forEach(button => {
            button.addEventListener("click", (e) => {
                alert(`Quest Accepted: ${e.target.dataset.quest}`);
                document.body.removeChild(overlay);
            });
        });
        document.querySelectorAll(".reject-quest").forEach(button => {
            button.addEventListener("click", () => {
                alert("Quest Rejected");
            });
        });
    });
}
