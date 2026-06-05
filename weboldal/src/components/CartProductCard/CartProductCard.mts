import "./CartProductCard.css";
import type { Ingredient } from "../../types.ts";

export default class CartProductCard extends HTMLElement {
  $price: number = 0;
  $ingredients: Ingredient[] = [];

  constructor() {
    super();
  }

  setPrice(value: number) {
    this.$price = value;
  }
  setIngredients(value: Ingredient[]) {
    this.$ingredients = value;
  }

  connectedCallback() {
    const data = (this as any).product || null;

    const imageWrapper = document.createElement("div");
    imageWrapper.className = "image-wrapper";

    imageWrapper.append(
      Object.assign(document.createElement("img"), {
        src:
          this.getAttribute("img") ??
          "https://rotatingsandwiches.com/wp-content/uploads/2023/04/bub-and-pops-italian-hoagie.gif",
      })
    );

    // quantity control
    const quantityControl = document.createElement("div");
    quantityControl.className = "quantity-control";
    quantityControl.addEventListener("click", (e) => e.stopPropagation());

    const decBtn = Object.assign(document.createElement("button"), {
      type: "button",
      className: "qty-btn qty-dec",
      textContent: "−",
    });

    const qtyInput = Object.assign(document.createElement("input"), {
      type: "number",
      className: "qty-input inter",
      min: "1",
      max: "20",
      value: this.getAttribute("input-value") ?? "0",
    });

    const incBtn = Object.assign(document.createElement("button"), {
      type: "button",
      className: "qty-btn qty-inc",
      textContent: "+",
    });

    const clamp = () => {
      const min = parseInt(qtyInput.min || "1", 10);
      const max = parseInt(qtyInput.max || "20", 10);
      const val = parseInt(qtyInput.value || String(min), 10);
      qtyInput.value = String(
        Math.min(Math.max(min, isNaN(val) ? min : val), max)
      );
    };

    decBtn.addEventListener("click", () => {
      qtyInput.value = String(parseInt(qtyInput.value, 10) - 1);
      qtyInput.dispatchEvent(new Event("input", { bubbles: true }));
    });

    incBtn.addEventListener("click", () => {
      qtyInput.value = String(parseInt(qtyInput.value, 10) + 1);
      qtyInput.dispatchEvent(new Event("input", { bubbles: true }));
    });
    qtyInput.addEventListener("input", clamp);

    quantityControl.append(decBtn, qtyInput, incBtn);

    const nameEl = Object.assign(document.createElement("h3"), {
      textContent: data?.name ?? this.getAttribute("name") ?? "???",
      className: "inter bold",
    });

    const priceEl = Object.assign(document.createElement("p"), {
      textContent:
        typeof data?.price === "number"
          ? `${data.price} Ft`
          : typeof this.$price === "number" && !Number.isNaN(this.$price)
          ? `${this.$price} Ft`
          : this.getAttribute("price") ?? "",
      className: "item-price inter regular",
    });

    const info = document.createElement("div");
    info.className = "item-info";
    info.append(nameEl, priceEl);

    const removeBtn = Object.assign(
      document.createElement("components-button"),
      {
        textContent: "⨯",
      }
    );
    removeBtn.setAttribute("background", "transparent");
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
    });

    const quantityContainer = Object.assign(document.createElement("div"), {
      className: "quantity-container",
    });
    quantityContainer.append(quantityControl, removeBtn);

    const ingredientsContainer = document.createElement("div");
    ingredientsContainer.append(
      ...this.$ingredients.map((x) =>
        Object.assign(document.createElement("p"), {
          textContent: `${x.quantity} ${x.unit} ${x.item}`,
          className: "inter",
        })
      )
    );

    ingredientsContainer.classList.add("ingredients", "collapsed");
    this.addEventListener("click", () => {
      ingredientsContainer.classList.toggle("expanded");
    });

    const mainRow = document.createElement("div");
    mainRow.className = "main-row";

    mainRow.append(imageWrapper, info, quantityContainer);
    this.append(mainRow, ingredientsContainer);
  }
}
