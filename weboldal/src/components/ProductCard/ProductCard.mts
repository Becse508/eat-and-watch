import "./ProductCard.css";
import type { Product } from "../../types.ts";

export default class ProductCard extends HTMLElement {
  $price: number = 0;
  $product?: Product;
  $action?: (event: PointerEvent) => void;

  constructor() {
    super();
  }

  setPrice(value: number) {
    this.$price = value;
  }
  setProduct(value: Product) {
    this.$product = value;
  }
  setAction(value: (event: PointerEvent) => void) {
    this.$action = value;
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

    const ingredientsContainer = document.createElement("div");
    ingredientsContainer.append(
      ...(this.$product?.ingredients ?? []).map((x) =>
        Object.assign(document.createElement("p"), {
          textContent: `${x.quantity} ${x.unit} ${x.item}`,
          className: "inter",
        })
      )
    );

    ingredientsContainer.classList.add("ingredients");

    const orderBtn = Object.assign(
      document.createElement("components-button"),
      {
        className: "order-btn black",
        textContent: "Kosárba",
      }
    );
    orderBtn.addEventListener("click", this.$action ?? ((_) => {}));

    const mainRow = document.createElement("div");
    mainRow.className = "main-row";

    mainRow.append(imageWrapper, info);
    this.append(mainRow, ingredientsContainer, orderBtn);
  }
}
