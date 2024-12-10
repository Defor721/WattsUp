import { Twilio } from "twilio";
import { NextRequest, NextResponse } from "next/server";

import clientPromise from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, message } = await request.json();

    if (!phoneNumber || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // const client = await clientPromise;
    // const db = client.db("mydatabase");

    // Twilio 설정
    const twilioClient = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );

    // Twilio SMS 전송
    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    // 알림 기록 저장
    // await db.collection("notifications").insertOne({
    //   phoneNumber,
    //   message,
    //   status: "sent",
    //   createdAt: new Date(),
    // });

    return NextResponse.json(
      { success: true, messageId: result.sid },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 },
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    { status: 204, headers: { Allow: "POST, OPTIONS" } },
  );
}
