import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

import clientPromise from "@/lib/mongodb";
import { businessInfoVerification } from "@/auth/authService";

const validateEnv = () => {
  if (!process.env.TEMP_TOKEN_SECRET) {
    throw new Error("환경 변수가 설정되지 않았습니다.");
  }
};

async function verifyToken(token: string): Promise<JwtPayload> {
  try {
    return jwt.verify(token, process.env.TEMP_TOKEN_SECRET!) as JwtPayload;
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "유효하지 않은 토큰입니다." },
      { status: 401 },
    );
  }
}

async function insertUserToDB(collection: any, userData: any) {
  try {
    await collection.insertOne(userData);
  } catch (error) {
    console.log(error);
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

    const signupToken = request.cookies.get("signupToken")?.value;

    if (!signupToken) {
      return NextResponse.json(
        { message: "토큰을 찾을 수 없습니다." },
        { status: 401 },
      );
    }

    const { email, signupType, provider } = await verifyToken(signupToken);

    const {
      businessNumber,
      startDate,
      name,
      companyName,
      businessType,
      corporateNumber,
      personalId,
    } = await request.json();

    await businessInfoVerification(
      businessNumber,
      startDate,
      name,
      companyName,
    );

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
      name: name,
      signupType,
      provider,
      businessType,
      companyName,
      personalId,
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

    response.cookies.set("signupToken", "", {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "none",
      expires: new Date(0),
    });
    return response;
  } catch (error) {
    console.error("auth exchange 로직에서 에러 발생:", error);
    return NextResponse.json(
      {
        message: "내부 서버 오류가 발생했습니다.",
      },
      { status: 500 },
    );
  }
}
