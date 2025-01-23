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
    const select = request.nextUrl.searchParams.get("select") || "";
    const target = request.nextUrl.searchParams.get("target")
      ? decodeURIComponent(request.nextUrl.searchParams.get("target")!)
      : "";

    const query: any = { role: { $ne: "admin" } };

    const allowedFields = [
      "name",
      "email",
      "companyName",
      "corporateNumber",
      "businessNumber",
    ];
    if (select && target && allowedFields.includes(select)) {
      query[select] = new RegExp(target, "i");
    }

    const totalCount = await collection.countDocuments(query);

    const userSet = await collection
      .find(query)
      .project({ _id: 0, password: 0, refreshToken: 0 })
      .sort({ createdAt: -1 })
      .skip(pages * limit)
      .limit(limit)
      .toArray();

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
