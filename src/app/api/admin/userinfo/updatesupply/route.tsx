import { NextRequest, NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("wattsup");
    const collection = db.collection("supply");

    // 요청 본문 데이터 파싱
    const { date, regions } = await request.json();

    // 데이터 검증
    if (!date || !Array.isArray(regions) || regions.length === 0) {
      return NextResponse.json(
        {
          message: "Invalid request. 'date' and 'regions' array are required.",
        },
        { status: 400 },
      );
    }

    const requestDate = new Date(date);

    // 기존 문서 가져오기 (유일한 문서)
    const existingDocument = await collection.findOne({});

    if (existingDocument) {
      // 기존 문서의 `updatedAt`이 요청의 `date`와 같은 경우 업데이트 취소
      if (
        existingDocument.updatedAt &&
        new Date(existingDocument.updatedAt).toISOString().split("T")[0] ===
          requestDate.toISOString().split("T")[0]
      ) {
        return NextResponse.json(
          { message: "No update performed. Date matches existing document." },
          { status: 200 },
        );
      }

      // 기존 문서의 `updatedAt`이 요청의 `date`와 다른 경우
      const incUpdates: Record<string, number> = {};
      regions.forEach(({ region, amgo }: { region: string; amgo: number }) => {
        if (region && typeof amgo === "number") {
          incUpdates[region] = amgo; // 각 지역의 값을 증가하도록 설정
        }
      });

      if (Object.keys(incUpdates).length === 0) {
        return NextResponse.json(
          { message: "No valid regions data provided." },
          { status: 400 },
        );
      }

      // 기존 문서를 업데이트
      const result = await collection.updateOne(
        { _id: existingDocument._id }, // 기존 문서의 ID로 업데이트
        {
          $set: { updatedAt: requestDate }, // `updatedAt`을 요청 `date`로 변경
          $inc: incUpdates, // 지역 값 증가
        },
      );

      return NextResponse.json(
        {
          message: "Document updated with new date and values incremented.",
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount,
        },
        { status: 200 },
      );
    } else {
      // 문서가 없으면 새로 생성
      const initialData: Record<string, number> = {};
      regions.forEach(({ region, amgo }: { region: string; amgo: number }) => {
        if (region && typeof amgo === "number") {
          initialData[region] = amgo;
        }
      });

      const result = await collection.insertOne({
        updatedAt: requestDate,
        ...initialData,
      });

      return NextResponse.json(
        {
          message: "New document created.",
          insertedId: result.insertedId,
        },
        { status: 200 },
      );
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to find data", error: errorMessage },
      { status: 500 },
    );
  }
}
