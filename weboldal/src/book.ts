import "./index.css";
import "./book.css";
import "./components/index.ts";
import type IMovie from "./interfaces/IMovie";
import NotificationElem from "./components/Notification/NotificationElem.mts";
import type IMovieScreening from "./interfaces/IMovieScreening.ts";


let selectedDate: string | null = null;
let selectedTime: string | null = null;
const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");
let currentScreeningId: number | null = null;
let currentPrice = 0;
let selectedSeats: number[] = [];


const dateContainer = document.getElementById("date-container")!;
const timeContainer = document.getElementById("time-container")!;
const titleEl = document.getElementById("movie-title")!;
const seatsContainer = document.getElementById("seats-container")!;
const priceDisplay = document.getElementById("price-display")!;
const bookBtn = document.getElementById("book-btn")!;
const screeningContainer = document.getElementById("screening-container")!;

async function init() {
  if (!movieId) {
    titleEl.textContent = "Hiba: Nincs film kiválasztva!";
    bookBtn.style.display = "none";
    return;
  }

  try {
    const res = await fetch(`/api/movies/${movieId}`);
    if (!res.ok) throw new Error("Film nem található");
    
    const movie: IMovie = await res.json();
    titleEl.textContent = movie.name;

    if (movie.screenings && movie.screenings.length > 0) {
      renderScreenings(movie.screenings);
      bookBtn.style.display = "flex";
    } else {
      titleEl.textContent = "Nincs elérhető vetítés ehhez a filmhez.";
      screeningContainer.innerHTML = "";
      bookBtn.style.display = "none";
    }
  } catch (err) {
    console.error(err);
    titleEl.textContent = "Hiba történt a betöltés során.";
    bookBtn.style.display = "none";
  }
}function renderScreenings(screenings: IMovieScreening[]) {
  const grouped = screenings.reduce((acc, s) => {
    const date = new Date(s.time).toLocaleDateString('hu-HU');
    if (!acc[date]) acc[date] = [];
    acc[date].push(s);
    return acc;
  }, {} as Record<string, IMovieScreening[]>);

  Object.keys(grouped).forEach(date => {
    const btn = document.createElement("button");
    btn.className = "date-btn";
    btn.textContent = date;
    btn.addEventListener("click", () => {
      if (selectedDate == date) return;
      document.querySelectorAll(".date-btn").forEach(el => el.classList.remove("active"));
      btn.classList.add("active");
      selectedDate = date;
      selectedTime = null;
      renderTimes(grouped[date]);
    });
    dateContainer.appendChild(btn);
  });
}
function renderTimes(screenings: IMovieScreening[]) {
  timeContainer.innerHTML = "";
  screenings.forEach(s => {
    const btn = document.createElement("button");
    btn.className = "time-btn";
    btn.textContent = new Date(s.time).toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' });
    btn.addEventListener("click", () => {
      document.querySelectorAll(".time-btn").forEach(el => el.classList.remove("active"));
      btn.classList.add("active");
      
      selectedTime = btn.textContent;
      selectScreening(s);
    });
    timeContainer.appendChild(btn);
  });
}

function selectScreening(s: IMovieScreening) {
  currentScreeningId = s.id;
  currentPrice = s.price;
  selectedSeats = [];
  renderSeats(s.tableReservation || []);
  updatePriceDisplay();
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
    selectedSeats = [];
    element.classList.remove("selected");
  } else {
    document.querySelectorAll(".seat.selected").forEach(el => el.classList.remove("selected"));
    
    selectedSeats = [id];
    element.classList.add("selected");
  }
  updatePriceDisplay();
}

function updatePriceDisplay() {
  priceDisplay.textContent = `${currentPrice * selectedSeats.length} Ft`;
}

bookBtn.addEventListener("click", async () => {
  if (selectedSeats.length === 0) {
    NotificationElem.send("Figyelem", "Kérlek válassz ki egy asztalt a foglaláshoz!", "#dd862f");
    return;
  }
  if (selectedDate == null || selectedTime == null) {
    NotificationElem.send("Figyelem", "Kérlek válassz ki egy dátumot és időpontot!", "#dd862f");
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
    NotificationElem.send("Hiba", "Nem sikerült lefoglalni a jegyet.", "red");
  }
});

init();
