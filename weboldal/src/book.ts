import "./index.css";
import "./book.css";
import "./components/index.ts";
import type IMovie from "./interfaces/IMovie";
import NotificationElem from "./components/Notification/NotificationElem.mts";

const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");
let currentScreeningId: number | null = null;
let currentPrice = 0;
let selectedSeats: number[] = [];

const titleEl = document.getElementById("movie-title")!;
const seatsContainer = document.getElementById("seats-container")!;
const priceDisplay = document.getElementById("price-display")!;
const bookBtn = document.getElementById("book-btn")!;

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

    let reservedTables: number[] = [];
    if (movie.screenings && movie.screenings.length > 0) {
      currentScreeningId = movie.screenings[0].id;
      currentPrice = movie.screenings[0].price || 1099;
      console.log(movie.screenings[0]);
      
      reservedTables = movie.screenings[0].tableReservation || [];
    } else {
      titleEl.textContent = "Nincs elérhető vetítés ehhez a filmhez.";
      bookBtn.style.display = "none";
      return;
    }

    renderSeats(reservedTables);
    updatePriceDisplay();
  } catch (err) {
    console.error(err);
    titleEl.textContent = "Hiba történt a betöltés során.";
  }
}

function renderSeats(reservedTables: number[]) {
  seatsContainer.innerHTML = "";
  const layout = [7, 9, 7];
  let currentId = 1;
  
  layout.forEach(seatCount => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "seat-row";
    
    for (let i = 0; i < seatCount; i++) {
      const seatId = currentId++;
      const isTaken = reservedTables.includes(seatId);
      
      const seat = document.createElement("div");
      seat.className = `seat ${isTaken ? "taken" : ""}`;
      seat.textContent = isTaken ? "" : seatId.toString();
      
      if (!isTaken) {
        seat.addEventListener("click", () => selectSeat(seatId, seat));
      }
      
      rowDiv.appendChild(seat);
    }
    
    seatsContainer.appendChild(rowDiv);
  });
}

function selectSeat(id: number, element: HTMLElement) {
  if (selectedSeats.includes(id)) {
    selectedSeats = selectedSeats.filter(s => s !== id);
    element.classList.remove("selected");
  } else {
    selectedSeats.push(id);
    element.classList.add("selected");
  }
  updatePriceDisplay();
}

function updatePriceDisplay() {
  priceDisplay.textContent = `${currentPrice * selectedSeats.length} Ft`;
}

bookBtn.addEventListener("click", async () => {
  if (selectedSeats.length === 0) {
    NotificationElem.send("Figyelem", "Kérlek válassz ki legalább egy asztalt a foglaláshoz!", "#dd862f");
    return;
  }
  if (!currentScreeningId) return;

  try {
    const res = await fetch("/api/ticket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ screeningId: currentScreeningId, tables: selectedSeats })
    });

    if (!res.ok) throw new Error("Sikertelen foglalás");
    
    const ticketCodes: string[] = await res.json();
    
    window.location.href = `/ticket-success?movieId=${movieId}&code=${encodeURIComponent(ticketCodes[0])}`;
  } catch (err) {
    console.error(err);
    NotificationElem.send("Hiba", "Nem sikerült lefoglalni a jegyeket.", "red");
  }
});

init();