import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import clientPromise from "@/lib/mongodb";

export async function GET(
  request: NextRequest,
  { params }: { params: { email: string } },
) {
  try {
    const email = params.email;
    if (!email) {
      return NextResponse.json(
        { message: "Email parameter is required" },
        { status: 400 },
      );
    }
    const client = await clientPromise;
    const db = client.db("wattsup");
    const collection = db.collection("userdata");
    const userData = await collection
      .find({ email: email })
      .project({ _id: 0, password: 0, refreshToken: 0 })
      .toArray();
    return NextResponse.json({ message: "success", userData }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to find data", error: errorMessage },
      { status: 500 },
    );
  }
}
