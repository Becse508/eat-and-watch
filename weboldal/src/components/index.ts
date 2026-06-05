import Navbar from "./Navbar/Navbar.mts";
import Button from "./Button/Button.mts";
import Title from "./Title/Title.mts";
import Showcase from "./Showcase/Showcase.mts";
import ProductCard from "./ProductCard/ProductCard.mts";
import CartProductCard from "./CartProductCard/CartProductCard.mts";
import NotificationElem from "./Notification/NotificationElem.mts";
import NotificationContainer from "./NotificationContainer/NotificationContainer.mts";
import Footer from "./Footer/Footer.mts";
import ThemeToggle from "./ThemeToggle/ThemeToggle.mts";

const elements = [
  { name: "components-navbar", element: Navbar },
  { name: "components-button", element: Button },
  { name: "components-title", element: Title },
  { name: "components-showcase", element: Showcase },
  { name: "components-productcard", element: ProductCard },
  { name: "components-cart-productcard", element: CartProductCard },
  { name: "components-notification", element: NotificationElem },
  { name: "components-notification-container", element: NotificationContainer },
  { name: "components-footer", element: Footer },
  { name: "components-theme-toggle", element: ThemeToggle },
];

elements.map(({ name, element }) => customElements.define(name, element));
