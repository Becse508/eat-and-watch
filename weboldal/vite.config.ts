import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5144",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        order: "order.html",
        done: "done.html",
        orders: "orders.html",
        cart: "cart.html",
      },
    },
  },
});
