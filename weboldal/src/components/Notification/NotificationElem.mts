import NotificationContainer from "../NotificationContainer/NotificationContainer.mts";
import "./NotificationElem.css";

export default class NotificationElem extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const title = Object.assign(document.createElement("h3"), {
        textContent: this.getAttribute("title") ?? "",
        className: "inter"
    });

    const description = Object.assign(document.createElement("p"), {
        textContent: this.getAttribute("description") ?? "",
        className: "montserrat"
    })

    this.append(title, description);

    const color = this.getAttribute("color");
    if (color) {
      this.style.borderLeft = `4px solid ${color}`
    }
  }
  
  static send(title: string, description: string, color: string) {
    const notif = document.createElement("components-notification");

    notif.setAttribute("title", title);
    notif.setAttribute("description", description);
    notif.setAttribute("color", color);

    const container = NotificationContainer.get();

    container.appendChild(notif);

    notif.addEventListener("animationend", () => {
        notif.remove();
        if (!container.children.length) {
            container.remove();
        }
    });
  }
}
