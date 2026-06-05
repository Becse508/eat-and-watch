import "./index.css";
import "./orders.css";
import "./components/OrderCard/OrderCard.mts";

interface OrderProduct {
  name?: string;
  quantity?: number;
  size?: string;
  notes?: string[];
  extras?: string[];
}

interface Order {
  id?: number | string;
  customer?: { name?: string } | null;
  transaction?: { cashier?: string; tip?: number } | null;
  products?: OrderProduct[];
}

const container = document.getElementById("orders-list");
const doneOrderIds = new Set<string>();
const renderedOrderIds = new Set<string>();

async function fetchOrders(): Promise<Order[]> {
  try {
    const res = await fetch("/api/orders");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as Order[];
  } catch (err) {
    console.error("Failed to load orders", err);
    throw err;
  }
}

function renderOrders(orders: Order[]) {
  if (!container) return;

  if (!orders.length) {
    container.innerHTML = "";
    container.textContent = "Nincsenek aktív rendelések.";
    return;
  }

  const currentOrderIds = new Set(
    orders
      .map((o) => (typeof o.id !== "undefined" ? String(o.id) : null))
      .filter((id): id is string => id !== null)
  );

  for (const orderId of renderedOrderIds) {
    if (!currentOrderIds.has(orderId)) {
      const el = container.querySelector(`[data-order-id="${orderId}"]`);
      if (el) el.remove();
      renderedOrderIds.delete(orderId);
    }
  }

  for (const order of orders) {
    if (typeof order.id !== "undefined") {
      const orderId = String(order.id);

      if (!renderedOrderIds.has(orderId)) {
        renderedOrderIds.add(orderId);

        const el = document.createElement("components-ordercard");
        el.setAttribute("data-order", JSON.stringify(order));
        el.dataset.orderId = orderId;

        if (doneOrderIds.has(orderId)) {
          const card = el.querySelector(".order-card");
          if (card != null) card.classList.add("order-done");
        }

        el.addEventListener("click", async () => {
          const currentOrderId = el.dataset.orderId;
          if (!currentOrderId) return;

          const card = el.querySelector(".order-card");
          const isDone = card?.classList.contains("order-done") ?? false;

          if (!isDone) {
            if (card != null) card.classList.add("order-done");
            doneOrderIds.add(currentOrderId);
          } else {
            try {
              const res = await fetch(`/api/orders/${currentOrderId}`, {
                method: "DELETE",
              });
              if (!res.ok) throw new Error(`HTTP ${res.status}`);
              doneOrderIds.delete(currentOrderId);
              refreshOrders();
            } catch (err) {
              console.error("Failed to delete order", err);
            }
          }
        });

        container.append(el);
      }
    }
  }
}

const FETCH_EVERY = 5000;

async function refreshOrders() {
  try {
    const orders = await fetchOrders();
    renderOrders(orders);
  } catch (err) {
    if (container && !container.childElementCount) {
      container.textContent = "Hiba történt. Próbáld újra később.";
    }
  }
}

refreshOrders();

setInterval(refreshOrders, FETCH_EVERY);
