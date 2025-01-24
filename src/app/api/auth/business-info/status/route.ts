import { ConflictError, ValidationError } from "@/server/customErrors";
import {
  handleErrorResponse,
  handleSuccessResponse,
} from "@/server/responseHandler";
import { NextRequest } from "next/server";

const API_BASE_URL = process.env.BUSINESS_STATUS_API_URL!;
const SERVICE_KEY = process.env.BUSINESS_SERVICE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { businessNumber } = await request.json();

    const response = await fetch(
      `${API_BASE_URL}?serviceKey=${encodeURIComponent(SERVICE_KEY)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          b_no: [businessNumber],
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new ValidationError(
        "External API",
        data?.msg || "외부 API 요청 중 오류가 발생했습니다.",
      );
    }

    const businessInfo = data.data[0];

    if (businessInfo.b_stt_cd !== "01") {
      throw new ConflictError(
        "Business Status",
        "유효하지 않은 사업자 상태입니다. 영업활동 여부를 확인하세요.",
      );
    }

    if (
      businessInfo.tax_type === "국세청에 등록되지 않은 사업자등록번호입니다."
    ) {
      throw new ConflictError(
        "Tax Type",
        "국세청에 등록된 사업자만 가입할 수 있습니다.",
      );
    }

    return handleSuccessResponse({
      message: "유효한 사업자 등록번호입니다.",
      statusCode: 200,
      data: {
        businessNumber,
      },
    });
  } catch (error) {
    return handleErrorResponse(error);
  }
}
