import { OrderQueue } from "./OrderQueue.js";
import type { OrderSide } from "@prisma/client";
import type { BookOrder } from "../modules/matching/matching.types.js";

type PriceNode = {
  price: string;
  queue: OrderQueue;
  prev: PriceNode | null;
  next: PriceNode | null;
};

// Maintains one side of the book as sorted price levels, each with its own order queue.
export class PriceLevels {
  private levels: Map<string, PriceNode>;
  private head: PriceNode | null;

  constructor(private readonly side: OrderSide) {
    this.levels = new Map<string, PriceNode>();
    this.head = null;
  }

  // Adds an order to an existing price level or creates that level first.
  public addOrder(order: BookOrder): void {
    const node = this.getOrCreateLevel(order.price);
    node.queue.enqueue(order);
  }

  // Removes an order by id and deletes the price level if its queue becomes empty.
  public removeOrder(order: BookOrder): BookOrder | null {
    const node = this.levels.get(order.price);

    if (!node) {
      return null;
    }

    const removedOrder = node.queue.removeById(order.id);

    if (node.queue.isEmpty()) {
      this.removeLevel(node);
    }

    return removedOrder;
  }

  // Returns the best price for this side: highest bid or lowest ask.
  public getBestPrice(): string | null {
    return this.head?.price ?? null;
  }

  // Returns the queue at the best price level without removing anything.
  public getBestQueue(): OrderQueue | null {
    return this.head?.queue ?? null;
  }

  // Returns the queue for a specific price level if it exists.
  public getQueue(price: string): OrderQueue | null {
    return this.levels.get(price)?.queue ?? null;
  }

  // Deletes an entire price level from the map and sorted list.
  public deleteLevel(price: string): boolean {
    const node = this.levels.get(price);

    if (!node) {
      return false;
    }

    this.removeLevel(node);
    return true;
  }

  // Finds the price level or creates and inserts it in sorted order.
  private getOrCreateLevel(price: string): PriceNode {
    const existingNode = this.levels.get(price);

    if (existingNode) {
      return existingNode;
    }

    const newNode: PriceNode = {
      price,
      queue: new OrderQueue(),
      prev: null,
      next: null,
    };

    this.insertLevel(newNode);
    this.levels.set(price, newNode);
    return newNode;
  }

  // Inserts a new price level so the head always remains the best price.
  private insertLevel(newNode: PriceNode): void {
    if (this.head === null) {
      this.head = newNode;
      return;
    }

    if (this.isBetterPrice(newNode.price, this.head.price)) {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
      return;
    }

    let current = this.head;

    while (current.next !== null && !this.isBetterPrice(newNode.price, current.next.price)) {
      current = current.next;
    }

    newNode.prev = current;
    newNode.next = current.next;

    if (current.next !== null) {
      current.next.prev = newNode;
    }

    current.next = newNode;
  }

  // Unlinks a price level from both the sorted list and the lookup map.
  private removeLevel(node: PriceNode): void {
    if (node.prev !== null) {
      node.prev.next = node.next;
    } else {
      this.head = node.next;
    }

    if (node.next !== null) {
      node.next.prev = node.prev;
    }

    this.levels.delete(node.price);
    node.prev = null;
    node.next = null;
  }

  // Compares prices according to side: higher is better for bids, lower for asks.
  private isBetterPrice(price: string, comparedTo: string): boolean {
    const priceNumber = Number(price);
    const comparedToNumber = Number(comparedTo);

    return this.side === "BUY" ? priceNumber > comparedToNumber : priceNumber < comparedToNumber;
  }
}
