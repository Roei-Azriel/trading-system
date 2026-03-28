import { Prisma, PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";
import { ConflictError, ForbiddenError, InsufficientFundsError, UserOrderNotFoundError, UserWalletNotFoundError } from "./order-errors.js";
import type { CancelOrderResultDTO, CoinPair, Currency, OrderCreatedDTO, OrderSide } from "./order.types.js";

const getBaseCurrencyFromPair = (pair: CoinPair): Currency => pair.split("_")[0] as Currency;

export interface OrderRepo {
  createBuyOrder(userId: string, pair: CoinPair, quantity: number, price: number): Promise<OrderCreatedDTO>;
  createSellOrder(userId: string, pair: CoinPair, quantity: string, price: string): Promise<OrderCreatedDTO>;
  cancelBuyOrder(userId: string, orderId: string): Promise<CancelOrderResultDTO>;
  cancelSellOrder(userId: string, orderId: string): Promise<CancelOrderResultDTO>;
  findOrderById(orderId: string): Promise<{ id: string; userId: string; side: OrderSide } | null>;
}

export class PrismaOrderRepo implements OrderRepo {
  private prisma = new PrismaClient();

  private async getWalletId(userId: string): Promise<string> {
    const res = await fetch(`http://localhost:30003/wallet/${userId}/getWallet`);

    if (!res.ok) {
      throw new UserWalletNotFoundError(userId);
    }

    const walletId = await res.json();

    if (typeof walletId !== "string" || !walletId.trim()) {
      throw new UserWalletNotFoundError(userId);
    }

    return walletId;
  }

  async findOrderById(orderId: string): Promise<{ id: string; userId: string; side: OrderSide } | null> {
    return this.prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        userId: true,
        side: true,
      },
    });
  }

  async createBuyOrder(userId: string, pair: CoinPair, quantity: number, price: number): Promise<OrderCreatedDTO> {
    const lockCurrency: Currency = "USDT";
    const qty = new Decimal(quantity.toString());
    const prc = new Decimal(price.toString());
    const lockAmount = prc.mul(qty);
    const walletId = await this.getWalletId(userId);

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const lockRes = await tx.walletBalance.updateMany({
        where: {
          walletId,
          currency: lockCurrency,
          available: {
            gte: lockAmount,
          },
        },
        data: {
          available: { decrement: lockAmount },
          locked: { increment: lockAmount },
        },
      });

      if (lockRes.count === 0) {
        throw new InsufficientFundsError();
      }

      const order = await tx.order.create({
        data: {
          userId,
          pair,
          side: "BUY",
          status: "OPEN",
          price: prc,
          quantity: qty,
          filledQuantity: new Decimal(0),
        },
      });

      return {
        id: order.id,
        pair: order.pair,
        side: order.side,
        status: order.status,
        price: order.price.toString(),
        quantity: order.quantity.toString(),
        filledQuantity: order.filledQuantity.toString(),
        createdAt: order.createdAt,
      };
    });
  }

  async cancelBuyOrder(userId: string, orderId: string): Promise<CancelOrderResultDTO> {
    const walletId = await this.getWalletId(userId);

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        throw new UserOrderNotFoundError(orderId);
      }

      if (order.userId !== userId) {
        throw new ForbiddenError("Order does not belong to this user");
      }

      if (order.status !== "OPEN") {
        throw new ConflictError("Order cannot be cancelled because it is not in OPEN status");
      }

      const lockRes = await tx.order.updateMany({
        where: { id: orderId, status: "OPEN" },
        data: { status: "CANCELLED" },
      });

      if (lockRes.count === 0) {
        throw new ConflictError("Order cannot be cancelled because it is not OPEN");
      }

      const remainingQty = order.quantity.sub(order.filledQuantity);
      const unlockAmount = order.price.mul(remainingQty);

      await tx.walletBalance.update({
        where: {
          walletId_currency: {
            walletId,
            currency: "USDT",
          },
        },
        data: {
          available: { increment: unlockAmount },
          locked: { decrement: unlockAmount },
        },
      });

      const result: CancelOrderResultDTO = {
        orderId,
        status: "CANCELLED",
        unlockAmount: unlockAmount.toString(),
      };

      return result;
    });
  }

  async createSellOrder(userId: string, pair: CoinPair, quantity: string, price: string): Promise<OrderCreatedDTO> {
    const currency = getBaseCurrencyFromPair(pair);
    const qty = new Decimal(quantity);
    const prc = new Decimal(price);
    const walletId = await this.getWalletId(userId);

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const lockRes = await tx.walletBalance.updateMany({
        where: {
          walletId,
          currency,
          available: {
            gte: qty,
          },
        },
        data: {
          available: { decrement: qty },
          locked: { increment: qty },
        },
      });

      if (lockRes.count !== 1) {
        if (lockRes.count === 0) {
          throw new InsufficientFundsError();
        }

        throw new Error("Data integrity error: multiple wallet balances updated");
      }

      const order = await tx.order.create({
        data: {
          userId,
          pair,
          side: "SELL",
          status: "OPEN",
          price: prc,
          quantity: qty,
          filledQuantity: new Decimal(0),
        },
      });

      return {
        id: order.id,
        pair: order.pair,
        side: order.side,
        status: order.status,
        price: order.price.toString(),
        quantity: order.quantity.toString(),
        filledQuantity: order.filledQuantity.toString(),
        createdAt: order.createdAt,
      };
    });
  }

  async cancelSellOrder(userId: string, orderId: string): Promise<CancelOrderResultDTO> {
    const walletId = await this.getWalletId(userId);

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const order = await tx.order.findUnique({
        where: { id: orderId },
      });

      if (!order) {
        throw new UserOrderNotFoundError(orderId);
      }

      const currency = getBaseCurrencyFromPair(order.pair as CoinPair);

      if (order.userId !== userId) {
        throw new ForbiddenError("Order does not belong to this user");
      }

      if (order.status !== "OPEN") {
        throw new ConflictError("Order cannot be cancelled because it is not in OPEN status");
      }

      const lockRes = await tx.order.updateMany({
        where: { id: orderId, status: "OPEN" },
        data: { status: "CANCELLED" },
      });

      if (lockRes.count === 0) {
        throw new ConflictError("Order cannot be cancelled because it is not OPEN");
      }

      const remainingQty = order.quantity.sub(order.filledQuantity);
      const unlockAmount = remainingQty;

      await tx.walletBalance.update({
        where: {
          walletId_currency: {
            walletId,
            currency,
          },
        },
        data: {
          available: { increment: unlockAmount },
          locked: { decrement: unlockAmount },
        },
      });

      const result: CancelOrderResultDTO = {
        orderId,
        status: "CANCELLED",
        unlockAmount: unlockAmount.toString(),
      };

      return result;
    });
  }
}
