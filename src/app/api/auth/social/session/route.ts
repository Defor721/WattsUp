import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

import clientPromise from "@/lib/mongodb";
import { verifyToken } from "@/utils/server/tokenHelper";

const validateEnv = () => {
  if (!process.env.TEMP_TOKEN_SECRET) {
    throw new Error("환경 변수가 설정되지 않았습니다.");
  }
};

async function insertUserToDB(collection: any, userData: any) {
  try {
    await collection.insertOne(userData);
  } catch (error) {
    return NextResponse.json(
      { message: "데이터베이스에 데이터를 삽입하는 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

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
      process.env.TEMP_TOKEN_SECRET!,
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

    const businessVerification = await verifyToken(
      businessVerificationToken,
      process.env.TEMP_TOKEN_SECRET!,
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

    const payload = { email };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
      expiresIn: "7d",
    });

    await insertUserToDB(collection, {
      email,
      password: null,
      name: principalName,
      signupType,
      provider,
      companyName,
      corporateNumber,
      businessNumber,
      refreshToken,
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
