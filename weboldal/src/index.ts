import "./main.ts"
import MovieCarousel from "./components/index/Carousel/Carousel.mts";
import { getMovies } from "./api/movies.ts";

const carousel = document.querySelector(
  "components-moviecarousel"
) as MovieCarousel;

carousel.movies = await getMovies();
