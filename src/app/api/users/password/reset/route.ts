import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

import clientPromise from "@/lib/mongodb";
import { verifyToken } from "@/utils/server/tokenHelper";

/** 비밀번호 재설정 */
export async function PATCH(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("wattsup");
    const collection = db.collection("userdata");

    const emailVerificationToken = request.cookies.get(
      "emailVerificationToken",
    )?.value;
    if (!emailVerificationToken) {
      return NextResponse.json(
        { message: "이메일 인증 토큰이 없습니다." },
        { status: 400 },
      );
    }

    const emailVerification = await verifyToken(
      emailVerificationToken,
      process.env.EMAIL_TOKEN_SECRET!,
      "email",
    );

    if (!emailVerification) {
      return NextResponse.json(
        {
          message:
            "이메일 인증 세션이 만료되었습니다. 다시 인증을 진행해주세요.",
        },
        { status: 401 },
      );
    }

    const { email } = emailVerification;

    const user = await collection.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "사용자를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    if (user.signupType === "social") {
      return NextResponse.json(
        { message: "소셜 계정의 비밀번호는 변경할 수 없습니다." },
        { status: 403 },
      );
    }

    const { newPassword } = await request.json();

    const SALT_ROUND = parseInt(process.env.SALT_ROUND!);
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUND);

    const updateResult = await collection.updateOne(
      { email },
      { $set: { password: hashedPassword } },
    );

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json(
        { message: "비밀번호 업데이트에 실패했습니다." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "비밀번호가 성공적으로 변경되었습니다." },
      { status: 200 },
    );
  } catch (error: any) {
    if (error.message.startsWith("TokenExpiredError")) {
      let response = NextResponse.json(
        {
          message: "회원가입 세션이 만료되었습니다. 인증을 다시 진행해주세요.",
        },
        { status: 401 },
      );

      if (error.message.includes("email")) {
        response = NextResponse.json(
          {
            message:
              "회원가입 세션이 만료되었습니다. 이메일 인증을 다시 진행해주세요.",
          },
          { status: 401 },
        );
        response.cookies.set("emailVerificationToken", "", {
          httpOnly: true,
          secure: true,
          path: "/",
          sameSite: "strict",
          maxAge: 0,
        });
      }
    }

    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
