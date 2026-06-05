import "./Footer.css";

export default class Footer extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <footer class="footer inter">
        <div class="footer-content">
          <p class="footer-copyright">&copy; 2026 MegDánelz. Minden jog fenntartva.</p>
          <div class="footer-links">
            <a href="/legal#terms-of-service">Felhasználási feltételek</a>
            <span class="footer-separator">•</span>
            <a href="/legal#imprint">Impresszum</a>
          </div>
        </div>
      </footer>
    `;
  }
}
