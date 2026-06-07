import type IMovie from "../../interfaces/IMovie";
import "./Carousel.css";

export default class MovieCarousel extends HTMLElement {
  private _movies: IMovie[] = [];
  private currentIndex = 0;

  private titleEl: HTMLHeadingElement | null = null;
  private descEl: HTMLParagraphElement | null = null;
  private imgEl: HTMLImageElement | null = null;

  connectedCallback() {
    this.renderShellIfReady();
  }

  set movies(value: IMovie[]) {
    this._movies = value.slice(0, 3) ?? [];
    this.currentIndex = 0;
    this.renderShellIfReady();
  }

  get movies() {
    return this._movies;
  }

  private renderShellIfReady() {
    if (!this.isConnected) return;
    if (!this._movies.length) return;

    // only render once
    if (this.titleEl) {
      this.updateView();
      return;
    }

    this.innerHTML = `
      <section class="movie">
        <div class="movie__left">
          <h1 class="movie__title montserrat black">Válogass filmjeink közül</h1>
          <p class="movie__desc montserrat regular">Egy kis nasi kíséretében</p>
        </div>

        <div class="movie__right">
          <button class="movie__nav movie__nav--prev">‹</button>
          <img class="movie__poster" style="cursor: pointer;" onclick="window.location.href='/details?id=${this._movies[this.currentIndex].id}'" />
          <button class="movie__nav movie__nav--next">›</button>
        </div>
      </section>
    `;

    this.titleEl = this.querySelector(".movie__title");
    this.descEl = this.querySelector(".movie__desc");
    this.imgEl = this.querySelector(".movie__poster");

    const prev = this.querySelector(".movie__nav--prev");
    const next = this.querySelector(".movie__nav--next");

    prev?.addEventListener("click", () => this.prev());
    next?.addEventListener("click", () => this.next());

    this.updateView();
  }

  private updateView() {
    if (!this._movies.length) return;

    const movie = this._movies[this.currentIndex];

    if (!this.titleEl || !this.descEl || !this.imgEl) return;

    // this.titleEl.textContent = movie.name;
    // this.descEl.textContent = movie.description;
    this.imgEl.src = movie.image;
    this.imgEl.alt = movie.name;
  }

  private next() {
    if (!this._movies.length) return;

    this.currentIndex =
      (this.currentIndex + 1) % this._movies.length;

    this.updateView();
  }

  private prev() {
    if (!this._movies.length) return;

    this.currentIndex =
      (this.currentIndex - 1 + this._movies.length) %
      this._movies.length;

    this.updateView();
  }
}
