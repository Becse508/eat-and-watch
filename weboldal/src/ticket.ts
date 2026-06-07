import "./ticket.css";
import JsBarcode from "jsbarcode";
import type IMovie from "./interfaces/IMovie";

const params = new URLSearchParams(window.location.search);
const movieId = params.get("movieId");
const code = params.get("code") || "ISMERETLEN";

const nameEl = document.getElementById("t-movie-name")!;
const lengthEl = document.getElementById("t-movie-length")!;
const barcodeSvg = document.getElementById("barcode-svg")!;

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
  JsBarcode(barcodeSvg, code, {
    format: "CODE128",
    width: 3,
    height: 120,
    displayValue: true,
    font: "monospace",
    fontSize: 28,
    lineColor: "#000000",
    margin: 10
  });

  if (movieId) {
    try {
      const res = await fetch(`/api/movies/${movieId}`);
      if (res.ok) {
        const movie: IMovie = await res.json();
        nameEl.textContent = movie.name;
        lengthEl.textContent = formatLength(movie.length);
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