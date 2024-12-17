import { NextResponse } from "next/server";
import axios from "axios";

import { getLast7Days } from "@/utils/getLast7Days";

const locations: Record<string, number> = {
  충청북도: 131,
  충청남도: 129,
  전라북도: 146,
  전라남도: 156,
  인천시: 112,
  울산시: 152,
  세종시: 133,
  서울시: 108,
  부산시: 159,
  대전시: 133,
  대구시: 143,
  광주시: 156,
  경상북도: 136,
  경상남도: 155,
  경기도: 119,
  강원도: 105,
  제주도: 184,
};

const fetchWeatherData = async (date: string, stn: number) => {
  const url = "https://apihub.kma.go.kr/api/typ01/url/kma_sfcdd.php";
  const params = {
    tm: date,
    stn: stn.toString(),
    disp: "0",
    help: "0",
    authKey: process.env.KMA_API_KEY,
  };

  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error(`API 요청 실패 (${stn} - ${date}):`, error);
    return null;
  }
};

const processWeatherData = (responseData: string) => {
  const csvRows = responseData
    .split("\n")
    .filter((row) => row.trim() && !row.startsWith("#"));

  return csvRows.map((row) => {
    const parsedRow = row.split(/\s+/);
    // 필요한 9개 컬럼만 추출
    const filteredData = {
      "일 평균 풍속 (m/s)": parsedRow[2],
      "최대풍속 (m/s)": parsedRow[3],
      "일 평균기온 (C)": parsedRow[4],
      "일 평균 지면온도 (C)": parsedRow[5],
      "일 평균 수증기압 (hPa)": parsedRow[6],
      "일 평균 현지기압 (hPa)": parsedRow[7],
      "일조합 (hr)": parsedRow[8],
      "일사합 (MJ/m2)": parsedRow[9],
      "일 강수량 (mm)": parsedRow[10],
    };
    return filteredData;
  });
};

export async function GET() {
  const last7Days = getLast7Days();

  // 모든 요청을 병렬 처리
  const promises = Object.entries(locations).flatMap(
    ([stationName, stationId]) =>
      last7Days.map(async (date) => {
        const responseData = await fetchWeatherData(date, stationId);
        if (responseData) {
          const processedData = processWeatherData(responseData);
          return { stationName, date, data: processedData };
        }
        return null; // 요청 실패 시 null 반환
      }),
  );

  // 모든 요청 완료 후 결과 필터링 및 타입 단언 추가
  const results = (await Promise.all(promises)).filter(Boolean) as {
    stationName: string;
    date: string;
    data: any[];
  }[];

  // stationName으로 그룹화하고 각 그룹 내에서 date 기준 정렬
  const groupedResults = results.reduce<Record<string, any[]>>(
    (acc, result) => {
      const { stationName, date, data } = result;
      if (!acc[stationName]) {
        acc[stationName] = [];
      }
      acc[stationName].push({ date, data });
      return acc;
    },
    {},
  );
  const sortGroupedResultsByRegion = (
    groupedResults: Record<string, any[]>,
  ) => {
    // 객체의 키(지역 이름)를 정렬
    const sortedKeys = Object.keys(groupedResults).sort((a, b) =>
      a.localeCompare(b),
    );

    // 정렬된 키를 기반으로 새로운 객체 생성
    const sortedGroupedResults: Record<string, any[]> = {};
    sortedKeys.forEach((key) => {
      sortedGroupedResults[key] = groupedResults[key];
    });

    return sortedGroupedResults;
  };

  // 기존 groupedResults를 정렬된 객체로 변환
  const sortedGroupedResults = sortGroupedResultsByRegion(groupedResults);
  // console.log("sortedGroupedResults: ", sortedGroupedResults);

  // 그룹 내 date 정렬
  for (const stationName in sortedGroupedResults) {
    sortedGroupedResults[stationName].sort((a, b) =>
      a.date.localeCompare(b.date),
    );
  }

  return NextResponse.json({ results: sortedGroupedResults });
}
