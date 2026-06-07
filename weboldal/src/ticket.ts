import "./ticket.css";
import QRCode from "qrcode";
import type IMovie from "./interfaces/IMovie";

const params = new URLSearchParams(window.location.search);
const movieId = params.get("movieId");
const code = params.get("code") || "ISMERETLEN";

const nameEl = document.getElementById("t-movie-name")!;
const lengthEl = document.getElementById("t-movie-length")!;
const roomEl = document.getElementById("t-movie-room")!;
const qrCanvas = document.getElementById("qrcode-canvas") as HTMLCanvasElement;

function formatLength(timeStr: string | any) {
  if (!timeStr) return "-";
  const parts = timeStr.toString().split(":");
  if (parts.length >= 2) {
    const hours = parseInt(parts[0], 10);
    const mins = parseInt(parts[1], 10);
    if (hours > 0) return `${hours} óra ${mins} perc`;
    return `${mins} perc`;
  }
  return timeStr;
}

async function init() {
  QRCode.toCanvas(qrCanvas, code, {
    width: 250,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  }, function (error) {
    if (error) console.error("QR kód generálási hiba", error);
  });

  if (movieId) {
    try {
      const res = await fetch(`/api/movies/${movieId}`);
      if (res.ok) {
        const movie: IMovie = await res.json();
        nameEl.textContent = movie.name;
        lengthEl.textContent = formatLength(movie.length);
        roomEl.textContent = `${movie.screenings[0]?.room || "-"}`;
      }
    } catch (err) {
      console.error("Film betöltési hiba", err);
    }
  }

  setTimeout(() => {
    window.print();
  }, 1000);
}

init();