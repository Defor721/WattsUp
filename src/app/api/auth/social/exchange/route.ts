import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

import clientPromise from "@/lib/mongodb";
import {
  fetchGoogleTokens,
  fetchGoogleUserInfo,
} from "@/auth/services/server/authService";
import { ConflictError, ValidationError } from "@/server/customErrors";
import {
  handleErrorResponse,
  handleSuccessResponse,
} from "@/server/responseHandler";

/** 구글 토큰 교환 */
export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("wattsup");
    const collection = db.collection("userdata");
    const { authorizationCode } = await request.json();

    if (!authorizationCode) {
      throw new ValidationError(
        "AuthorizationCode",
        "구글 인증 코드가 누락되었습니다. 다시 시도해 주세요.",
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 100));

    const { access_token } = await fetchGoogleTokens(authorizationCode);
    const googleUser = await fetchGoogleUserInfo(access_token);

    // DB에서 유저 확인
    const user = await collection.findOne({ email: googleUser.email });
    if (user?.signupType === "native") {
      throw new ConflictError(
        "User",
        "해당 이메일은 일반 회원으로 등록되어 있습니다. 일반 로그인을 이용해 주세요.",
      );
    }

    // 이미 회원가입 완료된 계정: 임시 토큰 반환
    if (user?.businessNumber) {
      const payload = { email: user.email };
      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
        expiresIn: "1h",
      });
      const refreshToken = jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_SECRET!,
        { expiresIn: "7d" },
      );

      // DB에 리프레시 토큰 저장
      await collection.updateOne(
        { email: user.email },
        { $set: { refreshToken, updatedAt: new Date() } },
      );

      const response = handleSuccessResponse({
        message: "Login successful.",
        statusCode: 201,
        data: {
          accessToken,
          resultCode: "LOGIN_SUCCESS",
          userMessage: "로그인 성공.",
        },
      });
      response.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "none",
      });
      return response;
    }

    // 추가 정보 입력이 필요한 경우: 임시 토큰 반환
    const emailVerificationToken = jwt.sign(
      {
        email: googleUser.email,
        signupType: "social",
        provider: "google",
      },
      process.env.EMAIL_TOKEN_SECRET!,

      { expiresIn: "15m" },
    );

    const response = handleSuccessResponse({
      message: "Additional information required.",
      statusCode: 201,
      data: {
        resultCode: "INFO_REQUIRED",
        userMessage: "추가 정보 입력이 필요합니다. 추가 정보를 입력해 주세요.",
      },
    });

    response.cookies.set("emailVerificationToken", emailVerificationToken, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    return handleErrorResponse(error);
  }
}
