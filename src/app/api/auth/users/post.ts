import { NextRequest, NextResponse } from "next/server";
import { Long } from "mongodb";
import bcrypt from "bcrypt";

import clientPromise from "@/lib/mongodb";
import { verifyToken } from "@/utils/server/tokenHelper";

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

/** 일반 회원가입 */
export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("wattsup");
    const collection = db.collection("userdata");

    const emailVerificationToken = request.cookies.get(
      "emailVerificationToken",
    )?.value;
    if (!emailVerificationToken) {
      return NextResponse.json(
        { message: "이메일 인증 토큰이 없습니다." },
        { status: 400 },
      );
    }

    const businessVerificationToken = request.cookies.get(
      "businessVerificationToken",
    )?.value;
    if (!businessVerificationToken) {
      return NextResponse.json(
        { message: "사업자 인증 토큰이 없습니다." },
        { status: 400 },
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
            "사업자 인증 세션이 만료되었습니다. 다시 인증을 진행해주세요.",
        },
        { status: 401 },
      );
    }
    const { principalName, businessNumber, companyName, corporateNumber } =
      businessVerification;

    const existingEmail = await collection.findOne({ email });
    if (existingEmail) {
      return NextResponse.json(
        { status: "error", message: "이미 가입된 이메일입니다." },
        { status: 409 },
      );
    }

    const existingBusinessNumber = await collection.findOne({ businessNumber });
    if (existingBusinessNumber) {
      return NextResponse.json(
        { status: "error", message: "이미 등록된 사업자등록번호입니다." },
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

    await insertUserToDB(collection, {
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

    const response = NextResponse.json(
      { message: "회원가입 성공" },
      { status: 201 },
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

    return response;
  } catch (error: any) {
    if (error.message.startsWith("TokenExpiredError")) {
      let response = NextResponse.json(
        {
          message: "회원가입 세션이 만료되었습니다. 인증을 다시 진행해주세요.",
        },
        { status: 401 },
      );

      if (error.message.includes("email")) {
        response = NextResponse.json(
          {
            message:
              "회원가입 세션이 만료되었습니다. 이메일 인증을 다시 진행해주세요.",
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
      { message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
