export abstract class CustomError<T = any> extends Error {
  constructor(
    public statusCode: number,
    public errorCode: string,
    public message: string,
    public data?: T,
  ) {
    super(message);
  }

  serializeErrors() {
    return {
      errorCode: this.errorCode,
      message: this.message,
      data: this.data || {},
    };
  }
}

export class TokenExpiredError extends CustomError {
  constructor(
    public tokenType: string,
    public reason: string,
  ) {
    super(401, "AUTH_EXPIRED", `${tokenType} session has expired.`, {
      tokenType,
      reason,
    });
  }
}

export class ValidationError extends CustomError {
  constructor(
    public field: string,
    public reason: string,
  ) {
    super(400, "VALIDATION_ERROR", `Invalid input for ${field}.`, {
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
    super(409, "CONFLICT_ERROR", `${resource} already exists.`, {
      resource,
      reason,
    });
  }
}

export class DatabaseError extends CustomError {
  constructor(
    reason: string,
    public query?: string,
  ) {
    super(
      500,
      "DATABASE_ERROR",
      `Database error: ${reason}${query ? ` (Query: ${query})` : ""}`,
      { query, reason },
    );
  }
}

export class NotFoundError extends CustomError {
  constructor(
    public resource: string,
    public reason: string,
  ) {
    super(404, "NOT_FOUND", `${resource} not found.`, {
      resource,
      reason,
    });
  }
}
