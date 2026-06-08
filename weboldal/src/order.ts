import "./order.css";
import "./components/index.ts";
import "./components/ProductCard/ProductCard.mts";
import ProductCard from "./components/ProductCard/ProductCard.mts";
import "./components/Radio/Radio.mts";
import type { Product } from "./types.ts";
import { addToCart, getCart } from "./helpers/cart.ts";
import NotificationElem from "./components/Notification/NotificationElem.mts";
import capitalize from "./helpers/capitalize.ts";
import type Button from "./components/Button/Button.mts";

async function loadProducts(): Promise<Product[]> {
  try {
    const res = await fetch("/api/products");
    if (!res.ok) throw new Error(res.statusText);

    const products = await res.json();
    return products;
  } catch (err) {
    console.error("Failed to fetch products:", err);
    return [];
  }
}

  const params = new URLSearchParams(window.location.search);
  const room = params.get("room");
  const table = params.get("table");

  if(!room || !table) {
    NotificationElem.send("Hiba", "Érvénytelen kérés!", "red");
    setTimeout(() => {
      window.location.href = "/";
    }, 3000);
  }

  const cartBtn = document.querySelector(".cart-btn") as Button;
  cartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = `/cart?room=${room}&table=${table}`;
  });

const products = await loadProducts();
const cont = document.getElementById("products");
const cartTextEl = document.querySelector(".cart-btn a span");


const categories = [
  { type: 0, name: "Ételek" },
  { type: 1, name: "Italok" },
  { type: 2, name: "Köret" },
];

categories.forEach((category) => {
  const categoryProducts = products.filter((p) => p.type === category.type);

  if (categoryProducts.length > 0) {
    const header = document.createElement("h2");
    header.className = "category-header";
    header.innerHTML = `
      <span class="category-name">${category.name}</span>
      <span class="category-toggle">▼</span>
    `;

    const categoryContainer = document.createElement("div");
    categoryContainer.className = "category-products";
    categoryContainer.dataset.categoryType = String(category.type);

    categoryProducts.forEach((x) => {
      const card = document.createElement(
        "components-productcard"
      ) as ProductCard;
      card.setAttribute("name", capitalize(x.name));
      card.setAttribute(
        "img",
        x.image != ""
          ? x.image
          : "https://rotatingsandwiches.com/wp-content/uploads/2023/04/bub-and-pops-italian-hoagie.gif"
      );
      card.setPrice(x.price);
      card.setProduct(x);
      card.setAction((_) => {
        addToCart(x);
        cartTextEl!.textContent = `Kosár (${getCart().reduce(
          (acc, next) => acc + next.quantity,
          0
        )})`;
        NotificationElem.send(
          "Hozzáadva a kosárhoz!",
          `${x.name} - ${x.price}Ft`,
          "lime"
        );
      });

      if (typeof x.id !== "undefined") {
        card.dataset.productId = String(x.id);
      }
      categoryContainer.appendChild(card);
    });

    header.addEventListener("click", () => {
      const isCollapsed = categoryContainer.classList.toggle("collapsed");
      const toggle = header.querySelector(".category-toggle");
      if (toggle) {
        toggle.textContent = isCollapsed ? "▶" : "▼";
      }
    });

    cont?.appendChild(header);
    cont?.appendChild(categoryContainer);
  }
});

cartTextEl!.textContent = `Kosár (${getCart().reduce(
  (acc, next) => acc + next.quantity,
  0
)})`;
