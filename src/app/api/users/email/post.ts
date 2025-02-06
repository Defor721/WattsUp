import { NextRequest } from "next/server";
import { Long } from "mongodb";

import { NotFoundError, ValidationError } from "@/server/customErrors";
import {
  handleErrorResponse,
  handleSuccessResponse,
} from "@/server/responseHandler";
import { maskEmail } from "@/server/utils";
import { getCollection } from "@/server/db/mongodb";

export async function POST(request: NextRequest) {
  try {
    const { businessNumber, corporateNumber } = await request.json();

    if (!businessNumber || !corporateNumber) {
      throw new ValidationError(
        "businessNumber or corporateNumber",
        "사업자등록번호 또는 법인등록번호가 잘못 되었습니다. 사업자등록번호와 법인등록번호를 정확히 입력해 주세요.",
      );
    }

    const collection = await getCollection("userdata");
    const user = await collection.findOne({
      businessNumber: Long.fromString(businessNumber),
      corporateNumber: Long.fromString(corporateNumber),
    });

    if (!user) {
      throw new NotFoundError(
        "User",
        "해당 정보를 가진 사용자를 찾을 수 없습니다.",
      );
    }

    return handleSuccessResponse({
      message: "이메일 조회를 성공했습니다.",
      statusCode: 200,
      data: {
        maskEmail: maskEmail(user.email),
        user,
      },
    });
  } catch (error: any) {
    return handleErrorResponse(error);
  }
}
