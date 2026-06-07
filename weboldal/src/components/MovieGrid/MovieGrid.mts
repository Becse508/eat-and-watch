import "./MovieGrid.css";
import type IMovie from "../../interfaces/IMovie";

export default class MovieGrid extends HTMLElement {
  private _movies: IMovie[] = [];

  constructor() {
    super();
  }

  set movies(value: IMovie[]) {
    this._movies = value || [];
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  private render() {
    if (!this.isConnected) return;
    
    this.innerHTML = `
      <div class="movie-grid">
        ${this._movies.map(m => `
          <div class="movie-grid-item inter" data-id="${m.id}">
            <img src="${m.image || 'https://via.placeholder.com/200x300'}" alt="${m.name}" loading="lazy" />
            <p class="bold">${m.name}</p>
          </div>
        `).join('')}
      </div>
    `;
  }
}