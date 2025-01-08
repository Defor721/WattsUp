import { NextRequest, NextResponse } from "next/server";
import { Long } from "mongodb";

import clientPromise from "@/lib/mongodb";

function maskEmail(email: string): string {
  const [id, domain] = email.split("@");
  if (id.length <= 2) {
    return `${id[0]}*@${domain}`;
  }
  const maskedId = `${id[0]}${"*".repeat(id.length - 2)}${id[id.length - 1]}`;
  return `${maskedId}@${domain}`;
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("wattsup");
    const collection = db.collection("userdata");

    const { businessNumber, corporateNumber } = await request.json();

    if (!businessNumber || !corporateNumber) {
      return NextResponse.json(
        {
          message: "입력값이 누락되었습니다. 입력값 확인 후 다시 조회해주세요.",
        },
        { status: 400 },
      );
    }

    const user = await collection.findOne({
      businessNumber: Long.fromString(businessNumber),
      corporateNumber: Long.fromString(corporateNumber),
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "해당 정보를 가진 사용자를 찾을 수 없습니다.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "이메일 조회를 성공했습니다.",
        data: maskEmail(user.email),
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
