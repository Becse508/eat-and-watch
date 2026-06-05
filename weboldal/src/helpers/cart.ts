import type { Product } from "../types";

export const CART_KEY = "megdanielz_cart";

export interface OrderProduct {
    product: Product,
    quantity: number
};

export function getCart(): OrderProduct[] {
  return JSON.parse(localStorage.getItem(CART_KEY) ?? "[]");
}

export function setCart(cart: OrderProduct[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(product: Product) {
    let cart = getCart();
    let i = cart.findIndex(x => x.product.id == product.id);

    if (i != -1)
        ++cart[i].quantity;
    else
        cart.push({product: product, quantity: 1});

    setCart(cart);
}

export function setQuantityOfProductInCart(id: number, quantity: number) {
    let cart = getCart();
    let i = cart.findIndex(x => x.product.id == id);
    if (i == -1)
        return;

    cart[i].quantity = quantity;
    setCart(cart);
}

export function removeProduct(id: number) {
    let cart = getCart();
    cart = cart.filter(x => x.product.id !== id);
    setCart(cart);
}