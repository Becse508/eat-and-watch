import type IProduct from "./IProduct";

export default interface IOrder {
    id: number;
    products: IProduct[];
}