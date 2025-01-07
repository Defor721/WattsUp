import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Long } from "mongodb";
import bcrypt from "bcrypt";

import clientPromise from "@/lib/mongodb";
import { verifyToken } from "@/utils/server/tokenHelper";

const validateEnv = () => {
  if (!process.env.BUSINESS_TOKEN_SECRET) {
    throw new Error("환경 변수가 설정되지 않았습니다.");
  }
};

async function insertUserToDB(collection: any, userData: any) {
  try {
    const timestamp = new Date();

    await collection.insertOne({
      ...userData,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "데이터베이스에 데이터를 삽입하는 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

/** 소셜 회원가입하며 로그인 */
export async function POST(request: NextRequest) {
  try {
    validateEnv();
    const client = await clientPromise;
    const db = client.db("wattsup");
    const collection = db.collection("userdata");

    const emailVerificationToken = request.cookies.get(
      "emailVerificationToken",
    )?.value;
    const businessVerificationToken = request.cookies.get(
      "businessVerificationToken",
    )?.value;

    if (!emailVerificationToken) {
      return NextResponse.json(
        { message: "토큰을 찾을 수 없습니다." },
        { status: 401 },
      );
    }

    if (!businessVerificationToken) {
      return NextResponse.json(
        { message: "토큰을 찾을 수 없습니다." },
        { status: 401 },
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

    const { email, signupType, provider } = emailVerification;
    const user = await collection.findOne({ email });

    if (user?.signupType === "native") {
      return NextResponse.json(
        {
          accessToken: "",
          message:
            "해당 이메일은 일반 회원으로 등록되어 있습니다. 일반 로그인을 이용해 주세요.",
        },
        { status: 409 },
      );
    }

    if (user?.signupType === "social") {
      return NextResponse.json(
        {
          accessToken: "",
          message:
            "해당 이메일은 소셜 회원으로 등록되어 있습니다. 소셜 로그인을 이용해 주세요.",
        },
        { status: 409 },
      );
    }

    const businessVerification = await verifyToken(
      businessVerificationToken,
      process.env.BUSINESS_TOKEN_SECRET!,
      "business",
    );

    if (!businessVerification) {
      return NextResponse.json(
        {
          message:
            "사업자 번호 인증 세션이 만료되었습니다. 다시 인증을 진행해주세요.",
        },
        { status: 401 },
      );
    }

    const { businessNumber, principalName, companyName, corporateNumber } =
      businessVerification;

    const existingBusiness = await collection.findOne({ businessNumber });
    if (existingBusiness) {
      return NextResponse.json(
        { message: "이미 등록된 사업자번호입니다." },
        { status: 409 },
      );
    }

    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { message: "입력값을 모두 입력해야 합니다." },
        { status: 400 },
      );
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

    const response = NextResponse.json(
      { message: "로그인 성공", accessToken },
      { status: 201 },
    );

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
    if (error.message.startsWith("TokenExpiredError")) {
      let response = NextResponse.json(
        {
          message: "세션이 만료되었습니다. 인증을 다시 진행해주세요.",
        },
        { status: 401 },
      );

      if (error.message.includes("email")) {
        response = NextResponse.json(
          {
            message:
              "세션이 만료되었습니다. 뒤로가기 버튼을 눌러 이메일 인증을 다시 진행해주세요.",
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
        response.cookies.set("businessVerificationToken", "", {
          httpOnly: true,
          secure: true,
          path: "/",
          sameSite: "strict",
          maxAge: 0,
        });
      }

      if (error.message.includes("business")) {
        response = NextResponse.json(
          {
            message:
              "회원가입 세션이 만료되었습니다. 사업자 번호 인증을 다시 진행해주세요.",
          },
          { status: 401 },
        );
        response.cookies.set("businessVerificationToken", "", {
          httpOnly: true,
          secure: true,
          path: "/",
          sameSite: "strict",
          maxAge: 0,
        });
      }

      return response;
    }
    return NextResponse.json(
      {
        message: "내부 서버 오류가 발생했습니다.",
      },
      { status: 500 },
    );
  }
}
