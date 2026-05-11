import "server-only";

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

import { z } from "zod";

import { getProducts } from "@/lib/products";
import { getJson, listBlobs, putJson, hasBlobToken } from "@/lib/blob-json";
import type { Locale, Order, OrderStatus } from "@/lib/types";

const createOrderSchema = z.object({
  locale: z.enum(["fr", "ar"]).default("fr"),
  customer: z.object({
    name: z.string().min(1),
    phone: z.string().min(3),
    address: z.string().min(3),
    notes: z.string().optional(),
  }),
  cart: z.array(z.object({ productId: z.string().min(1), quantity: z.number().int().min(1) })).min(1),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

const memoryOrders: Map<string, Order> = new Map();
const ORDERS_FILE = path.join(process.cwd(), "data", "orders.json");

// Charger les commandes depuis le fichier au démarrage
function loadOrdersFromFile(): void {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, "utf-8");
      const orders = JSON.parse(data) as Order[];
      orders.forEach(order => memoryOrders.set(order.id, order));
    }
  } catch (error) {
    console.warn("Failed to load orders from file:", error);
  }
}

// Sauvegarder les commandes dans le fichier
function saveOrdersToFile(): void {
  try {
    const ordersDir = path.dirname(ORDERS_FILE);
    if (!fs.existsSync(ordersDir)) {
      fs.mkdirSync(ordersDir, { recursive: true });
    }
    const orders = Array.from(memoryOrders.values());
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
  } catch (error) {
    console.warn("Failed to save orders to file:", error);
  }
}

// Charger les commandes au démarrage du module
loadOrdersFromFile();

export function orderStatusLabel(status: OrderStatus) {
  return (
    {
      pending: "Pending",
      confirmed: "Confirmed",
      preparing: "Preparing",
      ready: "Ready",
      completed: "Completed",
      cancelled: "Cancelled",
    } satisfies Record<OrderStatus, string>
  )[status];
}

export async function createOrder(input: unknown): Promise<Order> {
  const parsed = createOrderSchema.parse(input);
  const products = await getProducts();

  const items = parsed.cart.map((line) => {
    const product = products.find((p) => p.id === line.productId);
    if (!product) throw new Error(`Unknown productId: ${line.productId}`);
    const lineTotal = product.price * line.quantity;
    return {
      productId: product.id,
      name: product.name[parsed.locale as Locale],
      unitPrice: product.price,
      quantity: line.quantity,
      lineTotal,
    };
  });

  const totals = items.reduce(
    (acc, it) => {
      acc.items += it.lineTotal;
      return acc;
    },
    { items: 0 },
  );

  const order: Order = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: "pending",
    locale: parsed.locale,
    customer: parsed.customer,
    items,
    totals: { items: totals.items, grandTotal: totals.items },
  };

  if (hasBlobToken()) {
    await putJson(`orders/${order.id}.json`, order);
  } else {
    memoryOrders.set(order.id, order);
    saveOrdersToFile(); // Sauvegarder dans le fichier local
  }

  return order;
}

export async function getOrder(id: string): Promise<Order | null> {
  if (hasBlobToken()) {
    return await getJson<Order>(`orders/${id}.json`);
  }
  return memoryOrders.get(id) ?? null;
}

export async function listOrders(): Promise<Order[]> {
  if (!hasBlobToken()) return Array.from(memoryOrders.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const blobs = await listBlobs("orders/");
  const orders: Order[] = [];
  for (const b of blobs) {
    if (!b.pathname.endsWith(".json")) continue;
    const order = await getJson<Order>(b.pathname);
    if (order) orders.push(order);
  }
  return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
  const existing = await getOrder(id);
  if (!existing) throw new Error("Order not found");
  const updated: Order = { ...existing, status };

  if (hasBlobToken()) {
    await putJson(`orders/${id}.json`, updated);
  } else {
    memoryOrders.set(id, updated);
    saveOrdersToFile(); // Sauvegarder dans le fichier local
  }

  return updated;
}

