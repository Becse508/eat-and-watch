import "./cart.css";
import "./components/index.ts";
import "./components/CartProductCard/CartProductCard.mts";
import "./components/Radio/Radio.mts";
import type CartProductCard from "./components/CartProductCard/CartProductCard.mts";
import {
  getCart,
  removeProduct,
  setCart,
  setQuantityOfProductInCart,
} from "./helpers/cart.ts";
import NotificationElem from "./components/Notification/NotificationElem.mts";
import capitalize from "./helpers/capitalize.ts";

const cont = document.getElementById("products");
const totalEl = document.getElementById("order-total");
const finalizeBtn = document.querySelector<HTMLElement>(".finalize-button");

let animationFrameId: number | null = null;

cont?.append(
  ...getCart().map((op) => {
    let x = op.product;

    const card = document.createElement(
      "components-cart-productcard"
    ) as CartProductCard;
    card.setAttribute("input-value", op.quantity.toString());
    card.setAttribute("name", capitalize(x.name));
    card.setAttribute(
      "img",
      x.image != ""
        ? x.image
        : "https://rotatingsandwiches.com/wp-content/uploads/2023/04/bub-and-pops-italian-hoagie.gif"
    );
    card.setPrice(x.price);
    card.setIngredients(x.ingredients);
    if (typeof x.id !== "undefined") {
      card.dataset.productId = String(x.id);
    }
    return card;
  })
);
for (const element of cont?.children ?? []) {
  if (!(element instanceof HTMLElement)) continue;

  const removeBtn = element.querySelector<HTMLElement>(
    ".main-row components-button"
  );
  removeBtn?.addEventListener("click", () => {
    const productId = Number(element.dataset.productId ?? "0");

    removeProduct(productId);
    updateTotal();

    element.classList.add("slide-out");

    element.addEventListener("transitionend", function handler(e) {
      if (e.propertyName === "transform") {
        element.remove();
        element.removeEventListener("transitionend", handler);
      }
    });
  });
}

function updateTotal() {
  if (!cont || !totalEl) return;

  const newTotal = getCart().reduce(
    (sum, op) => sum + op.product.price * op.quantity,
    0
  );

  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  animateTotal(
    Number(totalEl.textContent?.replace(/\D/g, "") ?? 0),
    newTotal,
    500
  );
}

function animateTotal(from: number, to: number, duration: number) {
  const startTime = performance.now();

  function step(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const eased = easeOutQuad(progress);
    const value = Math.round(from + (to - from) * eased);

    if (totalEl) totalEl.textContent = `${value} Ft`;

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(step);
    } else {
      animationFrameId = null;
    }
  }

  animationFrameId = requestAnimationFrame(step);
}

function easeOutQuad(t: number) {
  return t * (2 - t);
}

cont?.addEventListener("input", (evt) => {
  const target = evt.target as HTMLElement | null;
  if (
    target instanceof HTMLInputElement &&
    target.classList.contains("qty-input")
  ) {
    const cardEl = target.closest<HTMLElement>("components-cart-productcard");
    if (!cardEl) return;

    const id = Number(cardEl.dataset.productId);
    if (isNaN(id)) return;

    const quantity = Number(target.value);
    if (isNaN(quantity) || quantity < 0) return;

    setQuantityOfProductInCart(id, quantity);
    updateTotal();
  }
});

updateTotal();

async function submitOrder() {
  // if (!cont || getCart().length === 0) return;

  const params = new URLSearchParams(window.location.search);
  const room = params.get("room");
  const table = params.get("table");

  if(!room || !table) {
    NotificationElem.send("Hiba", "Érvénytelen kérés!", "red");
    return;
  }

  const orderProducts = getCart()
    .map((op) => {
      const qty = op.quantity;
      const safeQty = Number.isFinite(qty) ? Math.max(0, qty) : 0;
      return op.product.id
        ? { productId: op.product.id, quantity: safeQty }
        : null;
    })
    .filter((item) => item && item.quantity > 0) as {
    productId: number;
    quantity: number;
  }[];

  const payload = {
    transaction: {
      cashier: "website",
      tip: 0,
    },
    room: Number(room),
    table: Number(table),
    orderProducts,
  };

  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
    const contentType = res.headers.get("content-type");
    let errorMessage = `HTTP ${res.status}`;

    if (contentType?.includes("application/json")) {
      const body = await res.json();
      if (body.error == "EmptyOrder") {
        NotificationElem.send("Üres rendelés", "Nem adhatsz le üres rendelést!", "red");
        return;
      }

      errorMessage = body.message ?? JSON.stringify(body);
    } else {
      errorMessage = await res.text();
    }

    throw new Error(errorMessage);
  }

    const cookingTime = getCart().reduce((total, op) => {
      const timePerItem = op.product.type === 0 ? 5 : 1;
      return total + timePerItem * op.quantity;
    }, 0);

    window.location.href = `/order?room=${room}&table=${table}`;
  } catch (err) {
    console.error(err);
    alert("Nem sikerült leadni a rendelést. Próbáld újra.");
  }

  setCart([]);
}

finalizeBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  submitOrder();
});

function resizeProductsArea() {
  const productsEl = document.getElementById("products");
  const summaryEl = document.querySelector<HTMLElement>(".order-summary");
  if (!productsEl || !summaryEl) return;

  const rect = productsEl.getBoundingClientRect();
  const available = window.innerHeight - rect.top - summaryEl.offsetHeight - 12;
  if (available > 0) {
    productsEl.style.maxHeight = `${available}px`;
  }
}

resizeProductsArea();
window.addEventListener("resize", resizeProductsArea);
