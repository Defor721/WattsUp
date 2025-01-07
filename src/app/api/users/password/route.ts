import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

import clientPromise from "@/lib/mongodb";
import { verifyToken } from "@/utils/server/tokenHelper";

export async function PATCH(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("wattsup");
    const collection = db.collection("userdata");

    const accessToken = request.cookies.get("accessToken")?.value;
    if (!accessToken) {
      return NextResponse.json(
        { message: "엑세스 토큰이 없습니다." },
        { status: 403 },
      );
    }

    const { email } = await verifyToken(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET!,
      "accessToken",
    );

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

    const { currentPassword, newPassword } = await request.json();

    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordMatch) {
      return NextResponse.json(
        {
          message:
            "입력하신 비밀번호가 정확하지 않습니다. 확인 후 다시 입력해 주세요.",
        },
        { status: 403 },
      );
    }

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
    console.log(error);
    if (error.message.startsWith("TokenExpiredError")) {
      return NextResponse.json({ message: "Token Expired" }, { status: 401 });
    }

    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
