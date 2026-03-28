import type { Request, Response } from "express";
import {cancelOrderSchema,createNewOrderSchema,type CancelOrderDTO,type CreateNewOrderDTO,} from "./order.types.js";
import { orderService } from "./order.service.js";

export async function newOrder(req: Request, res: Response) {
  const parsed = createNewOrderSchema.safeParse({
    userId: req.params.userId,
    pair: req.body.pair,
    side: req.body.side,
    price: req.body.price,
    quantity: req.body.quantity,
  });

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid input data",
      errors: parsed.error,
    });
  }

  const command: CreateNewOrderDTO = parsed.data;

  try {
    const createdOrder = await orderService.openOrderService(command);
    return res.status(201).location(`/order/${command.userId}/orders/${createdOrder.id}`).json(createdOrder);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function cancelOrder(req: Request, res: Response) {
  const parsed = cancelOrderSchema.safeParse({
    userId: req.params.userId,
    orderId: req.params.id,
  });

  if (!parsed.success) {
    return res.status(400).json({
      message: "Invalid input data",
      errors: parsed.error,
    });
  }

  const command: CancelOrderDTO = parsed.data;

  try {
    const result = await orderService.cancelOrderService(command);
    return res.status(200).json(result);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
