import { NextRequest } from "next/server";
import { Long } from "mongodb";

import clientPromise from "@/lib/mongodb";
import { NotFoundError, ValidationError } from "@/server/customErrors";
import {
  handleErrorResponse,
  handleSuccessResponse,
} from "@/server/responseHandler";

function maskEmail(email: string): string {
  const [id, domain] = email.split("@");
  if (id.length <= 2) {
    return `${id[0]}*@${domain}`;
  }
  const maskedId = `${id[0]}${"*".repeat(id.length - 2)}${id[id.length - 1]}`;
  return `${maskedId}@${domain}`;
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("wattsup");
    const collection = db.collection("userdata");

    const { businessNumber, corporateNumber } = await request.json();

    if (!businessNumber || !corporateNumber) {
      throw new ValidationError(
        "businessNumber or corporateNumber",
        "사업자등록번호 또는 법인등록번호가 잘못 되었습니다. 사업자등록번호와 법인등록번호를 정확히 입력해 주세요.",
      );
    }

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

    return handleSuccessResponse("이메일 조회를 성공했습니다.", 200, {
      maskEmail: maskEmail(user.email),
      user,
    });
  } catch (error: any) {
    return handleErrorResponse(error);
  }
}
