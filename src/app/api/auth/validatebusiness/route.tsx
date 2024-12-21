import { NextRequest, NextResponse } from "next/server";

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

    if (response.status === 400) {
      return NextResponse.json(
        {
          message: "잘못된 요청입니다.",
          details: data?.msg || "JSON 포맷에 적합하지 않는 요청",
        },
        { status: 400 },
      );
    }

    if (response.status === 404) {
      return NextResponse.json(
        {
          message: "서비스를 찾을 수 없습니다.",
          details: data?.msg || "Not Found Service",
        },
        { status: 404 },
      );
    }

    if (response.status === 411) {
      return NextResponse.json(
        {
          message: "필수 요청 항목이 누락되었습니다.",
          details: data?.msg || "필수 요청 파라미터 누락",
        },
        { status: 411 },
      );
    }

    if (response.status === 413) {
      return NextResponse.json(
        {
          message: "요청 범위를 초과했습니다.",
          details: data?.msg || "요청 사업자번호 100개 초과",
        },
        { status: 413 },
      );
    }

    if (response.status >= 500) {
      return NextResponse.json(
        {
          message: "서버 오류가 발생했습니다.",
          details: data?.msg || "Internal Server Error",
        },
        { status: 500 },
      );
    }

    if (response.ok) {
      const businessInfo = data.data[0];

      if (businessInfo.b_stt_cd !== "01") {
        return NextResponse.json(
          { message: "유효하지 않은 사업자 상태입니다." },
          { status: 403 },
        );
      }

      if (
        businessInfo.tax_type === "국세청에 등록되지 않은 사업자등록번호입니다."
      ) {
        return NextResponse.json(
          { message: "국세청에 등록된 사업자만 가입할 수 있습니다." },
          { status: 403 },
        );
      }

      return NextResponse.json(
        { message: "유효한 사업자 등록번호입니다." },
        { status: 200 },
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(`check error: `, error);
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
