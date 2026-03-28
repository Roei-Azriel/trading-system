import type { Request, Response } from "express";
import { type CreateUserDTO, createUserSchema, type DeleteUserDTO ,deleteUserSchema , type NewPasswordDTO , passwordSchema } from "./user.types.js";
import { userService } from "./user.service.js";


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




export async function changePassword(req: Request, res: Response) { // req = {id , currentPassword , Newpassword}
   const passwords = passwordSchema.safeParse(req.body);

  if(!passwords.success){
    return res.status(400).json({
      message:'Invalid password input'
    })
   }
   const userPasswords : NewPasswordDTO = passwords.data;

   try{
    const result = await userService.changePassword(userPasswords); //return message if implement change password success
    return res.status(200).json(result);
   }catch(e){
    return res.status(400).json({message:'Password change failed'})
   }
}


