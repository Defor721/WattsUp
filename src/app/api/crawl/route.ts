import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

export async function GET() {
  try {
    // 1. URL 설정
    const url = "https://www.kpx.or.kr/main/#section-2nd";

    // 2. HTTP 요청 보내기
    const { data } = await axios.get(url);

    // 3. HTML 파싱
    const $ = cheerio.load(data);

    // 4. "오늘의 SMP" 데이터 추출
    const todaySmpData: { [key: string]: string | number } = {};
    const todaySmpHeader = $("caption").filter((i, el) =>
      $(el).text().includes("오늘의 SMP"),
    );

    if (todaySmpHeader.length > 0) {
      const smpTable = todaySmpHeader.closest("table");

      smpTable.find("tbody tr").each((i, row) => {
        const cells = $(row).find("th, td");
        const key = $(cells[0]).text().trim();
        const value = $(cells[1]).text().trim().replace(",", "");
        const key2 = $(cells[2]).text().trim();
        const value2 = $(cells[3]).text().trim().replace(",", "");

        const parseValue = (val: string) => {
          const num = parseFloat(val);
          return isNaN(num) ? val : num;
        };

        if (key === "거래일") {
          todaySmpData["거래일"] = value;
        } else if (key === "거래량") {
          todaySmpData["거래량"] = parseValue(value);
        } else if (key === "평균가") {
          todaySmpData["평균가"] = parseValue(value);
        } else if (key === "최고가") {
          todaySmpData["최고가"] = parseValue(value);
        } else if (key === "최소가") {
          todaySmpData["최소가"] = parseValue(value);
        } else if (key === "종가") {
          todaySmpData["종가"] = parseValue(value);
        }

        // 두 번째 항목도 처리
        if (key2 === "거래일") {
          todaySmpData["거래일"] = value2;
        } else if (key2 === "거래량") {
          todaySmpData["거래량"] = parseValue(value2);
        } else if (key2 === "평균가") {
          todaySmpData["평균가"] = parseValue(value2);
        } else if (key2 === "최고가") {
          todaySmpData["최고가"] = parseValue(value2);
        } else if (key2 === "최소가") {
          todaySmpData["최소가"] = parseValue(value2);
        } else if (key2 === "종가") {
          todaySmpData["종가"] = parseValue(value2);
        }
      });
    }

    // 5. "오늘의 REC" 데이터 추출
    const todayRecData: { [key: string]: string | number } = {};
    const todayRecHeader = $("caption").filter((i, el) =>
      $(el).text().includes("오늘의 REC"),
    );

    if (todayRecHeader.length > 0) {
      const recTable = todayRecHeader.closest("table");

      recTable.find("tbody tr").each((i, row) => {
        const cells = $(row).find("th, td");
        const key = $(cells[0]).text().trim();
        const value = $(cells[1]).text().trim().replace(",", "");
        const key2 = $(cells[2]).text().trim();
        const value2 = $(cells[3]).text().trim().replace(",", "");

        const parseValue = (val: string) => {
          const num = parseFloat(val);
          return isNaN(num) ? val : num;
        };

        // 두 번째 데이터 처리
        if (key === "거래일") {
          todayRecData["거래일"] = value;
        } else if (key === "거래량") {
          todayRecData["거래량"] = parseValue(value);
        } else if (key === "평균가") {
          todayRecData["평균가"] = parseValue(value);
        } else if (key === "최고가") {
          todayRecData["최고가"] = parseValue(value);
        } else if (key === "최저가") {
          todayRecData["최저가"] = parseValue(value);
        } else if (key === "종가") {
          todayRecData["종가"] = parseValue(value);
        }

        // 두 번째 항목도 처리
        if (key2 === "거래일") {
          todayRecData["거래일"] = value2;
        } else if (key2 === "거래량") {
          todayRecData["거래량"] = parseValue(value2);
        } else if (key2 === "평균가") {
          todayRecData["평균가"] = parseValue(value2);
        } else if (key2 === "최고가") {
          todayRecData["최고가"] = parseValue(value2);
        } else if (key2 === "최저가") {
          todayRecData["최저가"] = parseValue(value2);
        } else if (key2 === "종가") {
          todayRecData["종가"] = parseValue(value2);
        }
      });
    }

    // 6. 데이터 반환
    return NextResponse.json({ todaySmpData, todayRecData });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to find data", error: errorMessage },
      { status: 500 },
    );
  }
}
