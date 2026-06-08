import "./movies.css";
import "./components/index.ts";
import { getMovies } from "./api/movies.ts";
import MovieGrid from "./components/MovieGrid/MovieGrid.mts";
import type IMovie from "./interfaces/IMovie.ts";
import type IGenre from "./interfaces/IGenre.ts";
import { getGenres } from "./api/genres.ts";

const grid = document.getElementById("movies-grid") as MovieGrid;
const searchInput = document.getElementById("search-input") as HTMLInputElement;
const minLengthInput = document.getElementById("length-min") as HTMLInputElement;
const maxLengthInput = document.getElementById("length-max") as HTMLInputElement;
const adultCheckbox = document.getElementById("adult-checkbox") as HTMLInputElement;
const genreSelect = document.getElementById("genre") as HTMLSelectElement;
const noResultsEl = document.getElementById("no-results");

let allMovies: IMovie[] = [];
let allGenres: IGenre[] = [];

function parseLengthToMinutes(timeStr: string | any): number {
    if (!timeStr) return 0;
    if (typeof timeStr === 'string') {
        const parts = timeStr.split(':');
        if (parts.length >= 2) {
            return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
        }
    }
    return 0;
}

function filterMovies() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const minLength = minLengthInput.value ? parseInt(minLengthInput.value, 10) : 0;
    const maxLength = maxLengthInput.value ? parseInt(maxLengthInput.value, 10) : Infinity;
    const showAdultContent = adultCheckbox.checked;

    const filtered = allMovies.filter(movie => {
        const matchesSearch = movie.name.toLowerCase().includes(searchTerm) || 
                             (movie.originalTitle && movie.originalTitle.toLowerCase().includes(searchTerm));
        
        const movieMinutes = parseLengthToMinutes(movie.length);
        const matchesLength = movieMinutes >= minLength && movieMinutes <= maxLength;
        const matchesAdult = showAdultContent ? true : movie.ageRestriction < 18;
        const matchesGenre = genreSelect.value ? movie.genres.some(g => g.id.toString() === genreSelect.value) : true;
        

        return matchesSearch && matchesLength && matchesAdult && matchesGenre;
    });

    if (grid) {
        grid.movies = filtered;
    }

    if (noResultsEl) {
        noResultsEl.style.display = filtered.length === 0 ? "block" : "none";
    }
}

async function init() {
    try {
        allMovies = await getMovies();
        filterMovies();
    } catch (error) {
        console.error("Hiba a filmek betöltésekor:", error);
    }

    try {
        allGenres = await getGenres();
        genreSelect.innerHTML = `<option value="">Minden műfaj</option>` +
            allGenres.map(g => `<option value="${g.id}">${g.name}</option>`).join("");
    } catch (error) {
        console.error("Hiba a műfajok betöltésekor:", error);
    }

    searchInput?.addEventListener("input", filterMovies);
    minLengthInput?.addEventListener("input", filterMovies);
    maxLengthInput?.addEventListener("input", filterMovies);
    genreSelect?.addEventListener("change", filterMovies);
    adultCheckbox?.addEventListener("change", filterMovies);
}

init();