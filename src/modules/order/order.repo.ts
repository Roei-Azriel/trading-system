import  { CoinPair, PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { availableMemory } from "process";
import { gte } from "zod";
import {InsufficientFundsError , BalanceNotFoundError} from '../../errors/wallet-errors.js'
import {UserWalletNotFoundError , UserOrderNotFoundError , ForbiddenError , ConflictError} from '../../errors/order-errors.js'
import {type OrderCreatedDTO} from './order.types.js';


export interface OrderRepo {
  createBuyOrder(userId : string , currency : string , pair:CoinPair  , quantity: number , price : number): Promise<OrderCreatedDTO>;
}

export class PrismaOrderRepo implements OrderRepo{

    private prisma = new PrismaClient();

    async createBuyOrder(userId : string , pair:CoinPair  , quantity: number , price : number){

            const lockCurrency = "USDT";
            const lockAmount = price * quantity;

            return this.prisma.$transaction(async (tx) => {
                const wallet = await tx.wallet.findUnique({ //check if wallet exist 
                    where: { userId }, 
                });

                if(!wallet){
                    throw new UserWalletNotFoundError(userId);
                }
                const lockRes = await tx.walletBalance.updateMany({
                    where :{
                        walletId : wallet.id,
                        currency : lockCurrency,
                        available : {
                            gte : lockAmount,
                        },
                    },
                    data:{
                        available :  {decrement : lockAmount},
                        locked : {increment : lockAmount}

                    }
                })
            if (lockRes.count === 0) {
                throw new InsufficientFundsError();
            }
            const order = await tx.order.create({
                data: {
                    userId,
                    pair,
                    side:'BUY',
                    status:'OPEN',
                    price,
                    quantity,
                    filledQuantity: 0,
                }
            })
           return {
                id: order.id,
                pair: order.pair,
                side: order.side,
                status: order.status,
                price: Number(order.price),
                quantity: Number(order.quantity),
                filledQuantity: Number(order.filledQuantity),
                createdAt: order.createdAt,
            };   
        });
    }

    async cancelBuyOrder(userId : string , orderId : string){
        return this.prisma.$transaction(async (tx) => {
            const order = await tx.order.findUnique({
                where : {id : orderId}
            })

            if(!order){
                throw new UserOrderNotFoundError(orderId);
            }
            if(order.userId != userId){
                throw new ForbiddenError("Order does not belong to this user");
            }
            if(order.status != 'OPEN'){
                throw new ConflictError("Order cannot be cancelled because it is not in OPEN status");
            }
            const lockRes = await tx.order.updateMany({
                where : {id : orderId , status: "OPEN"},
                data : {status : 'CANCELLED'}
            })
            if (lockRes.count === 0) {
                throw new ConflictError("Order cannot be cancelled because it is not OPEN");
            }
            const wallet = await tx.wallet.findUnique({
                where:{userId:userId}
            })
            if(!wallet){
                throw new UserWalletNotFoundError(userId);
            }

            const remainingQty = order.quantity.sub(order.filledQuantity);

            const unlockAmount = order.price.mul(remainingQty);

            
            const updateFunds = await tx.walletBalance.update({
                where : {
                    walletId_currency:{
                    walletId : wallet.id,
                    currency : 'USDT',
                    }
                },
                data:{
                    available : {increment : unlockAmount},
                    locked : {decrement : unlockAmount},
                }
            })

            return { orderId, status: "CANCELLED", unlockAmount: unlockAmount.toString() };
    })

    }

    async createSellOrder(userId:string,pair:CoinPair,quantity:string,price:string): Promise<OrderCreatedDTO>{
        
        return this.prisma.$transaction(async (tx) => {
            const currency = pair.slice(0, -4)
            const qty = new Prisma.Decimal(quantity);
            const prc = new Prisma.Decimal(price);
            const wallet = await tx.wallet.findUnique({
                where : {userId},
            })
            if(!wallet){
                throw new UserWalletNotFoundError(userId);
            }
            const lockRes = await tx.walletBalance.updateMany({
                where:{
                    walletId: wallet.id,
                    currency:currency,
                    available : {
                        gte : qty,
                }
                },
                data:{
                    available:{decrement : qty},
                    locked:{increment:qty},
                }
            })

            if (lockRes.count !== 1) {
                if (lockRes.count === 0) throw new InsufficientFundsError();
                throw new Error("Data integrity error: multiple wallet balances updated");
            }

            const order = await tx.order.create({
                data:{
                    userId,
                    pair,
                    side:"SELL",
                    status:"OPEN",
                    price:prc,
                    quantity:qty,
                    filledQuantity:new Prisma.Decimal(0),
                }
            })
            return {
                id: order.id,
                pair: order.pair,
                side: order.side,
                status: order.status,
                price: Number(order.price),
                quantity: Number(order.quantity),
                filledQuantity: Number(order.filledQuantity),
                createdAt: order.createdAt,
            }
        })
    
    }

      async cancelSellOrder(userId : string , orderId : string){

        return this.prisma.$transaction(async (tx) => {
            const order = await tx.order.findUnique({
                where : {id : orderId}
            })

            if(!order){
                throw new UserOrderNotFoundError(orderId);
            }

            const currency = order?.pair.slice(0, -4)

            if(order.userId != userId){
                throw new ForbiddenError("Order does not belong to this user");
            }
            if(order.status != 'OPEN'){
                throw new ConflictError("Order cannot be cancelled because it is not in OPEN status");
            }
            const lockRes = await tx.order.updateMany({
                where : {id : orderId , status: "OPEN"},
                data : {status : 'CANCELLED'}
            })
            if (lockRes.count === 0) {
                throw new ConflictError("Order cannot be cancelled because it is not OPEN");
            }
            const wallet = await tx.wallet.findUnique({
                where:{userId:userId}
            })
            if(!wallet){
                throw new UserWalletNotFoundError(userId);
            }

            const remainingQty = order.quantity.sub(order.filledQuantity);

            const unlockAmount = remainingQty;

            
            const updateFunds = await tx.walletBalance.update({
                where : {
                    walletId_currency:{
                    walletId : wallet.id,
                    currency : currency,
                    }
                },
                data:{
                    available : {increment : unlockAmount},
                    locked : {decrement : unlockAmount},
                }
            })

            

            return { orderId, status: "CANCELLED", unlockAmount: unlockAmount.toString() };
    })

    }
    
}

