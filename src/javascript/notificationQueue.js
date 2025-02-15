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

    // Calculate total XP gained
    const totalXP = Object.values(stats).reduce((sum, value) => sum + value, 0) * 50;

    if (totalXP > 0) {
        const xpElement = document.createElement("p");
        xpElement.classList.add("xp-gain");
        xpElement.innerHTML = `<strong>XP Gained:</strong> +${totalXP}`;
        popupBody.appendChild(xpElement);
    }

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

export function createSystemGuidancePopup(youtubeUrl, guidanceText) {
    const popupOverlay = document.createElement("div");
    popupOverlay.classList.add("guidance-popup-overlay");

    const popupContainer = document.createElement("div");
    popupContainer.classList.add("guidance-popup-container");

    const popupTitle = document.createElement("h2");
    popupTitle.textContent = "System Guidance";
    popupTitle.classList.add("guidance-popup-header")

    const popupMessage = document.createElement("p");
    popupMessage.textContent = guidanceText;

    const youtubeEmbed = document.createElement("iframe");

    youtubeEmbed.setAttribute("src", youtubeUrl);
    youtubeEmbed.setAttribute("width", "1280");
    youtubeEmbed.setAttribute("height", "720");
    youtubeEmbed.setAttribute("frameborder", "0");
    youtubeEmbed.removeAttribute("sandbox");
    youtubeEmbed.setAttribute("allow", "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture");
    youtubeEmbed.setAttribute("allowfullscreen", true);
    
    youtubeEmbed.classList.add("guidance-popup-video");

    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.classList.add("guidance-popup-close");

    closeButton.addEventListener("click", () => {
        popupOverlay.remove();
    });

    popupContainer.appendChild(popupTitle);
    popupContainer.appendChild(popupMessage);
    popupContainer.appendChild(youtubeEmbed);
    popupContainer.appendChild(closeButton);

    popupOverlay.appendChild(popupContainer);
    document.body.appendChild(popupOverlay);
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


