import puppeteer from "puppeteer";
import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

// 데이터 타입 정의
interface TableData {
  [key: string]: string | number;
}

interface KPXData {
  todaySmpData: TableData;
  todayRecData: TableData;
}

// Puppeteer를 사용한 데이터 추출 함수
async function fetchDataFromKPX(): Promise<KPXData> {
  const browser = await puppeteer.launch({ headless: true }); // headless: true는 브라우저 UI를 숨깁니다.
  const page = await browser.newPage();

  try {
    // KPX 웹페이지로 이동
    await page.goto("https://www.kpx.or.kr/main/#section-2nd", {
      waitUntil: "domcontentloaded", // DOMContentLoaded 이벤트 이후에 실행
    });

    // 페이지 HTML 가져오기
    const html = await page.content();

    // Cheerio로 HTML 파싱
    const $ = cheerio.load(html);

    // 데이터 추출 함수
    const extractTableData = (captionText: string): TableData => {
      const extractedData: TableData = {};
      const tableHeader = $("caption").filter((i, el) =>
        $(el).text().includes(captionText),
      );

      if (tableHeader.length > 0) {
        const table = tableHeader.closest("table");

        table.find("tbody tr").each((i, row) => {
          const cells = $(row).find("th, td");

          const parseValue = (val: string): string | number => {
            const num = parseFloat(val.replace(",", ""));
            return isNaN(num) ? val : num;
          };

          const key1 = $(cells[0]).text().trim();
          const value1 = $(cells[1]).text().trim();
          if (key1) extractedData[key1] = parseValue(value1);

          const key2 = $(cells[2]).text().trim();
          const value2 = $(cells[3]).text().trim();
          if (key2) extractedData[key2] = parseValue(value2);
        });
      }

      return extractedData;
    };

    // "오늘의 SMP" 및 "오늘의 REC" 데이터 추출
    const todaySmpData = extractTableData("오늘의 SMP");
    const todayRecData = extractTableData("오늘의 REC");

    return { todaySmpData, todayRecData };
  } catch (error) {
    console.error(
      "Error during Puppeteer execution:",
      error instanceof Error ? error.message : error,
    );
    throw error;
  } finally {
    // 브라우저 종료
    await browser.close();
  }
}

// Next.js API 핸들러
export async function GET(): Promise<NextResponse> {
  try {
    // Puppeteer로 데이터 가져오기
    const data = await fetchDataFromKPX();

    // 결과 반환
    return NextResponse.json(data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to fetch data", error: errorMessage },
      { status: 500 },
    );
  }
}
