
export type UserRecord = {
  id: string;
  fullName: string;
  idNumber: string;
  country: string;
  email: string;
  username: string;
  passwordHash: string;
  createdAt: Date;
};


export interface UserRepo{
    findByEmail(email:string):Promise <UserRecord | null>;
    findByUsername(username:string):Promise<UserRecord | null>;
    create(data: Omit<UserRecord ,'id' | "createAt">): Promise<UserRecord>;
}