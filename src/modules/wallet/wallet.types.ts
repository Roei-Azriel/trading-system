import { z } from "zod";
import { Prisma } from "@prisma/client";


export const creditSchema = z.object({
  userId: z.string().min(1),
  currency: z.string().min(1),
  amount: z.coerce.number().positive(),
});

export const debitSchema = z.object({
  userId: z.string().min(1),
  currency: z.string().min(1),
  amount: z.coerce.number().positive(),
});

export const balanceSchema = z.object({
  userId: z.string().min(1)
})



export type WalletWithBalances = WalletRecord & {
  balances: CoinRecord[];
};

export type WalletRecord = {
  id: string;
  userId: string;
  createdAt: Date;
};

export type CoinRecord = {
  walletId:string,
  currency : string,
  amount : Prisma.Decimal,
}


export type balanceDTO = z.infer<typeof balanceSchema>;
export type CreditDTO = z.infer<typeof creditSchema>;
export type DebitDTO = z.infer<typeof debitSchema>;

export type userBalanceDTO = {

}




//service

export type BalanceDTO = {
  currency: string;
  amount: string; 
};

export type UserBalancesDTO = {
  userId: string;
  balances: BalanceDTO[];
};
