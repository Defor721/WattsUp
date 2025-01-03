import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

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

    if (verificationResult.status === 400) {
      return NextResponse.json(
        {
          message:
            "서버 오류가 발생했습니다. 페이지를 새로고침 하거나 잠시 후 다시 시도해주세요.",
          details: data?.msg || "JSON 포맷에 적합하지 않는 요청",
        },
        { status: 400 },
      );
    }

    if (verificationResult.status === 404) {
      return NextResponse.json(
        {
          message:
            "서버 오류가 발생했습니다. 페이지를 새로고침 하거나 잠시 후 다시 시도해주세요.",
          details: data?.msg || "서비스를 찾을 수 없습니다.",
        },
        { status: 404 },
      );
    }

    if (verificationResult.status === 411) {
      return NextResponse.json(
        {
          message:
            "서버 오류가 발생했습니다. 페이지를 새로고침 하거나 잠시 후 다시 시도해주세요.",
          details: "필수 요청 파라미터 누락",
        },
        { status: 411 },
      );
    }

    if (verificationResult.status === 413) {
      return NextResponse.json(
        {
          message:
            "서버 오류가 발생했습니다. 페이지를 새로고침 하거나 잠시 후 다시 시도해주세요.",
          details: data?.msg || "요청 사업자번호 100개 초과",
        },
        { status: 413 },
      );
    }

    if (verificationResult.status >= 500) {
      return NextResponse.json(
        {
          message:
            "서버 오류가 발생했습니다. 페이지를 새로고침 하거나 잠시 후 다시 시도해주세요.",
          details: data?.msg || "서버 오류가 발생했습니다.",
        },
        { status: 500 },
      );
    }

    if (verificationResult.status === -5) {
      return NextResponse.json(
        {
          message:
            "외부 서비스와의 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
          details: data?.msg || "HTTP_ERROR",
        },
        { status: 500 },
      );
    }

    const businessInfo = data.data[0];

    if (businessInfo.valid !== "01") {
      return NextResponse.json(
        {
          message: "사업자 정보가 일치하지 않습니다. 입력정보를 확인해주세요.",
        },
        { status: 403 },
      );
    }

    if (businessInfo.status.b_stt_cd !== "01") {
      return NextResponse.json(
        {
          message:
            "유효하지 않은 사업자 상태입니다. 사업자의 영업활동 상태를 확인해주세요.",
        },
        { status: 403 },
      );
    }

    if (
      businessInfo.status.tax_type ===
      "국세청에 등록되지 않은 사업자등록번호입니다."
    ) {
      return NextResponse.json(
        {
          message: "국세청에 등록된 사업자만 가입할 수 있습니다.",
        },
        { status: 403 },
      );
    }

    const businessVerificationToken = jwt.sign(
      {
        principalName: businessInfo.request_param.p_nm,
        businessNumber: businessInfo.request_param.b_no,
        companyName: businessInfo.request_param.b_nm,
        corporateNumber: businessInfo.request_param.corp_no,
      },
      process.env.TEMP_TOKEN_SECRET!,
      { expiresIn: "15m" },
    );

    const response = NextResponse.json(
      { message: "유효한 사업자 등록번호입니다." },
      { status: 200 },
    );
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
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
