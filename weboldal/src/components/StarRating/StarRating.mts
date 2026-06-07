import "./StarRating.css";

export default class StarRating extends HTMLElement {
  connectedCallback() {
    const rating = parseFloat(this.getAttribute("value") || "0");
    const max = parseInt(this.getAttribute("max") || "5");

    let starsHtml = "";
    for (let i = 1; i <= max; i++) {
      if (rating >= i) {
        starsHtml += `<span class="star full">★</span>`;
      } else if (rating >= i - 0.5) {
        starsHtml += `<span class="star half">★</span>`;
      } else {
        starsHtml += `<span class="star empty">★</span>`;
      }
    }

    this.innerHTML = `<div class="star-container">${starsHtml}</div>`;
  }
}