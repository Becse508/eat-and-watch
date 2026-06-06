import type IGenre from "./IGenre";
import type ITag from "./ITag";
import type IScreening from "./IMovieScreening";

export default interface IMovie {
    id: number;
    name: string;
    description: string;
    rating: number;
    genres: IGenre[];
    tags: ITag[];
    length: Date;
    image: string;
    screenings: IScreening[];
}