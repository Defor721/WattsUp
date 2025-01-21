import { NextResponse } from "next/server";
import { CustomError } from "./customErrors";

export function handleSuccessResponse(
  data: Record<string, unknown>,
  statusCode = 200,
) {
  return NextResponse.json(
    {
      resultType: "SUCCESS",
      result: {
        ...data,
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

/**
실패시 응답 형태

{
  "resultType": "FAIL",
  "result": {
      "errorCode": "AUTH_EXPIRED",
      "message": "인증이 만료되었습니다.",
      "data": {}
  }
}
 */

/**
성공시 응답 형태

{
  "resultType":"SUCCESS",
  "result":{}
}
 */

// message: 개발자가 볼 것
// data.reason: 이용자가 볼 것
