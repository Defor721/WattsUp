import { NextRequest, NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";
import { verifyToken } from "@/utils/tokenHelper";

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

    const { email, signupType, provider } = await verifyToken(
      emailVerificationToken,
      process.env.TEMP_TOKEN_SECRET!,
    );

    const { principalName, businessNumber, companyName } = await verifyToken(
      businessVerificationToken,
      process.env.TEMP_TOKEN_SECRET!,
    );

    const { password, businessType, corporateNumber, personalId } =
      await request.json();

    await insertUserToDB(collection, {
      email,
      password,
      name,
      signupType,
      provider,
      businessType,
      companyName,
      personalId,
      corporateNumber,
      businessNumber,
    });

    console.log(`emailVerificationToken: `, email, signupType, provider);
    console.log(
      `businessVerificationToken: `,
      principalName,
      businessNumber,
      companyName,
    );

    return NextResponse.json({ message: "가입 성공" }, { status: 200 });
  } catch (error: any) {
    if (error.message === "TokenExpiredError") {
      return NextResponse.json(
        {
          message: "회원가입 세션이 만료되었습니다. 다시 인증을 진행해주세요.",
        },
        { status: 401 },
      );
    }
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
