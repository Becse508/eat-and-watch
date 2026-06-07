import "./index.css";
import "./book.css";
import "./components/index.ts";
import type IMovie from "./interfaces/IMovie";
import NotificationElem from "./components/Notification/NotificationElem.mts";

const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");
let currentScreeningId: number | null = null;
let currentPrice = 0;
let selectedSeat: number | null = null;

const titleEl = document.getElementById("movie-title")!;
const seatsContainer = document.getElementById("seats-container")!;
const priceDisplay = document.getElementById("price-display")!;
const bookBtn = document.getElementById("book-btn")!;

const seatLayout = [
  [ { id: 1 }, { id: 2, taken: true }, { id: 3 }, { id: 4 }, { id: 5, taken: true }, { id: 6 }, { id: 7, taken: true } ],
  [ { id: 8, taken: true }, { id: 9 }, { id: 10 }, { id: 11 }, { id: 12 }, { id: 13 }, { id: 14, taken: true }, { id: 15 } ],
  [ { id: 16, taken: true }, { id: 17 }, { id: 18 }, { id: 19, taken: true }, { id: 20 }, { id: 21 }, { id: 22 } ]
];

async function init() {
  if (!movieId) {
    titleEl.textContent = "Hiba: Nincs film kiválasztva!";
    return;
  }

  try {
    const res = await fetch(`/api/movies/${movieId}`);
    if (!res.ok) throw new Error("Film nem található");
    const movie: IMovie = await res.json();
    titleEl.textContent = movie.name;

    if (movie.screenings && movie.screenings.length > 0) {
      currentScreeningId = movie.screenings[0].id;
      currentPrice = movie.screenings[0].price || 1099;
      priceDisplay.textContent = `${currentPrice} Ft`;
    } else {
      titleEl.textContent = "Nincs elérhető vetítés ehhez a filmhez.";
      bookBtn.style.display = "none";
    }

    renderSeats();
  } catch (err) {
    console.error(err);
    titleEl.textContent = "Hiba történt a betöltés során.";
  }
}

function renderSeats() {
  seatsContainer.innerHTML = "";
  
  seatLayout.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "seat-row";
    
    row.forEach(seatData => {
      const seat = document.createElement("div");
      seat.className = `seat ${seatData.taken ? "taken" : ""}`;
      seat.textContent = seatData.taken ? "" : seatData.id.toString();
      
      if (!seatData.taken) {
        seat.addEventListener("click", () => selectSeat(seatData.id, seat));
      }
      
      rowDiv.appendChild(seat);
    });
    
    seatsContainer.appendChild(rowDiv);
  });
}

function selectSeat(id: number, element: HTMLElement) {
  if (selectedSeat === id) {
    selectedSeat = null;
    element.classList.remove("selected");
    return;
  }

  document.querySelectorAll(".seat.selected").forEach(el => el.classList.remove("selected"));
  
  selectedSeat = id;
  element.classList.add("selected");
}

bookBtn.addEventListener("click", async () => {
  if (selectedSeat === null) {
    NotificationElem.send("Figyelem", "Kérlek válassz ki egy asztalt a foglaláshoz!", "#dd862f");
    return;
  }
  if (!currentScreeningId) return;

  try {
    const res = await fetch("/api/ticket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ screeningId: currentScreeningId, amount: 1 })
    });

    if (!res.ok) throw new Error("Sikertelen foglalás");
    
    const ticketCode = Math.random().toString(36).substring(2, 13).toUpperCase();
    
    window.location.href = `/ticket-success?movieId=${movieId}&code=${ticketCode}`;
  } catch (err) {
    console.error(err);
    NotificationElem.send("Hiba", "Nem sikerült lefoglalni a jegyet.", "red");
  }
});

init();