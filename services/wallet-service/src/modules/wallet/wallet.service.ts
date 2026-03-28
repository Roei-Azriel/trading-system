import { PrismaWalletRepo , type WalletRepo } from "./wallet.repo.js";
import type {userBalanceDTO , BalanceDTO , CreditDTO, DebitDTO, WalletRecord} from "./wallet.types.js";
import {BalanceNotFoundError , WalletNotFoundError} from './wallet-errors.js'

const prismaWalletRepo =  new PrismaWalletRepo();


export class WalletService{
    constructor(private readonly walletRepo : WalletRepo){}

    async createWallet(userId: string): Promise<WalletRecord> {
        return this.walletRepo.createWallet(userId);
    }
    
    async getBalances(userId : string) : Promise<userBalanceDTO>{
        const walletUser = await this.walletRepo.getBalance(userId);
        if(!walletUser){
           throw new  BalanceNotFoundError(userId);
        }
        return({
            userId: walletUser.userId,
            balances: walletUser.balances.map(coin => ({
                currency: coin.currency,
                available:coin.available.toString(),
                locked:coin.available.toString(),
            }))
        })
    }

    async getWalletId(userId: string) : Promise<string>{
        const walletUser = await this.walletRepo.getWallet(userId);
        if(!walletUser){
            throw new WalletNotFoundError(userId);
        }
        return walletUser.id;
    }

    async credit(cmd : CreditDTO) : Promise <BalanceDTO>{
        const walletUser = await this.walletRepo.getBalance(cmd.userId);

        if(!walletUser){
           throw new  BalanceNotFoundError(cmd.userId);
        }
        const creditUser = await this.walletRepo.credit(walletUser.id,cmd.currency,cmd.amount);
        
        return({
            currency : creditUser.currency,
            available : creditUser.available.toString(),
            locked : creditUser.locked.toString(),
        })

    }

    async debit(cmd :DebitDTO) : Promise<BalanceDTO>{
        const wallet = await this.walletRepo.getBalance(cmd.userId);
        if(!wallet){
           throw new  BalanceNotFoundError(cmd.userId);
        }
        const updatedCoin = await this.walletRepo.debit(wallet.id,cmd.currency,cmd.amount);
        return({
            currency : updatedCoin.currency,
            available : updatedCoin.available.toString(),
            locked : updatedCoin.locked.toString(),
        })
    }

    
}


export const walletService = new WalletService(prismaWalletRepo);
