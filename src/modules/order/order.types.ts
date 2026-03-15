import {z} from "zod";
import { Prisma, CoinPair, OrderSide, OrderStatus } from "@prisma/client";


export const createNewOrderSchema = z.object({
    userId : z.string().min(1),
    pair : z.enum(["BTC_USDT","ETH_USDT"]),
    side : z.enum(["BUY","SELL"]),
    price : z.coerce.number().positive(),
    quantity : z.coerce.number().positive(),
})


export type OrderDetailsDTO = {
  id: string;
};

export type OrderCreatedDTO = {
  id: string;
  pair: CoinPair;
  side: OrderSide;
  status: OrderStatus;
  price: Prisma.Decimal;
  quantity: Prisma.Decimal;
  filledQuantity: Prisma.Decimal;
  createdAt: Date;
};

export type CreateNewOrderDTO = z.infer<typeof createNewOrderSchema>;




