import  { PrismaClient , Prisma } from "@prisma/client";
import type { Currency,  WalletWithBalances , WalletRecord , CoinRecord } from "./wallet.types.js";
import {BalanceNotFoundError , InsufficientFundsError} from './wallet-errors.js'


export interface WalletRepo {
  createWallet(userId: string): Promise<WalletRecord>;
  getBalance(userId:string) : Promise<WalletWithBalances | null>;
  credit(walletId:string,currency:string, amount:number) : Promise<CoinRecord>
  debit(walletId:string,currency:string, amount:number) : Promise<CoinRecord>
  getWallet(userId:string) : Promise<WalletRecord | null>
}

export class PrismaWalletRepo implements WalletRepo {

    private prisma = new PrismaClient();
    
    async createWallet(userId: string): Promise<WalletRecord> {
        return this.prisma.wallet.create({
            data: { userId },
        });
    }

    async getBalance(userId:string) : Promise<WalletWithBalances | null> {
        return this.prisma.wallet.findUnique({
            where: {userId},
            include : {
                balances:true,
            },
        })
    }

    async getWallet(userId:string) : Promise<WalletRecord | null>{
        return this.prisma.wallet.findUnique({
            where:{userId},
        })
    }

    async credit(walletId:string,currency:Currency, amount:number) : Promise<CoinRecord> {

        return this.prisma.walletBalance.upsert({
            where:{
                walletId_currency: {
                    walletId,
                    currency,
        },
            },
            update:{
                available:{
                    increment:amount
                }
            },
            create:{
                walletId,
                currency,
                available : amount,
            }
        })
    }

    async debit(walletId: string, currency: Currency, amount: number): Promise<CoinRecord> {
    return this.prisma.$transaction(async (tx : Prisma.TransactionClient) => {
        const balance = await tx.walletBalance.findUnique({
        where: {
            walletId_currency: {
            walletId,
            currency,
            },
        },
        });

        if (!balance) {
        throw new BalanceNotFoundError(walletId);
        }

        const result = await tx.walletBalance.updateMany({
        where: {
            walletId,
            currency,
            available: {
            gte: amount,
            },
        },
        data: {
            available: {
            decrement: amount,
            },
        },
        });

        if (result.count === 0) {
        throw new InsufficientFundsError();
        }

        return tx.walletBalance.findUniqueOrThrow({
        where: {
            walletId_currency: {
            walletId,
            currency,
            },
        },
        });
    });
    }
}

