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
                
                const statClass = `stat-name ${stat}`;
                
                statElement.innerHTML = `<span class="${statClass}">${stat.charAt(0).toUpperCase() + stat.slice(1)}</span> <span>+${value}</span>`;
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
        displayNextNotification();
    });

    popupFooter.appendChild(confirmButton);

    popup.appendChild(popupHeader);
    popup.appendChild(popupBody);
    popup.appendChild(popupFooter);

    popupContainer.appendChild(popup);

    notificationQueue.push(popupContainer);
    if (!isNotificationVisible) {
        displayNextNotification();
    }
}


export function createLevelUpPopup(playerLevel, stats) {
    const popupContainer = document.createElement("div");
    popupContainer.classList.add("popup-container");

    const popup = document.createElement("div");
    popup.classList.add("popup");

    const popupHeader = document.createElement("div");
    popupHeader.classList.add("popup-header");
    const headerTitle = document.createElement("h2");
    headerTitle.textContent = "Level Up!";
    popupHeader.appendChild(headerTitle);

    const popupBody = document.createElement("div");
    popupBody.classList.add("popup-body");

    const messageParagraph = document.createElement("p");
    messageParagraph.innerHTML = `Congratulations! You have reached <strong style="color: #00a8ff;">Level ${playerLevel}</strong>!`;
    popupBody.appendChild(messageParagraph);

    if (stats && Object.keys(stats).length > 0) {
        const statsContainer = document.createElement("div");
        statsContainer.classList.add("notification-stats-container");

        // Limit to the first 6 stats
        const statsEntries = Object.entries(stats).slice(0, 6);

        statsEntries.forEach(([stat, value]) => {
            if (value > 0) {
                const statElement = document.createElement("p");
                const statClass = `stat-name ${stat}`;

                // Display stat with value in bold white
                statElement.innerHTML = `<span class="${statClass}">${stat.charAt(0).toUpperCase() + stat.slice(1)}:</span> <span style="color: white; font-weight: bold;">${value}</span>`;
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
        displayNextNotification();
    });

    popupFooter.appendChild(confirmButton);

    popup.appendChild(popupHeader);
    popup.appendChild(popupBody);
    popup.appendChild(popupFooter);

    popupContainer.appendChild(popup);

    notificationQueue.push(popupContainer);
    if (!isNotificationVisible) {
        displayNextNotification();
    }
}





function displayNextNotification() {
    if (notificationQueue.length === 0) {
        isNotificationVisible = false;
        return;
    }

    isNotificationVisible = true;

    const popupElement = notificationQueue.shift();
    
    document.body.appendChild(popupElement);
}


