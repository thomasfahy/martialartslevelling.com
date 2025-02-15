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
      createAttendClassConfirmationPopup(updateUserStats) 
    });
  }

  export function createAttendClassConfirmationPopup(onConfirm) {
    const popupOverlay = document.createElement("div");
    popupOverlay.classList.add("confirmation-popup-overlay");

    const popupContainer = document.createElement("div");
    popupContainer.classList.add("confirmation-popup-container");

    const popupTitle = document.createElement("h2");
    popupTitle.textContent = "System Message";

    const popupMessage = document.createElement("p");
    popupMessage.textContent = "Please confirm if you have attended a full length session of Martial Arts today.";

    const yesButton = document.createElement("button");
    yesButton.textContent = "Yes";
    yesButton.classList.add("confirmation-popup-button", "confirmation-popup-yes");

    const noButton = document.createElement("button");
    noButton.textContent = "No";
    noButton.classList.add("confirmation-popup-button", "confirmation-popup-no");

    const confirmationButtonContainer = document.createElement("div");
    confirmationButtonContainer.classList.add("confirmation-button-container");
    confirmationButtonContainer.appendChild(yesButton);
    confirmationButtonContainer.appendChild(noButton);

    yesButton.addEventListener("click", () => {
      createStatsPopup(
        "Well Done! You have attended class and become stronger.",
        {
            strength: 1,
            agility: 1,
            flexibility: 1,
            combat: 1,
            technique: 1,
            patterns: 1
        }
      );
      updateUserStats({
        patterns: 1,
        technique: 1,
        strength: 1,
        agility: 1,
        flexibility: 1,
        combat: 1,
      });
        popupOverlay.remove();
    });

    noButton.addEventListener("click", () => {
        popupOverlay.remove();
    });

    popupContainer.appendChild(popupTitle);
    popupContainer.appendChild(popupMessage);
    popupContainer.appendChild(confirmationButtonContainer);
    popupOverlay.appendChild(popupContainer);
    document.body.appendChild(popupOverlay);
}
