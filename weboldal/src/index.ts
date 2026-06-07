import "./main.ts"
import MovieCarousel from "./components/Carousel/Carousel.mts";
import MovieGrid from "./components/MovieGrid/MovieGrid.mts";
import { getMovies } from "./api/movies.ts";

const carousel = document.querySelector("components-moviecarousel") as MovieCarousel;
const nowPlayingGrid = document.querySelector("#now-playing-grid") as MovieGrid;
const comingSoonGrid = document.querySelector("#coming-soon-grid") as MovieGrid;

const movies = await getMovies();

carousel.movies = movies;

const demoGridMovies = [...movies, ...movies, ...movies].slice(0, 14);

if (nowPlayingGrid) nowPlayingGrid.movies = demoGridMovies;
if (comingSoonGrid) comingSoonGrid.movies = demoGridMovies;