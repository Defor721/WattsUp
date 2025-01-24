import { NextRequest } from "next/server";
import bcrypt from "bcrypt";

import clientPromise from "@/lib/mongodb";
import { verifyToken } from "@/utils/server/tokenHelper";
import {
  handleErrorResponse,
  handleSuccessResponse,
} from "@/server/responseHandler";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "@/server/customErrors";

/** 회원탈퇴 */
export async function DELETE(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("wattsup");
    const collection = db.collection("userdata");

    const accessToken = request.cookies.get("accessToken")?.value;
    if (!accessToken) {
      throw new ValidationError(
        "accessToken",
        "엑세스 토큰이 존재하지 않습니다. 브라우저의 새로고침 버튼을 눌러주세요.",
      );
    }

    const { email } = verifyToken(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET!,
      "accessToken",
    );

    const { password } = await request.json();
    if (!password) {
      throw new ValidationError("password", "비밀번호를 입력해주세요.");
    }

    const user = await collection.findOne({ email });
    if (!user) {
      throw new NotFoundError(
        "User",
        `해당 이메일(${email})의 사용자를 찾을 수 없습니다.`,
      );
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new ConflictError(
        "Password",
        "비밀번호가 일치하지 않습니다. 옳바른 비밀번호를 입력해주세요.",
      );
    }

    const result = await collection.deleteOne({ email });
    if (result.deletedCount === 0) {
      if (result.deletedCount === 0) {
        throw new NotFoundError(
          "User",
          `해당 이메일(${email})의 사용자를 찾을 수 없습니다.`,
        );
      }
    }

    const response = handleSuccessResponse({
      message: "회원 탈퇴가 완료되었습니다.",
      statusCode: 200,
    });
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
