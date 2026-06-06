import type IIngredient from "./IIngredient";

export default interface IProduct {
    id: number;
    ingredients: IIngredient[];
    name: string;
    type: number;
    price: number;
    note: string;
    image: string;
}