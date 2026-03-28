import { z } from "zod";

export const coinPairs = ["BTC_USDT", "ETH_USDT"] as const;
export const orderSides = ["BUY", "SELL"] as const;
export const orderStatuses = ["OPEN", "PROCESSING", "CANCELLED", "FILLED", "PARTIALLY_FILLED"] as const;
export const currencies = ["USDT", "BTC", "ETH"] as const;

export type CoinPair = (typeof coinPairs)[number];
export type OrderSide = (typeof orderSides)[number];
export type OrderStatus = (typeof orderStatuses)[number];
export type Currency = (typeof currencies)[number];

export const createNewOrderSchema = z.object({
  userId: z.string().min(1),
  pair: z.enum(coinPairs),
  side: z.enum(orderSides),
  price: z.coerce.number().positive(),
  quantity: z.coerce.number().positive(),
});

export const cancelOrderSchema = z.object({
  userId: z.string().min(1),
  orderId: z.string().min(1),
});

export type OrderDetailsDTO = {
  id: string;
};

export type OrderCreatedDTO = {
  id: string;
  pair: CoinPair;
  side: OrderSide;
  status: OrderStatus;
  price: string;
  quantity: string;
  filledQuantity: string;
  createdAt: Date;
};

export type CreateNewOrderDTO = z.infer<typeof createNewOrderSchema>;
export type CancelOrderDTO = z.infer<typeof cancelOrderSchema>;

export type CancelOrderResultDTO = {
  orderId: string;
  status: OrderStatus | "CANCELLED";
  unlockAmount: string;
};
