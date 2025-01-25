import { NextRequest } from "next/server";

import { generateVerificationCode, verificationcodeKey } from "@/utils";
import { checkRedisConnection, redisClient } from "@/lib/redis";
import { sendEmail } from "@/lib/nodemailer";
import {
  handleErrorResponse,
  handleSuccessResponse,
} from "@/server/responseHandler";
import { ValidationError } from "@/server/customErrors";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      throw new ValidationError(
        "email",
        "이메일이 누락되었습니다. 이메일을 입력해주세요.",
      );
    }

    await checkRedisConnection();
    await redisClient.del(verificationcodeKey(email));
    const verificationCode = generateVerificationCode();

    await sendEmail({
      email,
      subject: "Watts Up VPP 회원가입 이메일 인증 코드",
      text: `다음 인증 코드를 입력해주세요: ${verificationCode}`,
    });

    await redisClient.set(verificationcodeKey(email), verificationCode, {
      EX: 60,
    });

    return handleSuccessResponse({
      message: "Code sent to the email address.",
      statusCode: 200,
      data: {
        userMessage: "해당 메일로 코드 전송 완료.",
      },
    });
  } catch (error) {
    return handleErrorResponse(error);
  }
}

process.on("SIGINT", async () => {
  await redisClient.disconnect();
  process.exit();
});
