import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

import clientPromise from "@/lib/mongodb";
import { businessInfoVerification } from "@/auth/authService";

const validateEnv = () => {
  if (!process.env.TEMP_TOKEN_SECRET) {
    throw new Error("환경 변수가 설정되지 않았습니다.");
  }
};

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

    const { email, signupType, provider } = jwt.verify(
      signupToken,
      process.env.TEMP_TOKEN_SECRET!,
    ) as JwtPayload;

    const {
      businessNumber,
      startDate,
      pricipalName,
      companyName,
      businessType,
      corporateNumber,
      personalId,
    } = await request.json();

    await businessInfoVerification(
      businessNumber,
      startDate,
      pricipalName,
      companyName,
    );

    collection.insertOne({
      email,
      signupType,
      provider,
      businessType,
      personalId,
      corporateNumber,
      businessNumber,
      startDate,
      name: pricipalName,
    });
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
