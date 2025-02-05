
export function attendClass() {
    const token = localStorage.getItem("jwtToken");
    const attendButton = document.getElementById("attend-class");
    if (!attendButton) {
      console.error("Button with id 'attend-class' not found.");
      return;
    }
    attendButton.addEventListener("click", async () => {
      console.error("Attend class event added");
      try {
        const response = await fetch('/api/attendClass', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ increment: 1 }),
        });
        if (response.ok) {
          const data = await response.json();
          showNotification("Congratulations! You have attended class today");
        } else {
          console.error("Failed to increment stats.");
        }
      } catch (error) {
        console.error("Error making API call:", error);
      }
    });
  }

  