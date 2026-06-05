import "./done.css";
import "./index.css";

const params = new URLSearchParams(window.location.search);
let remainingMinutes = parseInt(params.get("minutes") || "5", 10);

const timerEl = document.getElementById("timer");
const timerDisplay = document.querySelector(".timer-display");
const headingEl = document.querySelector(".thank-you-heading");
const subheadingEl = document.querySelector(".thank-you-subheading");

if (timerEl) {
  timerEl.textContent = `Kb. ${remainingMinutes} perc`;
}

const countdownInterval = setInterval(() => {
  remainingMinutes--;

  if (remainingMinutes > 0) {
    if (timerEl) {
      timerEl.textContent = `Kb. ${remainingMinutes} perc`;
    }
  } else {
    clearInterval(countdownInterval);

    if (timerDisplay) {
      timerDisplay.remove();
    }

    if (headingEl) {
      headingEl.textContent = "Kész!";
    }

    if (subheadingEl) {
      subheadingEl.textContent = "Jó étvágyat!";
    }
  }
}, 60000);
