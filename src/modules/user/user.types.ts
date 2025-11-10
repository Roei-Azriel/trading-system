import { z } from "zod";

export const createUserSchema = z.object({
  fullName: z.string(),
  idNumber: z.string(),
  country: z.string(),
  email: z.string().email(),
  username: z.string(),
  password: z.string().min(6)
});

export type UserPublicDTO = {
  id: string;
  fullName: string;
  idNumber: string; 
  country: string;
  email: string;
  username: string;
  createdAt: Date;
};



export type CreateUserDTO = z.infer<typeof createUserSchema>;
