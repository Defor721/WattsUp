import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const { Authorization } = await request.json();
    if (!Authorization) {
      return NextResponse.json({ message: "Access Denied" }, { status: 403 });
    }
    if (Authorization.startsWith("Bearer ")) {
      const token = Authorization.split(" ")[1]?.trim();
      try {
        const decoded = jwt.verify(
          token,
          process.env.ACCESS_TOKEN_SECRET as string,
        ) as JwtPayload;
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp! < currentTime) {
          return NextResponse.json(
            { message: "Token Expired" },
            { status: 401 },
          );
        } else {
          const email = decoded.email;
          const client = await clientPromise;
          const db = client.db("wattsup");
          const collection = db.collection("userdata");
          const userData = await collection.findOne(
            { email: email },
            {
              projection: {
                email: 1,
                signupType: 1,
                provider: 1,
                businessType: 1,
                personalId: 1,
                corporateNumber: 1,
                businessNumber: 1,
                companyName: 1,
              },
            },
          );
          if (!userData) {
            return NextResponse.json(
              { message: "User not found" },
              { status: 404 },
            );
          } else {
            return NextResponse.json(
              { message: "Success to find user" },
              { status: 200 },
            );
          }
        }
      } catch (error) {
        return NextResponse.json(
          { message: "Failed to Decode" },
          { status: 403 },
        );
      }
    } else {
      return NextResponse.json({ message: "Token Invalid" }, { status: 403 });
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

export async function POST(request: NextRequest) {
  try {
    const {
      email,
      signupType,
      provider,
      businessType,
      personalId,
      corporateNumber,
      businessNumber,
      companyName,
    } = await request.json();
    const client = await clientPromise;
    const db = client.db("wattsup");
    const check = await db.collection("userdata").findOne({ email: email });
    if (!check) {
      await db.collection("userdata").insertOne({
        email,
        signupType,
        provider,
        businessType,
        personalId,
        corporateNumber,
        businessNumber,
        companyName,
        dateCreate: new Date(),
      });
      return NextResponse.json(
        { message: "Sign up successfully" },
        { status: 201 },
      );
    } else {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 },
      );
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to create data", error: errorMessage },
      { status: 500 },
    );
  }
}
