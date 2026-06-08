import type IGenre from "../interfaces/IGenre";

export async function getGenres(): Promise<IGenre[]> {
    let rsp = await fetch("/api/genres", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!rsp.ok) {
        throw new Error("API error: " + rsp.statusText)
    }
    return (await rsp.json()).map((x: any) => ({ id: x.id, name: x.name }));
}