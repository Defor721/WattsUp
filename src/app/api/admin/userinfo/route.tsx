import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("wattsup");
    const collection = db.collection("userdata");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");
    const pages = parseInt(request.nextUrl.searchParams.get("pages") || "0");

    // role이 admin이 아닌 유저만 조회
    const users = await collection.find({ role: { $ne: "admin" } }).toArray();

    const userSet = await collection
      .find({ role: { $ne: "admin" } }) // $ne: "admin" 필터 추가
      // .sort({ createdAt: -1 })
      .project({ _id: 0, password: 0, refreshToken: 0 })
      .skip(pages * limit)
      .limit(limit)
      .toArray();

    const totalCount = users.length;

    return NextResponse.json(
      { message: "success", userSet, totalCount },
      { status: 200 },
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to find data", error: errorMessage },
      { status: 500 },
    );
  }
}
