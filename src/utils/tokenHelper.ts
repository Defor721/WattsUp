import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";

export async function verifyToken(
  token: string,
  secret: string,
): Promise<JwtPayload> {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      console.error("토큰이 만료되었습니다.", error.expiredAt);
      throw new Error("TokenExpiredError");
    } else {
      console.error("토큰 인증이 실패했습니다.", error);
      throw new Error("InvalidTokenError");
    }
  }
}
