// 하영이 갠적으로 몰라서 주석처리함 ㅜ 주석 지우지 마셈~
import { NextRequest, NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";

// GET 요청 처리
export async function GET(request: NextRequest) {
  try {
    // clientPromise는 MongoDB와 연결된 클라이언트를 비동기로 반환.
    // clientPromise를 통해 MongoDB 클라이언트를 가져옴 -> 실패시 catch 블록에서 처리됨.
    const client = await clientPromise;

    // 사용할 데이터베이스 및 컬렉션 선택
    const db = client.db("wattsup");
    const collection = db.collection("tradedata"); // 데이터베이스 안에서 tradedata라는 이름의 cllection(:db에 들어갈 메뉴이름)을 선택
    try {
      // 컬렉션에서 모든 데이터 조회, _id 필드 제외
      const data = await collection
        .find({}, { projection: { _id: 0 } })
        .toArray();
      // find({}, {...}): 컬렉션의 모든 데이터를 가져옴.
      // {}는 특정 필터 조건 없이 전체 데이터를 가져오겠다는 의미.
      // projection: { _id: 0 } :반환되는 데이터에서 _id 필드를 제외

      // 성공적으로 데이터를 가져왔을 때 JSON 응답 반환
      return NextResponse.json(
        { message: "success to find data", data }, // 응답 메시지와 데이터를 JSON 형식으로 반환.
        { status: 200 }, // 상태 코드 200은 요청이 성공적으로 처리되었음을 의미.
      );
    } catch (error) {
      // 데이터 조회 중 오류 발생 시 500 상태 코드로 응답
      return NextResponse.json(
        { message: "Failed to find Data" },
        { status: 500 }, // 상태 코드 500은 서버 오류를 의미
      );
    }
  } catch (error: unknown) {
    // MongoDB 연결 또는 클라이언트 호출 중 오류 처리
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    // 오류 발생 시 500 상태 코드로 응답
    return NextResponse.json(
      { message: "Failed to find data", error: errorMessage },
      { status: 500 },
    );
  }
}

// * MongoDB 함수 설명
// find(query, options)

// find 결과를 배열로 변환합니다. MongoDB는 기본적으로 커서를 반환하며, 이를 배열로 변경합니다.
