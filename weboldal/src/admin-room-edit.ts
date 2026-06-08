import "./index.css";
import "./admin-room-edit.css";
import "./components/index.ts";
import { getMovies } from "./api/movies.ts";
import type IMovie from "./interfaces/IMovie";
import NotificationElem from "./components/Notification/NotificationElem.mts";

const params = new URLSearchParams(window.location.search);
const initialRoom = params.get("room") || "1";
const screeningId = params.get("id");

const roomBtns = document.querySelectorAll(".room-btn");
const startTimeInput = document.getElementById("start-time") as HTMLInputElement;
const endTimeInput = document.getElementById("end-time") as HTMLInputElement;
const movieSearch = document.getElementById("movie-search") as HTMLInputElement;
const movieGrid = document.getElementById("movie-selector-grid")!;
const stopBtn = document.getElementById("stop-movie-btn") as HTMLButtonElement;
const saveBtn = document.getElementById("save-btn") as HTMLButtonElement;

let movies: IMovie[] = [];
let selectedMovieId: number | null = null;
let selectedRoom = parseInt(initialRoom, 10);
let isCurrentlyPlaying = false;

function parseLength(lengthStr: string): number {
  if (!lengthStr) return 0;
  const parts = lengthStr.split(':');
  return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

function toLocalISOString(date: Date) {
  const tzo = -date.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num: number) {
            return (num < 10 ? '0' : '') + num;
        };
  return date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate()) +
      'T' + pad(date.getHours()) +
      ':' + pad(date.getMinutes());
}

function updateEndTime() {
  if (!startTimeInput.value || !selectedMovieId) {
    endTimeInput.value = "";
    return;
  }
  const movie = movies.find(m => m.id === selectedMovieId);
  if (!movie) return;

  const start = new Date(startTimeInput.value);
  const end = new Date(start.getTime() + parseLength(movie.length.toString()) * 60000);
  endTimeInput.value = toLocalISOString(end);
}

function renderMovies(filterText = "") {
  movieGrid.innerHTML = "";
  const filtered = movies.filter(m => m.name.toLowerCase().includes(filterText.toLowerCase()));
  
  filtered.forEach(m => {
    const div = document.createElement("div");
    div.className = `movie-item inter ${selectedMovieId === m.id ? 'selected' : ''}`;
    div.innerHTML = `
      <img src="${m.image || 'https://via.placeholder.com/200x300'}" alt="${m.name}" />
      <span>${m.name}</span>
    `;
    div.addEventListener("click", () => {
      selectedMovieId = m.id;
      renderMovies(filterText);
      updateEndTime();
    });
    movieGrid.appendChild(div);
  });
}

roomBtns.forEach(btn => {
  btn.addEventListener("click", (e) => {
    roomBtns.forEach(b => b.classList.remove("active"));
    const target = e.target as HTMLButtonElement;
    target.classList.add("active");
    selectedRoom = parseInt(target.dataset.room || "1", 10);
  });
});

movieSearch.addEventListener("input", (e) => renderMovies((e.target as HTMLInputElement).value));
startTimeInput.addEventListener("input", updateEndTime);

async function loadData() {
  movies = await getMovies();
  
  roomBtns.forEach(b => {
    if (b.getAttribute("data-room") === initialRoom) {
      b.classList.add("active");
    } else {
      b.classList.remove("active");
    }
  });

  if (screeningId) {
    const res = await fetch(`/api/MovieSchedule/${screeningId}`);
    if (res.ok) {
      const screening = await res.json();
      selectedRoom = screening.room;
      selectedMovieId = screening.movie.id;
      
      const st = new Date(screening.time);
      startTimeInput.value = toLocalISOString(st);
      
      const lengthMinutes = parseLength(screening.movie.length.toString());
      const endTime = new Date(st.getTime() + lengthMinutes * 60000);
      const now = new Date();
      
      if (now >= st && now <= endTime) {
        isCurrentlyPlaying = true;
        stopBtn.style.display = "block";
      }

      roomBtns.forEach(b => {
        b.classList.toggle("active", b.getAttribute("data-room") == selectedRoom.toString());
      });
    }
  }

  renderMovies();
  updateEndTime();
}

saveBtn.addEventListener("click", async () => {
  if (!selectedMovieId || !startTimeInput.value) {
    NotificationElem.send("Hiba", "Válassz filmet és időpontot!", "red");
    return;
  }

  const localDate = new Date(startTimeInput.value);
  const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
  
  const payload = {
    movieId: selectedMovieId,
    time: utcDate.toISOString(),
    price: 1500, // Alapértelmezett ár
    room: selectedRoom
  };

  const method = screeningId ? "PATCH" : "POST";
  const url = screeningId ? `/api/MovieSchedule?id=${screeningId}` : "/api/MovieSchedule";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (res.ok) {
    window.location.href = "/admin-rooms";
  } else {
    NotificationElem.send("Hiba", "Sikertelen mentés", "red");
  }
});

stopBtn.addEventListener("click", async () => {
  if (!screeningId) return;
  if (confirm("Biztosan leállítod a filmet?")) {
    const res = await fetch(`/api/MovieSchedule/${screeningId}`, { method: "DELETE" });
    if (res.ok) {
      window.location.href = "/admin-rooms";
    }
  }
});

loadData();