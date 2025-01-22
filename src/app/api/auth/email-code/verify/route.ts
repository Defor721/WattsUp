import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

import { verificationcodeKey } from "@/utils";
import { checkRedisConnection, redisClient } from "@/lib/redis";
import {
  handleErrorResponse,
  handleSuccessResponse,
} from "@/server/responseHandler";
import { ValidationError } from "@/server/customErrors";

export async function POST(request: NextRequest) {
  try {
    const { email, emailCode } = await request.json();

    if (!email || !emailCode) {
      throw new ValidationError(
        "email or emailCode",
        "이메일과 인증 코드를 모두 입력해야 합니다.",
      );
    }

    await checkRedisConnection();

    const storedCode = await redisClient.get(verificationcodeKey(email));
    await redisClient.del(verificationcodeKey(email));
    if (!storedCode) {
      throw new ValidationError(
        "emailCode",
        "인증 코드가 만료되었거나 존재하지 않습니다.",
      );
    }
    if (storedCode !== emailCode) {
      throw new ValidationError("emailCode", "인증 코드가 유효하지 않습니다.");
    }

    const emailVerificationToken = jwt.sign(
      {
        email: email,
        signupType: "native",
        provider: null,
      },
      process.env.EMAIL_TOKEN_SECRET!,
      { expiresIn: "15m" },
    );

    const response = handleSuccessResponse("이메일 인증을 완료했습니다.", 200);
    response.cookies.set("emailVerificationToken", emailVerificationToken, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    return handleErrorResponse(error);
  }
}
