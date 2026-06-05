import "./NotificationContainer.css";

export default class NotificationContainer extends HTMLElement {
  constructor() {
    super();
  }

  static get() {
    let container = document.querySelector("components-notification-container");

    if (!container) {
        container = document.createElement("components-notification-container");
        document.body.appendChild(container);
    }

    return container;
}
}
