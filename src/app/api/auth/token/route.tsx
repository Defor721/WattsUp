import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

import clientPromise from "@/lib/mongodb";

interface JwtPayload {
  email: string;
}

export async function POST(request: NextRequest) {
  //토큰 재발급
  try {
    const refresh = request.cookies.get("refreshToken")?.value;

    if (!refresh) {
      return NextResponse.json({ message: "Token Not Found" }, { status: 401 });
    }
    const decodedRefresh = jwt.verify(
      refresh,
      process.env.REFRESH_TOKEN_SECRET as string,
    ) as JwtPayload;
    const rtEmail = decodedRefresh.email;
    const client = await clientPromise;
    const db = client.db("wattsup");
    const collection = db.collection("userdata");
    const user = await collection.findOne({ email: rtEmail });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (user.refreshToken === refresh) {
      const payload = { email: rtEmail };
      const accessSecret = process.env.ACCESS_TOKEN_SECRET as string;
      const newAccessToken = jwt.sign(payload, accessSecret, {
        expiresIn: "1h",
      });
      const refreshSecret = process.env.REFRESH_TOKEN_SECRET as string;
      const newRefreshToken = jwt.sign(payload, refreshSecret, {
        expiresIn: "7d",
      });
      await collection.updateOne(
        { email: rtEmail },
        { $set: { refreshToken: newRefreshToken } },
      );
      const response = NextResponse.json(
        { accessToken: newAccessToken, message: "ok" },
        { status: 200 },
      );
      response.cookies.set("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: true,
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      });
      return response;
    } else {
      return NextResponse.json({ message: "Access Denied" }, { status: 403 });
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
