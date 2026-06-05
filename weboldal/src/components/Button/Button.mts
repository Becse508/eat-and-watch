import extractColor from "../../helpers/extractColor";
import "./Button.css";

export default class Button extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const backgroundColor =
      this.getAttribute("background") ?? "var(--button-primary)";
    const textColor = this.getAttribute("color") ?? "var(--text-primary)";
    const href = this.getAttribute("url");

    this.style.backgroundColor = extractColor(backgroundColor);
    this.style.color = extractColor(textColor);

    this.style.borderRadius = this.getAttribute("radius") ?? "12px";

    this.classList.add(
      this.getAttribute("font") ?? "montserrat",
      this.getAttribute("weight") ?? "regular",
      "no-select"
    );

    const hrefString = href != null ?`href="${href}"` : ""

    this.innerHTML = `
      <a ${hrefString}>${this.innerHTML}</a>
    `;

    this.addEventListener("click", (ev) => {
      const target = ev.target as HTMLElement;
      if (target && target.tagName.toLowerCase() === "a") return;

      if (href && href !== "#") {
        ev.preventDefault();
        window.location.href = href;
      }
    });
  }
}
