import "./components/index.ts";

const params = new URLSearchParams(window.location.search);
const movieId = params.get("movieId");
const code = params.get("code");

const wrapper = document.getElementById("download-btn-wrapper")!;

if (movieId && code) {
  wrapper.innerHTML = `
    <components-button 
      url="/ticket?movieId=${movieId}&code=${code}" 
      background="#d9d9d9" 
      color="#000" 
      radius="32px" 
      font="montserrat" 
      weight="bold" 
      style="font-size: 32px; padding: 16px 48px;">
      Jegy letöltése
    </components-button>
  `;
} else {
  wrapper.innerHTML = `<p style="color: red; font-family: sans-serif;">Hibás azonosító!</p>`;
}