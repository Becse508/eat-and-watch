import "./Title.css";

export default class Title extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.style.color = this.getAttribute("color") ?? "var(--text-primary)";
    this.dataset.role = this.getAttribute("title-role") ?? "generic";

    if(this.dataset.role === "nav") {
      this.style.cursor = "pointer";
      this.addEventListener("click", () => {
        window.location.href = "/";
      });
    } else {
      this.classList.add("with-scroll-animation")
    }
  }
}
