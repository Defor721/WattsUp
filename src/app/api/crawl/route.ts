import { EventEmitter } from "events";

import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

EventEmitter.defaultMaxListeners = 30;

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: "https://www.kpx.or.kr",
  timeout: 10000, // 요청 타임아웃: 10초
});

// 캐싱 변수
let cachedData: { todaySmpData: any; todayRecData: any } | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 캐싱 시간: 5분

export async function GET() {
  try {
    // 캐싱된 데이터가 유효한 경우 반환
    if (
      cachedData &&
      cacheTimestamp &&
      Date.now() - cacheTimestamp < CACHE_DURATION
    ) {
      return NextResponse.json(cachedData);
    }

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
        const parseValue = (val: string) =>
          isNaN(Number(val)) ? val : Number(val);

        todaySmpData[key] = parseValue(value);
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
        const parseValue = (val: string) =>
          isNaN(Number(val)) ? val : Number(val);

        todayRecData[key] = parseValue(value);
      });
    }

    // 5. 데이터 캐싱
    cachedData = { todaySmpData, todayRecData };
    cacheTimestamp = Date.now();

    // 6. 결과 반환
    return NextResponse.json({ todaySmpData, todayRecData });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("API Crawling Error:", errorMessage);

    // 적절한 에러 메시지 반환
    return NextResponse.json(
      { message: "Failed to fetch data", error: errorMessage },
      { status: 500 },
    );
  }
}
