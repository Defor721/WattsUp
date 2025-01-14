// utils/server/errorHandler.ts
import { NextResponse } from "next/server";

import { CustomError } from "./customErrors";

export function handleErrorResponse(error: any) {
  if (error instanceof CustomError) {
    return NextResponse.json(
      {
        resultType: "FAIL",
        error: {
          errorCode: error.errorCode,
          reason: error.message,
          data: error.data || {}, // 추가 데이터를 포함할 수 있음
        },
      },
      { status: error.statusCode },
    );
  }

  return NextResponse.json(
    {
      resultType: "FAIL",
      error: {
        errorCode: "INTERNAL_SERVER_ERROR",
        reason: "서버 오류가 발생했습니다.",
        data: {},
      },
    },
    { status: 500 },
  );
}
