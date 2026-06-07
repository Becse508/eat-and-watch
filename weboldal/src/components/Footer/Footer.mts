import "./Footer.css";

export default class Footer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="footer inter">
        <div class="footer-content">
          <div class="footer-left">
            <h2 class="montserrat brand-text">Eat&Watch</h2>
            <p class="footer-copyright inter">Kis Becse Gáspár, Maixner Dominik &copy; ${new Date().getFullYear()}</p>
          </div>
          <div class="footer-right footer-links inter">
            <a href="/legal#imprint">Impresszum</a>
            <a href="/legal#terms-of-service">Általános Szerződési Feltételek</a>
          </div>
        </div>
      </footer>
    `;
  }
}