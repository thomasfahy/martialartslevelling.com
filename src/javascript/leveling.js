export async function levelUp() {
    const levelUpButton = document.getElementById("level-up");

    levelUpButton.addEventListener("click", async () => {
        const quests = await fetchRandomQuests();
        
        const overlay = document.createElement("div");
        overlay.id = "quest-overlay";
        
        const popup = document.createElement("div");
        popup.id = "quest-popup";

        const title = document.createElement("h2");
        title.innerText = "Select a Quest";
        popup.appendChild(title);

        const questContainer = document.createElement("div");
        questContainer.id = "quest-container";

        quests.forEach(quest => {
            const questTile = document.createElement("div");
            questTile.className = "quest-tile";
            questTile.style.padding = "15px";
            questTile.style.borderRadius = "10px";
            questTile.style.textAlign = "center";
            
            questTile.innerHTML = `
                <p style="color: ${getQuestColor(quest.quest_size)}; font-weight: bold;">${getQuestSize(quest.quest_size)}</p>
                <h3>${quest.quest_title}</h3>
            `;
            
            const questDescription = document.createElement("p");
            questDescription.innerText = quest.quest_description;
            questTile.appendChild(questDescription);

            const message = document.createElement("p");
            message.innerText = "Completing this quest will award you -->";
            message.style.fontWeight = "bold";
            questTile.appendChild(message);

            const statContainer = document.createElement("div");
            statContainer.className = "stat-container";
            
            const stats = [
                createStatElement("Patterns", quest.patterns_gain),
                createStatElement("Technique", quest.technique_gain),
                createStatElement("Strength", quest.strength_gain),
                createStatElement("Agility", quest.agility_gain),
                createStatElement("Flexibility", quest.flexibility_gain),
                createStatElement("Combat", quest.combat_gain)
            ];

            stats.forEach(stat => {
                if (stat !== null) {
                    statContainer.appendChild(stat);
                }
            });

            questTile.appendChild(statContainer);

            // Create the Accept and Reject buttons
            const acceptButton = document.createElement("button");
            acceptButton.className = "accept-quest";
            acceptButton.innerText = "Accept Quest";
            acceptButton.dataset.quest = quest.quest_id;  // Set the quest ID to the button's data attribute

            const rejectButton = document.createElement("button");
            rejectButton.className = "reject-quest";
            rejectButton.innerText = "Reject Quest";
            rejectButton.dataset.quest = quest.quest_id;  // Set the quest ID to the button's data attribute

            // Append the buttons to the quest tile
            questTile.appendChild(acceptButton);
            questTile.appendChild(rejectButton);

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

        // Add event listeners for accept and reject buttons
        document.querySelectorAll(".accept-quest").forEach(button => {
            button.addEventListener("click", (e) => {
                const questId = e.target.dataset.quest;
                alert(`Quest Accepted: ${questId}`);
                document.body.removeChild(overlay);
            });
        });

        document.querySelectorAll(".reject-quest").forEach(button => {
            button.addEventListener("click", (e) => {
                const questId = e.target.dataset.quest;
                alert(`Quest Rejected: ${questId}`);
                document.body.removeChild(overlay);
            });
        });
    });
}

function getQuestSize(size) {
    switch(size) {
        case 1: return "Small Quest";
        case 2: return "Medium Quest";
        case 3: return "Large Quest";
        case 4: return "Boss Fight";
        default: return "Unknown";
    }
}

function getQuestColor(size) {
    switch(size) {
        case 1: return "#00a8ff";
        case 2: return "yellow";
        case 3: return "orange";
        case 4: return "darkred";
        default: return "gray";
    }
}

function createStatElement(statName, statValue) {
    if (statValue > 0) {
        const statElement = document.createElement("p");
        statElement.className = "quest-stat-gain-text";
        const statNameColor = "#00a8ff";

        // Display the stat value in green and bold
        const statValueColor = "green";
        const statValueStyle = "font-weight: bold; color: " + statValueColor + ";";

        statElement.innerHTML = `<strong style="color: ${statNameColor};">[${statName}]</strong> <span style="${statValueStyle}">+${statValue}</span>`;
        
        return statElement;
    }
    return null;
}

async function fetchRandomQuests() {
    try {
        const response = await fetch("http://localhost:3000/api/random-quests");
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const quests = await response.json();
        return quests;
    } catch (error) {
        console.error("Error fetching quests:", error);
        return [];
    }
}
