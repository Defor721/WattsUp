import { NextResponse, NextRequest } from "next/server";
import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

export async function POST(request: NextRequest) {
  try {
    const refresh = request.cookies.get("refreshToken")?.value;
    if (!refresh) {
      return NextResponse.json(
        { message: "Refresh token is missing" },
        { status: 401 }
      );
    }
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(
        refresh,
        process.env.REFRESH_TOKEN_SECRET as string
      ) as JwtPayload;
    } catch (err) {
      return NextResponse.json(
        { message: "Invalid refresh token" },
        { status: 401 }
      );
    }
    const userId = decoded.userId;
    const client = await clientPromise;
    const db = client.db("wattsup");
    const collection = db.collection("userdata");
    const result = await collection.updateOne(
      { userId },
      { $unset: { refreshToken: "" } }
    );
    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "Refresh token was not removed" },
        { status: 500 }
      );
    }
    const response = NextResponse.json(
      { message: "Logout successful" },
      { status: 200 }
    );
    response.cookies.set("refreshToken", "", {
      httpOnly: true,
      secure: true,
      maxAge: 0,
      path: "/",
      sameSite: "none",
    });
    return response;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to fetch", error: errorMessage },
      { status: 500 }
    );
  }
}
