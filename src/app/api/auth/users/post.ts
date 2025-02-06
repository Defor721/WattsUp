import { NextRequest } from "next/server";
import { Long } from "mongodb";
import bcrypt from "bcrypt";

import { verifyToken } from "@/server/utils/tokenHelper";
import {
  ConflictError,
  TokenExpiredError,
  ValidationError,
} from "@/server/customErrors";
import {
  handleErrorResponse,
  handleSuccessResponse,
} from "@/server/responseHandler";
import { getCollection, insertDataToDB } from "@/server/db/mongodb";

/** 일반 회원가입 */
export async function POST(request: NextRequest) {
  try {
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

    const collection = await getCollection("userdata");
    const existingUser = await collection.findOne({ email });
    if (existingUser) {
      throw new ValidationError(
        "User",
        existingUser.signupType === "native"
          ? "해당 이메일은 일반 회원으로 등록되어 있습니다. 일반 로그인을 이용해 주세요."
          : "해당 이메일은 소셜 회원으로 등록되어 있습니다. 소셜 로그인을 이용해 주세요.",
      );
    }

    const businessVerification = verifyToken(
      businessVerificationToken,
      process.env.BUSINESS_TOKEN_SECRET!,
      "business",
    );

    const { principalName, businessNumber, companyName, corporateNumber } =
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

    await insertDataToDB(collection, {
      email,
      password: hashedPassword,
      name: principalName,
      signupType,
      provider,
      companyName,
      corporateNumber: Long.fromString(corporateNumber),
      businessNumber: Long.fromString(businessNumber),
      role: "member",
      credit: 0,
    });

    const response = handleSuccessResponse({
      message: "Registration successful.",
      statusCode: 201,
      data: { userMessage: "회원가입이 완료되었습니다." },
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
