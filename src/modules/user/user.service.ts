import type { CreateUserDTO, UserPublicDTO , DeleteUserDTO } from "./user.types.js";
import bcrypt from "bcryptjs";


export class UserService { //Create new class for the user Service

  private async hashPassword(password:string):Promise<string>{
    const salt = await bcrypt.genSalt(10) //salt 
    return bcrypt.hash(password,salt);
  }

  private async comparePasswords(plain:string , hashed:string): Promise<boolean>{
    return bcrypt.compare(plain,hashed);
  }

  async createUser(dto: CreateUserDTO): Promise<UserPublicDTO> { //create user accept one input  call dto and is createUserDTO object

    const now = new Date();

    const user: UserPublicDTO = {
      id: crypto.randomUUID(),     
      fullName: dto.fullName,
      idNumber: dto.idNumber,      
      country: dto.country,
      email: dto.email,
      username: dto.username,
      createdAt: now,
    };

    return user;
  }


async deleteUser(dto:DeleteUserDTO): Promise<{id:string}>{

  return {id:'1213'};
}
}