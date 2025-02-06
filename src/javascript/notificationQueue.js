const notificationQueue = [];
let isNotificationVisible = false;

export function showNotification(message, stats = {}) {
    notificationQueue.push({ message, stats });
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
    const { message, stats } = notificationQueue.shift();
    
    const notificationSound = new Audio("src/assets/sounds/notification.mp3");

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
        
        const statsMessage = document.createElement("p");
        statsMessage.innerHTML = "You have gained the following <strong style='color: #00a8ff;'>[Stats]</strong>:";
        statsContainer.appendChild(statsMessage);
        
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
        displayNextNotification();
    });
    
    popupFooter.appendChild(confirmButton);
    
    popup.appendChild(popupHeader);
    popup.appendChild(popupBody);
    popup.appendChild(popupFooter);
    
    popupContainer.appendChild(popup);
    
    document.body.appendChild(popupContainer);
}