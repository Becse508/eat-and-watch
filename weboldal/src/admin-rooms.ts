import "./index.css";
import "./admin-rooms.css";
import "./components/index.ts";
import type IScreening from "./interfaces/IMovieScreening";

const roomsContainer = document.getElementById("rooms-container")!;

function parseLength(lengthStr: string): number {
  if (!lengthStr) return 0;
  const parts = lengthStr.split(':');
  return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

async function fetchScreenings(): Promise<IScreening[]> {
  const res = await fetch("/api/MovieSchedule");
  if (!res.ok) return [];
  return res.json();
}

function renderRooms(screenings: IScreening[]) {
  roomsContainer.innerHTML = "";
  const now = new Date();

  for (let i = 1; i <= 3; i++) {
    const roomScreenings = screenings
      .filter(s => s.room === i)
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

    let currentScreening: IScreening | null = null;
    let nextScreening: IScreening | null = null;
    let recentlyEnded = false;

    for (const s of roomScreenings) {
      const startTime = new Date(s.time);
      const lengthMinutes = parseLength(s.movie.length.toString());
      const endTime = new Date(startTime.getTime() + lengthMinutes * 60000);

      if (now >= startTime && now <= endTime) {
        currentScreening = s;
      } else if (now < startTime && !nextScreening) {
        nextScreening = s;
      } else if (now > endTime && now.getTime() - endTime.getTime() < 60 * 60000) {
        recentlyEnded = true;
      }
    }

    const card = document.createElement("div");
    card.className = "room-card inter";

    let currentHtml = `<div class="meta-text">Jelenleg nincs vetítés.</div>`;
    
    if (currentScreening) {
      const endTime = new Date(new Date(currentScreening.time).getTime() + parseLength(currentScreening.movie.length.toString()) * 60000);
      const diffMs = endTime.getTime() - now.getTime();
      const diffHours = Math.floor(diffMs / 3600000);
      const diffMins = Math.floor((diffMs % 3600000) / 60000);
      const diffSecs = Math.floor((diffMs % 60000) / 1000);
      const timerStr = `${String(diffHours).padStart(2, '0')}:${String(diffMins).padStart(2, '0')}:${String(diffSecs).padStart(2, '0')}`;

      currentHtml = `
        <span class="timer-pill">${timerStr}</span>
        <h3 class="bold">${currentScreening.movie.name}</h3>
        <div class="meta-text">${currentScreening.tableReservation?.length || 0} néző</div>
      `;
    } else if (recentlyEnded) {
      currentHtml = `
        <div class="meta-text" style="text-align: center; margin-top: 30px;">
          A teremben nemrég véget ért egy vetítés.<br>Takarítás után módosítsa a terem menetrendjét.
        </div>
      `;
    }

    let nextHtml = "";
    if (nextScreening) {
      const dateStr = new Date(nextScreening.time).toLocaleString('hu-HU', {
        year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
      });
      nextHtml = `
        <div class="next-screening">
          <h4 class="bold">${nextScreening.movie.name}</h4>
          <div class="meta-text">${dateStr}</div>
        </div>
        <div class="expected-viewers bold">${nextScreening.tableReservation?.length || 0} néző várható</div>
      `;
    } else if (!recentlyEnded && !currentScreening) {
       nextHtml = `<div class="expected-viewers bold">0 néző várható</div>`;
    }

    const currentScreeningId = currentScreening ? currentScreening.id : (nextScreening ? nextScreening.id : '');

    card.innerHTML = `
      <div class="room-header">
        <h2 class="room-title bold">${i}. terem</h2>
        <a href="/admin-room-edit?room=${i}${currentScreeningId ? `&id=${currentScreeningId}` : ''}" class="edit-icon">✎</a>
      </div>
      <div class="current-screening">
        ${currentHtml}
      </div>
      ${nextHtml}
    `;

    roomsContainer.appendChild(card);
  }
}

async function init() {
  const screenings = await fetchScreenings();
  renderRooms(screenings);
  setInterval(async () => {
    const s = await fetchScreenings();
    renderRooms(s);
  }, 10000);
}

init();