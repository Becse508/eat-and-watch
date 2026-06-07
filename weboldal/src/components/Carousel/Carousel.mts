import type IMovie from "../../interfaces/IMovie";
import "./Carousel.css";

// az animaciokhoz hasznalt stackoverflow threadek:
// https://stackoverflow.com/questions/39673540/an-infinite-carousel-with-vanilla-javascript
// https://stackoverflow.com/questions/58243505/how-to-make-an-infinite-js-carousel-infinity-problem

export default class MovieCarousel extends HTMLElement {
  private _movies: IMovie[] = [];
  private currentIndex = 0;
  private posters: HTMLImageElement[] = [];
  private limit = 5;

  connectedCallback() {
    this.renderShellIfReady();
  }

  set movies(value: IMovie[]) {
    this._movies = (this.limit == 0 ? value : value.slice(0, this.limit)) || [];
    this.currentIndex = 0;
    this.renderShellIfReady();
  }

  get movies() {
    return this._movies;
  }

  private renderShellIfReady() {
    if (!this.isConnected) return;
    if (!this._movies.length) return;

    if (!this.querySelector(".movie")) {
      this.innerHTML = `
        <section class="movie">
          <div class="movie__left">
            <h1 class="movie__title montserrat black">Válogass filmjeink közül</h1>
            <p class="movie__desc montserrat regular">Egy kis nasi kíséretében</p>
          </div>

          <div class="movie__right">
            <button class="movie__nav movie__nav--prev">‹</button>
            <div class="movie__carousel-container">
              </div>
            <button class="movie__nav movie__nav--next">›</button>
          </div>
        </section>
      `;

      const prevBtn = this.querySelector(".movie__nav--prev");
      const nextBtn = this.querySelector(".movie__nav--next");

      prevBtn?.addEventListener("click", () => this.prev());
      nextBtn?.addEventListener("click", () => this.next());
    }

    const container = this.querySelector(".movie__carousel-container");
    if (container) {
      container.innerHTML = ""; 
      this.posters = [];

      this._movies.forEach((movie, index) => {
        const img = document.createElement("img");
        img.src = movie.image;
        img.alt = movie.name;
        img.className = "movie__poster";
        
        img.addEventListener("click", () => {
          if (this.currentIndex === index) {
            window.location.href = `/details?id=${movie.id}`;
          } else {
            this.currentIndex = index;
            this.updateView();
          }
        });

        container.appendChild(img);
        this.posters.push(img);
      });
    }

    this.updateView();
  }

  private updateView() {
    if (!this._movies.length || !this.posters.length) return;

    const len = this._movies.length;

    this.posters.forEach((poster, i) => {
      let offset = (i - this.currentIndex) % len;
      
      if (offset > len / 2) offset -= len;
      if (offset < -len / 2) offset += len;

      poster.classList.remove(
        "movie__poster--curr",
        "movie__poster--prev",
        "movie__poster--next",
        "movie__poster--hidden-left",
        "movie__poster--hidden-right"
      );

      if (offset === 0) {
        poster.classList.add("movie__poster--curr");
      } else if (offset === -1) {
        poster.classList.add("movie__poster--prev");
      } else if (offset === 1) {
        poster.classList.add("movie__poster--next");
      } else if (offset < 0) {
        poster.classList.add("movie__poster--hidden-left");
      } else {
        poster.classList.add("movie__poster--hidden-right");
      }
    });
  }

  private next() {
    if (!this._movies.length) return;
    this.currentIndex = (this.currentIndex + 1) % this._movies.length;
    this.updateView();
  }

  private prev() {
    if (!this._movies.length) return;
    this.currentIndex = (this.currentIndex - 1 + this._movies.length) % this._movies.length;
    this.updateView();
  }
}