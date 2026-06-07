import "./details.css";
import "./components/index.ts";
import type IMovie from "./interfaces/IMovie";

const params = new URLSearchParams(window.location.search);
const movieId = params.get("id");

async function loadMovie(id: string): Promise<IMovie | null> {
  try {
    const res = await fetch(`/api/movies/${id}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function init() {
  const container = document.getElementById("details-container");
  if (!container) return;

  if (!movieId) {
    container.innerHTML = `<h2 class="inter" style="color: var(--text-primary);">Nem található film azonosító. Próbáld a Főoldalról.</h2>`;
    return;
  }

  const movie = await loadMovie(movieId);
  if (!movie) {
    container.innerHTML = `<h2 class="inter" style="color: var(--text-primary);">A keresett film nem található az adatbázisban.</h2>`;
    return;
  }

  const genres = movie.genres?.length > 0 ? movie.genres.map(g => g.name).join(", ") : "-";
  const characters = movie.mainCharacters?.length > 0 ? movie.mainCharacters.join(", ") : "-";
  
  const releaseDate = movie.releaseDate 
    ? movie.releaseDate.toString().replace(/-/g, ". ") + "." 
    : "-";

  const percentage = movie.rating > 0 ? Math.round((movie.rating / 5) * 10) : 90;

  container.innerHTML = `
    <div class="movie-details-layout inter">
      <div class="movie-info-left">
        <h1 class="movie-title-large montserrat black">${movie.name}</h1>

        <div class="metadata-table">
          <span class="metadata-label">Eredeti cím</span>
          <span class="metadata-value">${movie.originalTitle || movie.name}</span>

          <span class="metadata-label">Rendező</span>
          <span class="metadata-value">${movie.director || "-"}</span>

          <span class="metadata-label">Megjelent</span>
          <span class="metadata-value">${releaseDate}</span>

          <span class="metadata-label">Főszereplők</span>
          <span class="metadata-value">${characters}</span>

          <span class="metadata-label">Műfaj</span>
          <span class="metadata-value">${genres}</span>

          <span class="metadata-label">Eredeti nyelv</span>
          <span class="metadata-value">Angol</span>
          <span class="metadata-label">Korhatár</span>
          <span class="metadata-value">${movie.ageRestriction}</span>
        </div>

        <div class="rating-section">
          <components-starrating value="${movie.rating}" max="5"></components-starrating>
          <span class="rating-text inter">A felhasználók ${percentage}%-ának tetszett ez a film.</span>
        </div>

        <div class="action-row">
          <div class="age-restriction-circle montserrat">${movie.ageRestriction}</div>
          <components-button 
            background="var(--accent-color)" 
            color="#000000" 
            radius="24px" 
            font="montserrat"
            weight="bold"
            style="font-size: 24px; padding: 14px 40px;"
          >
            Jegyfoglalás
          </components-button>
        </div>
      </div>

      <div class="movie-poster-right">
        <img src="${movie.image || 'https://via.placeholder.com/400x600'}" alt="${movie.name}" />
      </div>
    </div>
  `;
}

init();