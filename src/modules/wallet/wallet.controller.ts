import type { Request, Response } from "express";
import {creditSchema , type DebitDTO , type CreditDTO , type balanceDTO , balanceSchema} from './wallet.types.js'
import { walletService } from "./wallet.service.js";




export async function getBalances(req: Request, res: Response) {

  const parsed = balanceSchema.safeParse(req.params);

  if(!parsed.success){
    return res.status(400).json({
      message:'Invalid user id',
      errors:parsed.error,
    })
  }

    const {userId} = parsed.data;


    try{
      const result = await walletService.getBalances(userId);
      return res.status(200).json(result);
    }catch(e){
      return res.status(500).json({message:'fetch balance is failed'})
    }
  }




export async function credit(req: Request, res: Response) {
  const parsed = creditSchema.safeParse({
    userId: req.params.userId,
    currency: req.body.currency,
    amount: req.body.amount,
  });

  if(!parsed.success){
    return res.status(400).json({
      message: 'Invalid input data',
      errors:parsed.error,
    })
  }
  const command : CreditDTO = parsed.data;

  try{
    const result = await walletService.credit(command);
    return res.status(200).json(result);
  }catch(err:any){
    console.error(err);
    return res.status(500).json({message: "Internal server error"})
  }

}

export async function debit(req: Request, res: Response) {

  const parsed = creditSchema.safeParse({
    userId: req.params.userId,
    currency: req.body.currency,
    amount: req.body.amount,
  });
  if(!parsed.success){
    return res.status(400).json({
      message:'Invalid input data',
      errors:parsed.error,
    })
  }
  const command : DebitDTO = parsed.data;
  try{
    const result = await walletService.debit(command);
    return res.status(200).json(result);
  }catch(err:any){
    console.error(err);
    return res.status(500).json({message:'Internal server error'})
  }

}



