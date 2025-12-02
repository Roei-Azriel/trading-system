import { z } from "zod";

export const createUserSchema = z.object({
  fullName: z.string(),
  idNumber: z.string(),
  country: z.string(),
  email: z.string().email(),
  username: z.string(),
  password: z.string().min(6)
});

export const deleteUserSchema = z.object({
  id:z.string(),
  password:z.string().min(6)
})

export const passwordSchema = z.object({
  id: z.string(),
  currentPassword:z.string(),
  Newpassword:z.string().min(6)
})

export type DeleteUserDTO = z.infer<typeof deleteUserSchema>;
export type CreateUserDTO = z.infer<typeof createUserSchema>;
export type NewPasswordDTO = z.infer<typeof passwordSchema>;

export type UserPublicDTO = {
  id: string;
  fullName: string;
  idNumber: string; 
  country: string;
  email: string;
  username: string;
};