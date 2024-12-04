import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const { userId, password }: { userId: string; password: string } =
      await request.json();
    const client = await clientPromise;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to find data", error: errorMessage },
      { status: 500 }
    );
  }
}
