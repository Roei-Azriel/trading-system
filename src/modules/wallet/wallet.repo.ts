import  { PrismaClient } from "@prisma/client";
import type { WalletWithBalances , WalletRecord , CoinRecord } from "./wallet.types.js";
import {BalanceNotFoundError , InsufficientFundsError} from '../../errors/wallet-errors.js'


export interface WalletRepo {
  createWallet(userId: string): Promise<WalletRecord>;
  getBalance(userId:string) : Promise<WalletWithBalances | null>;
  credit(walletId:string,currency:string, amount:number) : Promise<CoinRecord>
  debit(walletId:string,currency:string, amount:number) : Promise<CoinRecord>
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

async credit(walletId:string,currency:string, amount:number) : Promise<CoinRecord> {

    return this.prisma.walletBalance.upsert({
        where:{
            walletId_currency: {
                walletId,
                currency,
      },
        },
        update:{
            amount:{
                increment:amount
            }
        },
        create:{
            walletId,
            currency,
            amount,
        }
    })
}

async debit(walletId:string,currency:string, amount:number) : Promise<CoinRecord> {
    return this.prisma.$transaction(async (tx) => {
      const balance = await tx.walletBalance.findUnique({
      where: {
        walletId_currency: {
          walletId,
          currency,
        },
      },
    });
    if(!balance){
        throw new BalanceNotFoundError(walletId);
    }

    if (balance.amount.lt(amount)){ 
        throw new InsufficientFundsError(); 
    }
    const updated = await tx.walletBalance.update({
         where: {
             walletId_currency:{
                walletId,
                 currency,
                 }, }, 
                 
        data: {
            amount: {
                decrement: amount, 
            },
         },

         }); 
         
         return updated;
    })
  }
}

