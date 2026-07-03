import type { CoinPair, OrderSide } from "@prisma/client";

export type BookOrder = {
  id: string;
  userId: string;
  pair: CoinPair;
  side: OrderSide;
  price: string;
  originalQuantity: string;
  remainingQuantity: string;
  createdAt: Date;
};
