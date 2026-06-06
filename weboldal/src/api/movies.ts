import type IMovie from "../interfaces/IMovie";

export async function getMovies() {
    let rsp = await fetch("/api/movies", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!rsp.ok) {
        throw new Error("API error: " + rsp.statusText)
    }
    return await rsp.json();
}
export async function postMovie(movie: IMovie) {
    let rsp = await fetch("/api/movies", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(movie)
    });
    return await rsp.json();
}
