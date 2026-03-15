export class userDoesntExist extends Error {
  constructor(id: string) {
    super(`user id doesn't exist : ${id}`);
    this.name = "EmailAlreadyTakenError";
  }
}
export class UserWalletNotFoundError extends Error {
  constructor(userId: string) {
    super(`user wallet not found error : ${userId}`);
  }
}

export class UserOrderNotFoundError extends Error {
  constructor(userOrder: string) {
    super(`user order not found error : ${userOrder}`);
  }
}

export class ForbiddenError extends Error {
  constructor(msg : string) {
    super(msg);
  }
}
export class ConflictError extends Error {
  statusCode: number;
  constructor(msg : string) {
    super(msg);
    this.statusCode = 409;
  }
}


