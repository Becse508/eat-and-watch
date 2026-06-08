import "./main.ts"
import MovieCarousel from "./components/Carousel/Carousel.mts";
import MovieGrid from "./components/MovieGrid/MovieGrid.mts";
import { getMovies } from "./api/movies.ts";
import type IMovie from "./interfaces/IMovie.ts";

const carousel = document.querySelector("components-moviecarousel") as MovieCarousel;
const nowPlayingGrid = document.querySelector("#now-playing-grid") as MovieGrid;
const comingSoonGrid = document.querySelector("#coming-soon-grid") as MovieGrid;

const movies: IMovie[] = await getMovies();

carousel.movies = movies;

const demoGridMovies = movies.slice(0, 14);

if (nowPlayingGrid) nowPlayingGrid.movies = demoGridMovies;
if (comingSoonGrid) comingSoonGrid.movies = movies.filter(m => new Date(m.releaseDate) > new Date());