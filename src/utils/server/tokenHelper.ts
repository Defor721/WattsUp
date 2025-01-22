import jwt, {
  JwtPayload,
  TokenExpiredError as JWTTokenExpiredError,
} from "jsonwebtoken";

import { TokenExpiredError, ValidationError } from "@/server/customErrors";

export function verifyToken(
  token: string,
  secret: string,
  tokenType: string,
): JwtPayload {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    if (error instanceof JWTTokenExpiredError) {
      throw new TokenExpiredError(tokenType, "토큰이 만료되었습니다.");
    } else {
      throw new ValidationError("token", "유효하지 않은 토큰입니다.");
    }
  }
}
