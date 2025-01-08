import { EventEmitter } from "events";

import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

// 리스너 제한 증가
EventEmitter.defaultMaxListeners = 30;

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: "https://www.kpx.or.kr",
});

export async function GET() {
  try {
    // 1. URL 요청 및 HTML 데이터 가져오기
    const { data } = await axiosInstance.get("/main/#section-2nd");

    // 2. HTML 파싱
    const $ = cheerio.load(data);

    // 3. "오늘의 SMP" 데이터 추출
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

        // 첫 번째 데이터 처리
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

        // 두 번째 데이터 처리
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

    // 4. "오늘의 REC" 데이터 추출
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

        // 첫 번째 데이터 처리
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

        // 두 번째 데이터 처리
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

    // 5. 결과 반환
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
