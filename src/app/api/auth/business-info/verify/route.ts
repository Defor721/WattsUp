import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import {
  handleErrorResponse,
  handleSuccessResponse,
} from "@/server/responseHandler";
import { ConflictError, ValidationError } from "@/server/customErrors";

const API_BASE_URL = process.env.BUSINESS_INFO_VERIFICATION_API_URL!;
const SERVICE_KEY = process.env.BUSINESS_SERVICE_KEY!;

export async function POST(request: NextRequest) {
  try {
    const {
      businessNumber,
      startDate,
      principalName,
      companyName,
      corporateNumber,
    } = await request.json();

    if (!businessNumber || !startDate || !principalName || !companyName) {
      throw new ValidationError(
        "Business Info",
        "필수 사업자 정보를 모두 입력해 주세요.",
      );
    }

    const verificationResult = await fetch(
      `${API_BASE_URL}?serviceKey=${encodeURIComponent(SERVICE_KEY)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          businesses: [
            {
              b_no: businessNumber,
              start_dt: startDate,
              p_nm: principalName,
              p_nm2: "",
              b_nm: companyName,
              corp_no: corporateNumber,
              b_sector: "",
              b_type: "",
              b_adr: "",
            },
          ],
        }),
      },
    );

    const data = await verificationResult.json();

    if (!verificationResult.ok) {
      throw new ValidationError(
        "External API",
        data?.msg || "외부 API 요청 중 오류가 발생했습니다.",
      );
    }

    const businessInfo = data.data[0];
    if (!businessInfo) {
      throw new ValidationError(
        "API Response",
        "응답 데이터가 올바르지 않습니다.",
      );
    }

    if (businessInfo.valid !== "01") {
      throw new ConflictError(
        "Business Valid",
        "사업자 정보가 일치하지 않습니다. 입력 정보를 확인해주세요.",
      );
    }

    if (businessInfo.status.b_stt_cd !== "01") {
      throw new ConflictError(
        "Business Status",
        "유효하지 않은 사업자 상태입니다. 영업활동 여부를 확인해주세요.",
      );
    }

    if (
      businessInfo.status.tax_type ===
      "국세청에 등록되지 않은 사업자등록번호입니다."
    ) {
      throw new ConflictError(
        "Tax Type",
        "국세청에 등록된 사업자만 가입할 수 있습니다.",
      );
    }

    const businessVerificationToken = jwt.sign(
      {
        principalName: businessInfo.request_param.p_nm,
        businessNumber: businessInfo.request_param.b_no,
        companyName: businessInfo.request_param.b_nm,
        corporateNumber: businessInfo.request_param.corp_no,
      },
      process.env.BUSINESS_TOKEN_SECRET!,
      { expiresIn: "15m" },
    );

    const response = handleSuccessResponse({
      message: "유효한 사업자 등록번호입니다.",
      statusCode: 200,
    });
    response.cookies.set(
      "businessVerificationToken",
      businessVerificationToken,
      {
        httpOnly: true,
        secure: true,
        path: "/",
        sameSite: "strict",
      },
    );

    return response;
  } catch (error) {
    const response = handleErrorResponse(error);
    response.cookies.set("businessVerificationToken", "", {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "strict",
      maxAge: 0, // 쿠키 즉시 삭제
    });
    return response;
  }
}
