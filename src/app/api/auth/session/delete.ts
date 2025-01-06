import { NextRequest, NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";
import { verifyToken } from "@/utils/server/tokenHelper";

/** 로그아웃 */
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

    const result = await collection.updateOne(
      { email },
      { $unset: { refreshToken: "" } },
    );

    if (result.matchedCount === 0) {
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
    if (error.message.startsWith("TokenExpiredError")) {
      return NextResponse.json({ message: "Token Expired" }, { status: 401 });
    }

    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
