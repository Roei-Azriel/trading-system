import {type CreateNewOrderDTO } from './order.types.js'
import {type OrderDetailsDTO} from './order.types.js'
import {PrismaUserRepo , type UserRepo , type UserRecord} from '../user/user.repo.js';
import { PrismaOrderRepo, type OrderRepo } from './order.repo.js';
import {userDoesntExist} from '../../errors/order-errors.js'


const prismaUserRepo = new PrismaUserRepo();
const prismaOrderRepo = new PrismaOrderRepo();

export class OrderService {

    constructor(private readonly userRepo: UserRepo , private readonly orderRepo : OrderRepo ) {}
    
    async openOrderService(dto : CreateNewOrderDTO) : Promise<OrderDetailsDTO>{
        const existingByID = await this.userRepo.findById(dto.userId); //check if userId exist
        if(!existingByID){
            throw new userDoesntExist(dto.userId);
        }
        if(dto.side == 'BUY'){
            const newOrder = await this.orderRepo.
        }

    }
}



export const orderService = new OrderService(prismaUserRepo , prismaOrderRepo);

