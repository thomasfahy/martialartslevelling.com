const notificationQueue = [];
let isNotificationVisible = false;

export function createStatsPopup(message, stats) {
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
        displayNextNotification(); // trigger the next notification after closing this one
    });

    popupFooter.appendChild(confirmButton);

    popup.appendChild(popupHeader);
    popup.appendChild(popupBody);
    popup.appendChild(popupFooter);

    popupContainer.appendChild(popup);

    notificationQueue.push(popupContainer); // Add to the notification queue

    if (!isNotificationVisible) {
        displayNextNotification(); // Show the first notification if not already visible
    }
}

function displayNextNotification() {
    if (notificationQueue.length === 0) {
        isNotificationVisible = false;
        return;
    }

    isNotificationVisible = true;

    const popupElement = notificationQueue.shift(); // Get the next notification in the queue
    
    document.body.appendChild(popupElement); // Append it to the DOM
}

// Call createStatsPopup to add a notification to the queue
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
