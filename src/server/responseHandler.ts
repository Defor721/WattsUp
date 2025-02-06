import { NextResponse } from "next/server";
import { CustomError } from "./customErrors";

interface handleSuccessResponseProps {
  message: string;
  statusCode: number;
  data?: Record<string, unknown>;
}

export function handleSuccessResponse({
  message,
  statusCode,
  data = {},
}: handleSuccessResponseProps) {
  return NextResponse.json(
    {
      resultType: "SUCCESS",
      result: {
        message,
        data,
      },
    },
    { status: statusCode },
  );
}

export function handleErrorResponse(error: unknown) {
  if (error instanceof CustomError) {
    return NextResponse.json(
      {
        resultType: "FAIL",
        result: error.serializeErrors(),
      },
      { status: error.statusCode },
    );
  }

  return NextResponse.json(
    {
      resultType: "FAIL",
      result: {
        errorCode: "INTERNAL_SERVER_ERROR",
        message: "서버 오류가 발생했습니다.",
        data: {},
      },
    },
    { status: 500 },
  );
}
