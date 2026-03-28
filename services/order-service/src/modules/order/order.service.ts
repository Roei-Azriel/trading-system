import type { CancelOrderDTO, CancelOrderResultDTO, CreateNewOrderDTO, OrderCreatedDTO } from "./order.types.js";
import { UserOrderNotFoundError } from "./order-errors.js";
import { PrismaOrderRepo, type OrderRepo } from "./order.repo.js";

const prismaOrderRepo = new PrismaOrderRepo();

export class OrderService {
  constructor(private readonly orderRepo: OrderRepo) {}

  async openOrderService(dto: CreateNewOrderDTO): Promise<OrderCreatedDTO> {
    if (dto.side === "BUY") {
      return this.orderRepo.createBuyOrder(dto.userId, dto.pair, dto.quantity, dto.price);
    }

    return this.orderRepo.createSellOrder(dto.userId, dto.pair, dto.quantity.toString(), dto.price.toString());
  }

  async cancelOrderService(dto: CancelOrderDTO): Promise<CancelOrderResultDTO> {
    const order = await this.orderRepo.findOrderById(dto.orderId);

    if (!order) {
      throw new UserOrderNotFoundError(dto.orderId);
    }

    if (order.side === "BUY") {
      return this.orderRepo.cancelBuyOrder(dto.userId, dto.orderId);
    }

    return this.orderRepo.cancelSellOrder(dto.userId, dto.orderId);
  }
}

export const orderService = new OrderService(prismaOrderRepo);
