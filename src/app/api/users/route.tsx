import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

import clientPromise from "@/lib/mongodb";
import { verifyToken } from "@/utils/server/tokenHelper";
import { handleErrorResponse } from "@/server/responseHandler";

/** 유저 조회 */
export async function GET(request: NextRequest) {
  try {
    const authorizationHeader = request.headers.get("Authorization");

    if (!authorizationHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "Token Invalid or Missing" },
        { status: 403 },
      );
    }

    const token = authorizationHeader.split(" ")[1]?.trim();

    if (!token) {
      return NextResponse.json({ message: "Token Missing" }, { status: 403 });
    }
    const decoded = await verifyToken(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
      "accessToken",
    );

    const email = (decoded as { email: string }).email;

    const client = await clientPromise;
    const db = client.db("wattsup");
    const collection = db.collection("userdata");

    const userData = await collection.findOne(
      { email },
      {
        projection: {
          email: 1,
          name: 1,
          signupType: 1,
          provider: 1,
          companyName: 1,
          corporateNumber: 1,
          businessNumber: 1,
          createdAt: 1,
          updatedAt: 1,
          role: 1,
          credit: 1,
        },
      },
    );
    if (!userData) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Success to find user", userData },
      { status: 200 },
    );
  } catch (error) {
    return handleErrorResponse(error);
  }
}
