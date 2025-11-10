/**
 * Controllers receive (req,res), validate input, and pass DTOs to services.
 * For now they are stubs so you can implement them yourself.
 */
import type { Request, Response } from "express";
import { type CreateUserDTO, createUserSchema, type DeleteUserDTO ,deleteUserSchema} from "./user.types.js";
import { UserService } from "./user.service.js";


const userService = new UserService(); //class for the business level


export async function createUser(req: Request, res: Response) {

  const result = createUserSchema.safeParse(req.body); //check in runtime the user input 

  if(!result.success){
    return res.status(400).json({
      message: 'Invalid input data',
      errors:result.error,
    })
  }

  const userData: CreateUserDTO = result.data; //create object with the user info

  try{
  const created = await userService.createUser(userData); //use the object from the server class and create new user with the inner function
  return res.status(201).location(`/users/${created.id}`).json(created);
  }catch(e){
    return res.status(500).json({message:'server error'})
  }
}




export async function deleteUser(req: Request<{id:string}, {} , {password:string}>, res: Response) {

  const {id} = req.params;
  const {password} = req.body;
  const candidate:DeleteUserDTO = {id , password}
  const parsed = deleteUserSchema.safeParse(candidate);

  if(!parsed.success){
    return res.status(400).json({
      message:'Invaild User info - please try again later',
      errors:parsed.error
    })
  }

  try{
  const result = await userService.deleteUser(parsed.data)
  return res.status(200).json(result)
  }catch(e : any){
    if(e.code === 'NOT_FOUND') return res.status(404).json({message:'User not found'})
    if(e.code === 'UNAUTHORIZED') return res.status(401).json({message:'Invalid password'})
    return res.status(500).json({message:'server error - try again later'})
  }
}




export async function changePassword(req: Request, res: Response) {
  // TODO: validate req.params.id and req.body (oldPassword,newPassword), then call service
  return res.status(501).json({ todo: "implement changePassword" });
}
