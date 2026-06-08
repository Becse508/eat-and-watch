import "./OrderCard.css";
import type { Order } from "../../types";

export default class OrderCard extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const raw = this.getAttribute("data-order");
    if (!raw) return;

    let order: Order | null = null;
    try {
      order = JSON.parse(raw) as Order;
    } catch (err) {
      console.error("Invalid order data", err);
      return;
    }

    const { id, transaction, products = [], room, table } = order;

    const card = document.createElement("article");
    card.className = "order-card";

    const title = document.createElement("h2");
    title.className = "order-card__title";
    title.textContent = `Rendelés #${id ?? "?"}`;

    const list = document.createElement("div");
    list.className = "order-card__list";

    if (products.length === 0) {
      const empty = document.createElement("p");
      empty.className = "order-card__empty";
      empty.textContent = "Nincsenek tételek";
      list.append(empty);
    } else {
      products.forEach((item) => {
        const row = document.createElement("div");
        row.className = "order-card__item";

        const mainLine = document.createElement("div");
        mainLine.className = "order-card__line";
        const qty = item.quantity;
        const name = item.product.name;
        mainLine.textContent = `${qty} ${name}`;
        row.append(mainLine);

        const ingredients = item.product.ingredients;
        ingredients.forEach((ing) => {
          const extraLine = document.createElement("div");
          extraLine.className = "order-card__extra";
          const label = ing.item;
          const qtyText =
            typeof ing.quantity === "number"
              ? ` ${ing.quantity} ${ing.unit}`
              : "";
          extraLine.innerHTML = `- <span class="bold">${qtyText}</span> ${label}`;
          row.append(extraLine);
        });

        if (item.product?.note) {
          const noteLine = document.createElement("div");
          noteLine.className = "order-card__extra";
          noteLine.innerHTML = `- <span class="italic">${item.product.note}</span>`;
          row.append(noteLine);
        }

        list.append(row);
      });
    }

    card.append(title);
    if (transaction?.cashier || transaction?.tip !== undefined) {
      const meta = document.createElement("div");
      meta.className = "order-card__meta";
      const cashier =  `Terem: ${room}`
      const tip =`Asztal: ${table}`
      meta.textContent = [cashier, tip].filter(Boolean).join(" · ");
      if (meta.textContent) card.append(meta);
    }
    card.append(list);

    this.replaceChildren(card);
  }
}

customElements.define("components-ordercard", OrderCard);
