import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import clientPromise from "@/lib/mongodb";

// MongoDB Bid 타입 선언
type Bid = {
  _id: string;
  businessNumber?: number;
  email?: string;
  region: string;
  price: number;
  quantity: number;
  now: string;
};

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const client = await clientPromise;
    const db = client.db("wattsup");
    const collection = db.collection<Bid>("bid");
    const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");
    const pages = parseInt(request.nextUrl.searchParams.get("pages") || "0");

    const bids = await collection.find({}).toArray();

    // 총합 계산 및 문서 개수
    const totalPrice = bids.reduce((sum, bid) => sum + (bid.price || 0), 0);
    const totalQuantity = bids.reduce(
      (sum, bid) => sum + (bid.quantity || 0),
      0,
    );
    const totalCount = bids.length; // 문서 총 개수

    const stats = { totalPrice, totalQuantity, totalCount };

    const bidSet = await collection
      .find({})
      .project({ _id: 0 })
      .skip(pages)
      .limit(limit)
      .toArray();

    return NextResponse.json(
      {
        message: "success",
        bidSet,
        stats, // 총 개수 포함
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error("Error fetching bids:", errorMessage);

    return NextResponse.json(
      { message: "Failed to find data", error: errorMessage },
      { status: 500 },
    );
  }
}
