import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient, RedisClientType } from "redis";

import { generateVerificationCode } from "@/utils";

const redisClient: RedisClientType = createClient({
  url: process.env.REDIS_URL, // Redis 클라우드 URL
  password: process.env.REDIS_PASSWORD, // Redis 인증 비밀번호
});

// 에러 이벤트 리스너
redisClient
  .connect()
  .catch((error) => console.error("Redis 연결 실패:", error));

const transporter = nodemailer.createTransport({
  service: "Gmail", // Gmail 또는 원하는 이메일 서비스 제공자
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // 이메일 비밀번호 또는 앱 비밀번호
  },
});

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "요청에 이메일이 없습니다." },
        { status: 400 },
      );
    }

    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    const verificationCode = generateVerificationCode();

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: "VPP 회원가입 이메일 인증 코드",
      text: `다음 인증 코드를 입력해주세요: ${verificationCode}`,
    });

    await redisClient.set(email, verificationCode, { EX: 300 });

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
