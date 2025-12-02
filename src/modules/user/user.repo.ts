import { PrismaClient, type User } from "@prisma/client";

export type UserRecord = User;


export interface UserRepo{
    findByEmail(email:string):Promise <UserRecord | null>;
    findByUsername(username:string):Promise<UserRecord | null>;
    create(data: Omit<UserRecord ,'id' | "createdAt">): Promise<UserRecord>;
    findByIdNumber(idNumber: string): Promise<UserRecord | null>;
    deleteById(id :string) : Promise<UserRecord | null>;
    findById(id : string) : Promise<UserRecord | null>;
    changePassword(id:string , passwordHash:string) : Promise<UserRecord | null>
}

export class PrismaUserRepo implements UserRepo {
  private prisma =  new PrismaClient();
  
  async findByEmail(email:string) : Promise< UserRecord | null> {
    return this.prisma.user.findUnique({
    where : {email: email}
    })
  }

  async findByUsername(username: string): Promise<UserRecord | null> {
     return this.prisma.user.findUnique({
     where: { username: username }
    });
  }

  async findByIdNumber(idNumber : string) : Promise <UserRecord | null > {
    return this.prisma.user.findUnique({
      where : {idNumber : idNumber}
    })
  }
  async create(data: Omit<UserRecord, "id" | "createdAt">): Promise<UserRecord> {
      return this.prisma.user.create({
        data: {idNumber:data.idNumber , fullName:data.fullName , email:data.email , username : data.username ,country:data.country , passwordHash:data.passwordHash}
      })
  }

  async deleteById(id: string): Promise<UserRecord> {
      return this.prisma.user.delete({ where: { id } });
  }

  async findById(id : string) : Promise<UserRecord | null> {
      return this.prisma.user.findUnique({
      where : {id : id}
    })
  }
  async changePassword(id:string , passwordHash:string) : Promise<UserRecord | null> {
    return this.prisma.user.update({
      where : {id},
      data: {passwordHash}
    })
  }
}

