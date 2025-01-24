import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import clientPromise from "@/lib/mongodb";
import { DatabaseError, ValidationError } from "@/server/customErrors";
import {
  handleErrorResponse,
  handleSuccessResponse,
} from "@/server/responseHandler";

/**
 * 일반 로그인
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password }: { email: string; password: string } =
      await request.json();

    if (!email || !password) {
      throw new ValidationError(
        "email or password",
        "필수 정보가 누락되었습니다.",
      );
    }

    const client = await clientPromise;
    const db = client.db("wattsup");
    const collection = db.collection("userdata");

    const user = await collection.findOne({ email });
    if (!user) {
      throw new ValidationError(
        "email or password",
        "아이디 또는 비밀번호가 잘못 되었습니다. 아이디와 비밀번호를 정확히 입력해 주세요.",
      );
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new ValidationError(
        "email or password",
        "아이디 또는 비밀번호가 잘못 되었습니다. 아이디와 비밀번호를 정확히 입력해 주세요.",
      );
    }

    const payload = { email: email };
    const accessSecret = process.env.ACCESS_TOKEN_SECRET as string;
    const accessToken = jwt.sign(payload, accessSecret, { expiresIn: "1h" });
    const refreshSecret = process.env.REFRESH_TOKEN_SECRET as string;
    const refreshToken = jwt.sign(payload, refreshSecret, {
      expiresIn: "7d",
    });

    const updateResult = await collection.updateOne(
      { email },
      { $set: { refreshToken: refreshToken, updatedAt: new Date() } },
    );

    if (updateResult.modifiedCount === 0) {
      throw new DatabaseError("리프레시 토큰 업데이트에 실패했습니다.");
    }

    const response = handleSuccessResponse({
      message: "Login successful.",
      statusCode: 201,
      data: { accessToken, userMessage: "로그인 성공" },
    });
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
      sameSite: "none",
    });

    return response;
  } catch (error: unknown) {
    return handleErrorResponse(error);
  }
}
