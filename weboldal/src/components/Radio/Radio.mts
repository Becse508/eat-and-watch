import "./Radio.css";

export default class ComponentsRadio extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const name = this.getAttribute("name") ?? "";
    const value = this.getAttribute("value") ?? "";
    const label = this.getAttribute("label") ?? "";
    const checked = this.hasAttribute("checked");
    const disabled = this.hasAttribute("disabled");

    const id = `${name}-${value}-${Math.random().toString(36).slice(2)}`;

    this.innerHTML = `
      <label class="radio">
        <input
          type="radio"
          id="${id}"
          name="${name}"
          value="${value}"
          ${checked ? "checked" : ""}
          ${disabled ? "disabled" : ""}
        />
        <span class="radio__dot" aria-hidden="true"></span>
        <span class="radio__label">${label}</span>
      </label>
    `;
  }
}

customElements.define("components-radio", ComponentsRadio);
