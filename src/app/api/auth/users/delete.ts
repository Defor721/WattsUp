import { NextRequest, NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";
import { verifyToken } from "@/utils/server/tokenHelper";

/** 회원탈퇴 */
export async function DELETE(request: NextRequest) {
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

    const { password } = await request.json();
    console.log(`password: `, password);
    if (!password) {
      return NextResponse.json(
        { message: "비밀번호가 제공되지 않았습니다." },
        { status: 400 },
      );
    }

    const user = await collection.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: `해당 이메일(${email})을 가진 사용자를 찾을 수 없습니다.` },
        { status: 404 },
      );
    }

    if (password !== user.password) {
      return NextResponse.json(
        { message: "비밀번호가 일치하지 않습니다." },
        { status: 401 },
      );
    }

    const result = await collection.deleteOne({ email });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: `해당 이메일(${email})을 가진 사용자를 찾을 수 없습니다.` },
        { status: 404 },
      );
    }

    const response = NextResponse.json(
      { message: `로그아웃 처리되었습니다.` },
      { status: 200 },
    );
    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });
    response.cookies.set("accessToken", "", {
      maxAge: 0,
      path: "/",
    });

    return response;
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
