import { NextResponse } from "next/server";
import { CustomError } from "./customErrors";

export function handleErrorResponse(error: any) {
  if (error instanceof CustomError) {
    return NextResponse.json(
      {
        resultType: "FAIL",
        error: error.serializeErrors(),
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

/**
실패시 응답 형태

{
  "resultType": "FAIL",
  "error": {
      "errorCode": "AUTH_EXPIRED",
      "reason": "인증이 만료되었습니다.",
      "data": {}
  }
}
 */

/**
성공시 응답 형태

{
  "resultType":"SUCCESS",
  "success":true
}
 */
