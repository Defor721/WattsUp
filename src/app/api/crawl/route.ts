import { EventEmitter } from "events";

import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

import clientPromise from "@/lib/mongodb"; // MongoDB 클라이언트 경로를 설정

// 리스너 제한 증가
EventEmitter.defaultMaxListeners = 30;

// axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: "https://www.kpx.or.kr",
});

export async function GET() {
  const client = await clientPromise;
  const db = client.db("wattsup");
  const collection = db.collection("scrap");

  try {
    const today = new Date().toISOString().split("T")[0];

    const existingData = await collection.findOne({ date: today });

    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1))
      .toISOString()
      .split("T")[0];
    const yesterdayData = await collection.findOne({ date: yesterday });

    if (existingData) {
      const smpIncrease =
        ((existingData?.todaySmpData["평균가"] -
          yesterdayData?.todaySmpData["평균가"]) /
          yesterdayData?.todaySmpData["평균가"]) *
        100;
      const recIncrease =
        ((existingData?.todayRecData["평균가"] -
          yesterdayData?.todayRecData["평균가"]) /
          yesterdayData?.todayRecData["평균가"]) *
        100;

      return NextResponse.json({
        todaySmpData: existingData.todaySmpData,
        todayRecData: existingData.todayRecData,
        smpIncrease,
        recIncrease,
      });
    }

    // 3. URL 요청 및 HTML 데이터 가져오기
    const { data } = await axiosInstance.get("/main/#section-2nd");

    // 4. HTML 파싱 및 데이터 추출
    const $ = cheerio.load(data);

    const parseTableData = (headerText: string) => {
      const tableData: { [key: string]: string | number } = {};
      const header = $("caption").filter((i, el) =>
        $(el).text().includes(headerText),
      );

      if (header.length > 0) {
        const table = header.closest("table");

        table.find("tbody tr").each((i, row) => {
          const cells = $(row).find("th, td");
          const parseValue = (val: string) => {
            // 날짜 형식은 숫자 변환하지 않음
            if (/\d{4}\.\d{2}\.\d{2}/.test(val)) {
              return val.trim(); // "2025.01.09" 그대로 반환
            }
            const num = parseFloat(val.replace(",", ""));
            return isNaN(num) ? val.trim() : num;
          };

          for (let j = 0; j < cells.length; j += 2) {
            const key = $(cells[j]).text().trim();
            const value = parseValue($(cells[j + 1]).text());
            if (key) tableData[key] = value;
          }
        });
      }

      return tableData;
    };

    // "오늘의 SMP" 데이터 추출
    const todaySmpData = parseTableData("오늘의 SMP");

    // "오늘의 REC" 데이터 추출
    const todayRecData = parseTableData("오늘의 REC");

    // 5. 크롤링 데이터 저장
    const newData = {
      date: today,
      todaySmpData,
      todayRecData,
    };

    await collection.insertOne(newData);

    // 6. 결과 반환
    return NextResponse.json({ todaySmpData, todayRecData });
  } catch (error: unknown) {
    console.error("크롤링 실패:", error);

    try {
      // 7. 무작위 데이터 반환
      const randomData = await collection
        .aggregate([{ $sample: { size: 1 } }]) // 무작위 1개 데이터 가져오기
        .toArray();

      if (randomData.length > 0) {
        return NextResponse.json({
          todaySmpData: randomData[0].todaySmpData,
          todayRecData: randomData[0].todayRecData,
        });
      } else {
        return NextResponse.json(
          { message: "No data available in the database." },
          { status: 500 },
        );
      }
    } catch (dbError) {
      console.error("DB에서 무작위 데이터 반환 실패:", dbError);
      return NextResponse.json(
        { message: "Failed to fetch random data from the database." },
        { status: 500 },
      );
    }
  }
}
