import "./main.ts"
import MovieCarousel from "./components/index/Carousel/Carousel.mts";
import { getMovies } from "./api/movies.ts";

const carousel = document.querySelector(
  "components-moviecarousel"
) as MovieCarousel;
carousel.movies = [
    {
        id: 0,
        image: "https://media.tenor.com/6bLqzMcCDzEAAAAM/marmalady-loading-cat.gif",
        name: "",
        description: "",
        rating: 0,
        genres: [],
        tags: [],
        screenings: [],
        length: new Date(0),
        releaseDate: new Date(0),
        originalTitle: "",
        director: "",
        ageRestriction: 0,
        mainCharacters: []
    }
]
carousel.movies = await getMovies();

