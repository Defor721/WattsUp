import { NextResponse } from "next/server";

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
