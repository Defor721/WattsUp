import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

// 데이터 파싱 결과 타입 정의
interface TableData {
  [key: string]: string | number;
}

export async function GET() {
  try {
    const url = "https://www.kpx.or.kr/main/#section-2nd";

    // HTML 가져오기
    const { data } = await axios.get(url);

    // HTML 파싱
    const $ = cheerio.load(data);

    // 데이터 파싱 공통 함수
    const parseTableData = (headerText: string): TableData => {
      const tableData: TableData = {};
      const header = $("caption").filter((i, el) =>
        $(el).text().includes(headerText),
      );

      if (header.length > 0) {
        const table = header.closest("table");

        table.find("tbody tr").each((i, row) => {
          const cells = $(row).find("th, td");

          // 첫 번째 셀 데이터 처리
          const key = $(cells[0]).text().trim();
          const value = $(cells[1]).text().trim().replace(",", "");

          // 두 번째 셀 데이터 처리 (있을 경우)
          const key2 = $(cells[2])?.text().trim() || "";
          const value2 = $(cells[3])?.text().trim().replace(",", "") || "";

          const parseValue = (val: string): string | number => {
            const num = parseFloat(val);
            return isNaN(num) ? val : num;
          };

          if (key) tableData[key] = parseValue(value);
          if (key2) tableData[key2] = parseValue(value2);
        });
      }

      return tableData;
    };

    // "오늘의 SMP" 데이터
    const todaySmpData = parseTableData("오늘의 SMP");

    // "오늘의 REC" 데이터
    const todayRecData = parseTableData("오늘의 REC");

    // JSON 응답 반환
    return NextResponse.json({ todaySmpData, todayRecData });
  } catch (error: any) {
    console.error("Error occurred:", error.message);
    return NextResponse.json(
      { error: "Failed to fetch data", details: error.message },
      { status: 500 },
    );
  }
}
