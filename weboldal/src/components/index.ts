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
import MovieGrid from "./MovieGrid/MovieGrid.mts"
import StarRating from "./StarRating/StarRating.mts";
import MovieCarousel from "./Carousel/Carousel.mts";

const elements = [
  { name: "navbar", element: Navbar },
  { name: "button", element: Button },
  { name: "title", element: Title },
  { name: "showcase", element: Showcase },
  { name: "productcard", element: ProductCard },
  { name: "cart-productcard", element: CartProductCard },
  { name: "notification", element: NotificationElem },
  { name: "notification-container", element: NotificationContainer },
  { name: "footer", element: Footer },
  { name: "theme-toggle", element: ThemeToggle },
  { name: "moviegrid", element: MovieGrid },
  { name: "starrating", element: StarRating },
  { name: "moviecarousel", element: MovieCarousel },
];

elements.map(({ name, element }) => customElements.define("components-" + name, element));
