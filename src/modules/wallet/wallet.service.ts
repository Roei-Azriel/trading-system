import { PrismaWalletRepo , type WalletRepo } from "./wallet.repo.js";
import type {userBalanceDTO , BalanceDTO , CreditDTO, DebitDTO} from "./wallet.types.js";
import {BalanceNotFoundError} from '../../errors/wallet-errors.js'

const prismaWalletRepo =  new PrismaWalletRepo();


export class WalletService{
    constructor(private readonly walletRepo : WalletRepo){}
    
    async getBalances(userId : string) : Promise<userBalanceDTO>{
        const walletUser = await this.walletRepo.getBalance(userId);
        if(!walletUser){
           throw new  BalanceNotFoundError(userId);
        }
        return({
            userId: walletUser.userId,
            balances: walletUser.balances.map(coin => ({
                currency: coin.currency,
                amount:coin.amount.toString(),
            }))
        })
    }

    async credit(cmd : CreditDTO) : Promise <BalanceDTO>{
        const walletUser = await this.walletRepo.getBalance(cmd.userId);

        if(!walletUser){
           throw new  BalanceNotFoundError(cmd.userId);
        }
        const creditUser = await this.walletRepo.credit(walletUser.id,cmd.currency,cmd.amount);
        
        return({
            currency : creditUser.currency,
            amount : creditUser.amount.toString(),

        })

    }

    async debit(cmd :DebitDTO) : Promise<BalanceDTO>{
        const wallet = await this.walletRepo.getBalance(cmd.userId);
        if(!wallet){
           throw new  BalanceNotFoundError(cmd.userId);
        }
        const updatedCoin = await this.walletRepo.debit(wallet.id,cmd.currency,cmd.amount);
        return ({
            currency : updatedCoin.currency,
            amount : updatedCoin.amount.toString(),
        })
    }
}


export const walletService = new WalletService(prismaWalletRepo);