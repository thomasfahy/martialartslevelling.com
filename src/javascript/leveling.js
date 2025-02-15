import { newActiveQuest } from "./activeQuest";

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
                <h3 class="choose-quest-title">${quest.quest_title}</h3>
            `;
            
            const questDescription = document.createElement("p");
            questDescription.innerText = quest.quest_description;
            questTile.appendChild(questDescription);

            // Add Quest Steps
            const stepContainer = document.createElement("div");
            stepContainer.className = "quest-steps";

            const steps = [
                createStepElement(quest.quest_step_name1, quest.quest_step_goal1, quest.quest_step_unit1),
                createStepElement(quest.quest_step_name2, quest.quest_step_goal2, quest.quest_step_unit2),
                createStepElement(quest.quest_step_name3, quest.quest_step_goal3, quest.quest_step_unit3),
                createStepElement(quest.quest_step_name4, quest.quest_step_goal4, quest.quest_step_unit4)
            ];

            steps.forEach(step => {
                if (step !== null) {
                    stepContainer.appendChild(step);
                }
            });

            if (stepContainer.children.length > 0) {
                questTile.appendChild(stepContainer);
            }

            const message = document.createElement("p");
            message.innerText = "You will gain the following Stats";
            message.style.fontWeight = "bold";
            questTile.appendChild(message);

            const statContainer = document.createElement("div");
            statContainer.className = "quest-stat-container";
            
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

            const acceptButton = document.createElement("button");
            acceptButton.className = "accept-quest";
            acceptButton.innerText = "Accept";
            acceptButton.dataset.quest = quest.quest_id;  
            const rejectButton = document.createElement("button");
            rejectButton.className = "reject-quest";
            rejectButton.innerText = "Reject";
            rejectButton.dataset.quest = quest.quest_id;
            
            const questTileButtonContainer = document.createElement("div");
            questTileButtonContainer.classList.add("quest-tile-button-container");

            questTileButtonContainer.appendChild(acceptButton);
            questTileButtonContainer.appendChild(rejectButton);
            questTile.appendChild(questTileButtonContainer);

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
            button.addEventListener("click", async (e) => {
                const questId = e.target.dataset.quest;
                const token = localStorage.getItem("jwtToken");
                const payload = JSON.parse(atob(token.split(".")[1]));
                const userId = payload.user_id;

                try {
                    const response = await fetch("http://localhost:3000/api/accept-quest", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ user_id: userId, quest_id: questId })
                    });
        
                    const data = await response.json();
                    if (data.success) {
                        alert("Quest accepted!");
                        document.body.removeChild(overlay);
                        console.log(data);
                        newActiveQuest();
                    } else {
                        alert("Failed to accept quest.");
                    }
                } catch (error) {
                    console.error("Error accepting quest:", error);
                }
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

export function getQuestSize(size) {
    switch(size) {
        case 1: return "Small Quest";
        case 2: return "Medium Quest";
        case 3: return "Large Quest";
        case 4: return "Boss Fight";
        default: return "Unknown";
    }
}

export function getQuestColor(size) {
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

        let statIcon = '';
        let statColor = '';

        switch (statName) {
            case "Patterns":
                statIcon = "🌀";
                statColor = "#3498db";
                break;
            case "Technique":
                statIcon = "⚙️";
                statColor = "#9b59b6";
                break;
            case "Strength":
                statIcon = "💪";
                statColor = "#e74c3c";
                break;
            case "Agility":
                statIcon = "🏃";
                statColor = "#2ecc71";
                break;
            case "Flexibility":
                statIcon = "🤸";
                statColor = "#f39c12";
                break;
            case "Combat":
                statIcon = "⚔️";
                statColor = "#e67e22";
                break;
            default:
                statIcon = "❓";
                statColor = "#7f8c8d";
                break;
        }

        const statNameColor = statColor;
        const statValueColor = "white";

        const statValueStyle = `font-size: 1.1rem; font-weight: bold; color: ${statValueColor};`;
        
        statElement.innerHTML = `<strong style="color: ${statNameColor};">${statIcon} ${statName}</strong> <span style="${statValueStyle}">+${statValue}</span>`;

        return statElement;
    }
    return null;
}

function createStepElement(stepName, stepGoal, stepUnit) {
    if (stepName && stepGoal > 0) {
        const stepElement = document.createElement("p");
        stepElement.className = "quest-step";
        stepElement.innerHTML = `<strong style="color:rgb(255, 255, 255);">${stepName}:</strong> <span style="color: green;">${stepGoal} ${stepUnit}</span>`;
        return stepElement;
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