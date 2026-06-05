import "./Title.css";

export default class Title extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.style.color = this.getAttribute("color") ?? "var(--text-primary)";
  }
}
