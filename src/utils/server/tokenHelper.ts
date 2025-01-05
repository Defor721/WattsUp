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
      throw new Error(`TokenExpiredError: ${tokenType}`);
    } else {
      throw new Error(`InvalidTokenError: ${tokenType}`);
    }
  }
}
