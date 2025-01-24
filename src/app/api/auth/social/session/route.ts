import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { Long } from "mongodb";
import bcrypt from "bcrypt";

import clientPromise from "@/lib/mongodb";
import { verifyToken } from "@/utils/server/tokenHelper";
import {
  handleErrorResponse,
  handleSuccessResponse,
} from "@/server/responseHandler";
import {
  ConflictError,
  TokenExpiredError,
  ValidationError,
} from "@/server/customErrors";

async function insertUserToDB(collection: any, userData: any) {
  const timestamp = new Date();
  await collection.insertOne({
    ...userData,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
}

/** 소셜 회원가입하며 로그인 */
export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("wattsup");
    const collection = db.collection("userdata");

    const emailVerificationToken = request.cookies.get(
      "emailVerificationToken",
    )?.value;
    const businessVerificationToken = request.cookies.get(
      "businessVerificationToken",
    )?.value;

    if (!emailVerificationToken || !businessVerificationToken) {
      throw new ValidationError(
        "Token",
        "인증 정보가 확인되지 않았습니다. 이메일 및 사업자 인증을 진행해 주세요.",
      );
    }

    const emailVerification = verifyToken(
      emailVerificationToken,
      process.env.EMAIL_TOKEN_SECRET!,
      "email",
    );
    const { email, signupType, provider } = emailVerification;

    const businessVerification = verifyToken(
      businessVerificationToken,
      process.env.BUSINESS_TOKEN_SECRET!,
      "business",
    );
    const { businessNumber, principalName, companyName, corporateNumber } =
      businessVerification;

    const existingBusinessNumber = await collection.findOne({
      businessNumber: Long.fromString(businessNumber),
    });
    if (existingBusinessNumber) {
      throw new ConflictError("Business", "이미 등록된 사업자번호입니다.");
    }

    const { password } = await request.json();
    if (!password) {
      throw new ValidationError("Password", "비밀번호를 입력해 주세요.");
    }

    const SALT_ROUND = parseInt(process.env.SALT_ROUND!);
    const hashedPassword = await bcrypt.hash(password, SALT_ROUND);

    const payload = { email };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
      expiresIn: "7d",
    });

    await insertUserToDB(collection, {
      email,
      password: hashedPassword,
      name: principalName,
      signupType,
      provider,
      companyName,
      corporateNumber: Long.fromString(corporateNumber),
      businessNumber: Long.fromString(businessNumber),
      refreshToken,
      role: "member",
      credit: 0,
    });

    const response = handleSuccessResponse({
      message: "Login successful.",
      statusCode: 201,
      data: { accessToken, userMessage: "로그인 성공" },
    });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "none",
    });
    response.cookies.set("emailVerificationToken", "", {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "strict",
      maxAge: 0,
    });
    response.cookies.set("businessVerificationToken", "", {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "strict",
      maxAge: 0,
    });
    return response;
  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
      const response = handleErrorResponse(error);
      response.cookies.set("emailVerificationToken", "", {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "strict",
        maxAge: 0,
      });
      response.cookies.set("businessVerificationToken", "", {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "strict",
        maxAge: 0,
      });
      return response;
    }
    return handleErrorResponse(error);
  }
}
