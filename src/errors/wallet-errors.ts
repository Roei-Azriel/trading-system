export class BalanceNotFoundError extends Error{
    constructor(walletId:string){
        super(`can't find the wallet: ${walletId}:`);
        this.name = "BalanceNotFoundError"
    }
}

export class InsufficientFundsError extends Error{
    constructor(){
        super(`Insufficient Funds`);
        this.name = "BalanceNotFoundError"
    }
}



