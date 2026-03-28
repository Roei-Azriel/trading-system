export class userDoesntExist extends Error {
  statusCode: number;

  constructor(id: string) {
    super(`user id doesn't exist : ${id}`);
    this.name = "userDoesntExist";
    this.statusCode = 404;
  }
}

export class UserWalletNotFoundError extends Error {
  statusCode: number;

  constructor(userId: string) {
    super(`user wallet not found error : ${userId}`);
    this.name = "UserWalletNotFoundError";
    this.statusCode = 404;
  }
}

export class UserOrderNotFoundError extends Error {
  statusCode: number;

  constructor(userOrder: string) {
    super(`user order not found error : ${userOrder}`);
    this.name = "UserOrderNotFoundError";
    this.statusCode = 404;
  }
}

export class ForbiddenError extends Error {
  statusCode: number;

  constructor(msg: string) {
    super(msg);
    this.name = "ForbiddenError";
    this.statusCode = 403;
  }
}

export class ConflictError extends Error {
  statusCode: number;

  constructor(msg: string) {
    super(msg);
    this.name = "ConflictError";
    this.statusCode = 409;
  }
}

export class InsufficientFundsError extends Error {
  statusCode: number;

  constructor() {
    super("Insufficient Funds");
    this.name = "InsufficientFundsError";
    this.statusCode = 409;
  }
}
