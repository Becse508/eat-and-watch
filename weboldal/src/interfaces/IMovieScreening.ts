import type IMovie from "./IMovie";

export default interface IMovieScreening {
    id: number;
    time: Date;
    price: number;
    movie: IMovie;
    tableReservation: number[];
}