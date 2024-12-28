import { NextRequest, NextResponse } from "next/server";

import { generateVerificationCode, verificationcodeKey } from "@/utils";
import { checkRedisConnection, redisClient } from "@/lib/redis";
import { sendEmail } from "@/lib/nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "요청에 이메일이 없습니다." },
        { status: 400 },
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

    return NextResponse.json(
      { message: "해당 메일로 코드 전송 완료" },
      { status: 200 },
    );
  } catch (error) {
    console.log(`check error: `, error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

process.on("SIGINT", async () => {
  await redisClient.disconnect();
  process.exit();
});
