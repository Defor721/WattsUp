export abstract class CustomError extends Error {
  constructor(
    public statusCode: number,
    public errorCode: string,
    public message: string,
    public data?: any,
  ) {
    super(message);
  }

  serializeErrors() {
    return {
      errorCode: this.errorCode,
      reason: this.message,
      data: this.data || {},
    };
  }
}

export class TokenExpiredError extends CustomError {
  constructor(public tokenType: string) {
    super(401, "AUTH_EXPIRED", `${tokenType} 인증 세션이 만료되었습니다.`, {
      tokenType,
    });
  }
}

export class ValidationError extends CustomError {
  constructor(
    public field: string,
    public reason: string,
  ) {
    super(400, "VALIDATION_ERROR", `${field} 입력값이 유효하지 않습니다.`, {
      field,
      reason,
    });
  }
}

export class ConflictError extends CustomError {
  constructor(
    public resource: string,
    public reason: string,
  ) {
    super(409, "CONFLICT_ERROR", `이미 존재하는 ${resource}입니다.`, {
      resource,
      reason,
    });
  }
}

export class DatabaseError extends CustomError {
  constructor(
    message: string,
    public query?: string,
  ) {
    super(500, "DATABASE_ERROR", message, { query });
  }
}
