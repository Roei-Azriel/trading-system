import type { CreateUserDTO, UserPublicDTO } from "./user.types.js";


export class UserService { //Create new class for the user Service

  async createUser(dto: CreateUserDTO): Promise<UserPublicDTO> { //create user accept one input  call dto and is createUserDTO object

    // כאן בעתיד יהיו: בדיקות ייחודיות, hash לסיסמה, קריאה ל-Repo וכו'.
    // לעכשיו—נחזיר אובייקט ציבורי "כאילו" יצרנו משתמש.

    const now = new Date();

    const user: UserPublicDTO = {
      id: crypto.randomUUID(),     // מזהה זמני
      fullName: dto.fullName,
      idNumber: dto.idNumber,      // אם לא רוצים לחשוף—תסיר מ-UserPublicDTO
      country: dto.country,
      email: dto.email,
      username: dto.username,
      createdAt: now,
    };

    return user;
  }
}