import { NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";

// ContextParams 타입 수정
type ContextParams = {
  params: { businessNumber: string };
};

// 핸들러 정의
export async function GET(
  request: Request,
  context: { params: { businessNumber: string } }, // Next.js에서 예상하는 동기 타입으로 명시
): Promise<Response> {
  try {
    const { businessNumber } = context.params;

    // businessNumber가 없으면 400 응답 반환
    if (!businessNumber) {
      return NextResponse.json(
        { message: "Business number is missing" },
        { status: 400 },
      );
    }

    // MongoDB 연결
    const client = await clientPromise;
    const db = client.db("wattsup");
    const collection = db.collection("bid");

    // MongoDB에서 데이터 검색
    const bidList = await collection
      .find({ businessNumber: Number(businessNumber) })
      .toArray();

    // 결과가 없으면 404 응답 반환
    if (bidList.length === 0) {
      return NextResponse.json(
        { message: `No data found for business number: ${businessNumber}` },
        { status: 404 },
      );
    }

    // 성공적으로 데이터 검색 시 200 응답 반환
    return NextResponse.json(
      { message: "Data retrieved successfully", bidList },
      { status: 200 },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    console.error("Error occurred during data fetch:", errorMessage);

    // 서버 에러 발생 시 500 응답 반환
    return NextResponse.json(
      { message: "Failed to retrieve data", error: errorMessage },
      { status: 500 },
    );
  }
}
