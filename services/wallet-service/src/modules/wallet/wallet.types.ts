import { z } from "zod";
import { Prisma } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";


export type Currency = z.infer<typeof creditSchema>["currency"];


export const creditSchema = z.object({
  userId: z.string().min(1),
  currency: z.enum(["USDT", "BTC", "ETH"]),
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
  id: string;
  walletId: string;
  currency: "USDT" | "BTC" | "ETH";
  available: Decimal;
  locked: Decimal;
};


export type balanceDTO = z.infer<typeof balanceSchema>;
export type CreditDTO = z.infer<typeof creditSchema>;
export type DebitDTO = z.infer<typeof debitSchema>;

export type userBalanceDTO = {

}




//service

export type BalanceDTO = {
  currency: string;
  available: string;
  locked: string;
};

export type UserBalancesDTO = {
  userId: string;
  balances: BalanceDTO[];
};
