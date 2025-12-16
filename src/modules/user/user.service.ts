import type { CreateUserDTO, UserPublicDTO , DeleteUserDTO , NewPasswordDTO } from "./user.types.js";
import bcrypt from "bcryptjs";
import {EmailAlreadyTakenError ,UsernameAlreadyTakenError , IdNumberAlreadyTakenError , IdIsIncorrect , InvalidPasswordError} from '../../errors/user-errors.js'
import {PrismaUserRepo , type UserRepo , type UserRecord} from './user.repo.js';
import { PrismaWalletRepo , type WalletRepo } from "../wallet/wallet.repo.js";


const prismaWalletRepo = new PrismaWalletRepo();
const prismaUserRepo = new PrismaUserRepo();

export class UserService { //Create new class for the user Service

  constructor(private readonly userRepo: UserRepo , private readonly walletRepo: WalletRepo) {}

  private async hashPassword(password:string):Promise<string>{
    const salt = await bcrypt.genSalt(10) //salt 
    return bcrypt.hash(password,salt);
  }

  private async comparePasswords(plain:string , hashed:string): Promise<boolean>{
    return bcrypt.compare(plain,hashed);
  }

  //create function 
  async createUser(dto: CreateUserDTO): Promise<UserPublicDTO> { //create user accept one input  call dto and is createUserDTO object

    const existingByEmail  = await this.userRepo.findByEmail(dto.email);
    const existingByUsername  = await this.userRepo.findByUsername(dto.username);
    const existingByIdNumber  = await this.userRepo.findByIdNumber(dto.idNumber);

    if (existingByEmail) {
      throw new EmailAlreadyTakenError(dto.email);
  }

  if (existingByUsername) {
      throw new UsernameAlreadyTakenError(dto.username);
  }

  if (existingByIdNumber) {
      throw new IdNumberAlreadyTakenError(dto.idNumber);
  }

  const passwordHash = await this.hashPassword(dto.password);

  const dataForCreate: Omit<UserRecord, 'id' | 'createdAt'> = {
  fullName: dto.fullName,
  idNumber: dto.idNumber,
  country: dto.country,
  email: dto.email,
  username: dto.username,
  passwordHash: passwordHash,
  };

  const created = await this.userRepo.create(dataForCreate);
  await this.walletRepo.createWallet(created.id)
  const user : UserPublicDTO = {
    id: created.id,
    fullName: created.fullName,
    idNumber: created.idNumber,
    country: created.country,
    email: created.email,
    username: created.username,
};

  return user



  }


//delete function 
async deleteUser(dto:DeleteUserDTO): Promise<{id:string}>{

    const user = await this.userRepo.findById(dto.id);
    if(!user){
      throw new IdIsIncorrect(dto.id)
    }
    const passwordIsCorrect = await this.comparePasswords(dto.password , user.passwordHash);

    if(!passwordIsCorrect){
      throw new InvalidPasswordError();
    }

    await this.userRepo.deleteById(dto.id);

    return {id : user.id}
}

async changePassword(dto:NewPasswordDTO):Promise<{id : string}>{
    const user = await this.userRepo.findById(dto.id); //find user 
    if(!user){
      throw new IdIsIncorrect(dto.id);
    }
    const passwordIsCorrect = await this.comparePasswords(dto.currentPassword , user.passwordHash);
    if(!passwordIsCorrect){
      throw new InvalidPasswordError();
    }
    const newHash = await this.hashPassword(dto.Newpassword);
    await this.userRepo.changePassword(dto.id,newHash);

    return {id: user.id}
  }
}


export const userService = new UserService(prismaUserRepo , prismaWalletRepo);
