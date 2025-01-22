import { NextRequest } from "next/server";

import clientPromise from "@/lib/mongodb";
import { verifyToken } from "@/utils/server/tokenHelper";
import {
  handleErrorResponse,
  handleSuccessResponse,
} from "@/server/responseHandler";
import { NotFoundError, ValidationError } from "@/server/customErrors";

/** 로그아웃 */
export async function DELETE(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("wattsup");
    const collection = db.collection("userdata");

    const accessToken = request.cookies.get("accessToken")?.value;
    if (!accessToken) {
      throw new ValidationError(
        "accessToken",
        "엑세스 토큰이 누락되었습니다. 로그인을 다시 시도해 주세요.",
      );
    }

    const { email } = await verifyToken(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET!,
      "accessToken",
    );

    const result = await collection.updateOne(
      { email },
      { $unset: { refreshToken: "", updatedAt: new Date() } },
    );

    if (result.matchedCount === 0) {
      throw new NotFoundError(
        "User",
        `해당 이메일(${email})을 가진 사용자를 찾을 수 없습니다.`,
      );
    }

    const response = handleSuccessResponse(`로그아웃 처리되었습니다.`, 200);
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
    return handleErrorResponse(error);
  }
}
