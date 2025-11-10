/**
 * Controllers receive (req,res), validate input, and pass DTOs to services.
 * For now they are stubs so you can implement them yourself.
 */
import type { Request, Response } from "express";
import { type CreateUserDTO, createUserSchema} from "./user.types.js";
import { UserService } from "./user.service.js";


const userService = new UserService();


export async function createUser(req: Request, res: Response) {

  const result = createUserSchema.safeParse(req.body); //check in runtime the user input 

  if(!result.success){
    return res.status(400).json({
      message: 'Invalid input data',
      errors:result.error,
    })
  }

  const userData: CreateUserDTO = result.data;
  const created = await userService.createUser(userData);


  
  return res.status(201).json({ message: "User created", data: userData });
}




export async function deleteUser(req: Request, res: Response) {
  return res.status(501).json({ todo: "implement deleteUser" });
}

export async function changePassword(req: Request, res: Response) {
  return res.status(501).json({ todo: "implement changePassword" });
}
