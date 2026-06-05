import "./Showcase.css";

export default class Showcase extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    const imageOnLeft = (this.getAttribute("direction") ?? "right") == "left";
    if (imageOnLeft) {
      this.style.flexDirection = "row-reverse";
    }
    const text = this.innerText;
    this.innerHTML = "";

    const image = document.createElement("img");
    image.src = this.getAttribute("image") ?? "";
    image.alt =
      this.getAttribute("alt") ?? this.getAttribute("image") ?? "alt text";
    image.classList.add("showcase-image");

    const container = document.createElement("div");
    container.classList.add("flex-direction-column");

    const title = document.createElement("components-title");
    title.innerText = this.getAttribute("title") ?? "";
    title.classList.add("komika");
    title.style.color = this.getAttribute("color") ?? "var(--text-primary)";
    if (imageOnLeft) {
      title.classList.add("text-start");
    } else {
      title.classList.add("text-end");
    }

    const paragraph = document.createElement("p");
    paragraph.classList.add("inter", "font-regular-24px");
    paragraph.style.color = "var(--text-primary)";
    if (imageOnLeft) {
      paragraph.classList.add("text-start");
    } else {
      paragraph.classList.add("text-end");
    }
    paragraph.innerText = text;
    container.append(title, paragraph);
    this.append(container, image);
  }
}
