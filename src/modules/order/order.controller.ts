import type { Request, Response } from "express";
import {type CreateNewOrderDTO , createNewOrderSchema} from './order.types.js'
import { OrderService } from "./order.service.js";


export async function openOrder(req: Request, res: Response){
    const result = createNewOrderSchema.safeParse(req.body)

    if(!result.success){
        return res.status(400).json({
            message : 'Invaild input data',
            errors:result.error,

        })
    }
    const userOpenOrder : CreateNewOrderDTO = result.data;

    try{
       const createdOrder =  await OrderService.openOrderService(userOpenOrder);
       return res.status(201).location(`/openOrder/${createdOrder.id}`).json(createdOrder);
    }catch(e){
        return res.status(500).json({message:'server error'});
    }   
}



