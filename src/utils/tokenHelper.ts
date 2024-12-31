import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";

export async function verifyToken(
  token: string,
  secret: string,
  tokenType: string,
): Promise<JwtPayload> {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      console.log(`${tokenType} 토큰이 만료되었습니다.`);
      throw new Error(`TokenExpiredError: ${tokenType}`);
    } else {
      console.log(`${tokenType} 토큰 인증이 실패했습니다.`);
      throw new Error(`InvalidTokenError: ${tokenType}`);
    }
  }
}
