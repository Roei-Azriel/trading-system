export class EmailAlreadyTakenError extends Error {
  constructor(email: string) {
    super(`Email is already in use: ${email}`);
    this.name = "EmailAlreadyTakenError";
  }
}

export class UsernameAlreadyTakenError extends Error{
    constructor(username: string){
        super(`Username is already in use: ${username}`);
        this.name = "UsernameAlreadyTakenError"
    }
}


export class IdNumberAlreadyTakenError extends Error{
    constructor(idNumber: string){
        super(`Username is already in use: ${idNumber}`);
        this.name = "IdNumberAlreadyTakenError"
    }
}

export class IdIsIncorrect extends Error{
  constructor(id : string){
    super(`Id is incorrect: ${id}`);
    this.name = "IdNumberAlreadyTakenError"
  }
}

export class InvalidPasswordError extends Error{
  constructor(){
    super(`Password is incorrect`);
    this.name = "InvalidPasswordError"
  }
}