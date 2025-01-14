// utils/server/customErrors.ts
export class CustomError extends Error {
  public data?: any;

  constructor(
    public statusCode: number,
    public errorCode: string,
    public message: string,
    data?: any,
  ) {
    super(message);
    this.name = "CustomError";
    this.data = data;
  }
}

export class TokenExpiredError extends CustomError {
  constructor(tokenType: string) {
    super(401, "AUTH_EXPIRED", `${tokenType} 인증 세션이 만료되었습니다.`, {
      tokenType,
    });
  }
}

export class ValidationError extends CustomError {
  constructor(message: string) {
    super(400, "VALIDATION_ERROR", message);
  }
}

export class ConflictError extends CustomError {
  constructor(message: string) {
    super(409, "CONFLICT_ERROR", message);
  }
}

export class DatabaseError extends CustomError {
  constructor(message: string) {
    super(500, "DATABASE_ERROR", message);
  }
}
