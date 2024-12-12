import { NextResponse } from "next/server";
import axios from "axios";

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

const columnsKorean = [
  "관측일(KST)",
  "국내 지점번호",
  "일 평균 풍속 (m/s)",
  "최대풍속 (m/s)",
  "일 평균기온 (C)",
  "일 평균 지면온도 (C)",
  "일 평균 수증기압 (hPa)",
  "일 평균 현지기압 (hPa)",
  "일조합 (hr)",
  "일사합 (MJ/m2)",
  "일 강수량 (mm)",
];

const getLast7Days = (): string[] => {
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().slice(0, 10).replace(/-/g, ""));
  }
  return dates;
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
    const dataObj = Object.fromEntries(
      columnsKorean.map((col, idx) => [col, parsedRow[idx]]),
    );
    return dataObj;
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

  // 그룹 내 date 정렬
  for (const stationName in groupedResults) {
    groupedResults[stationName].sort((a, b) => a.date.localeCompare(b.date));
  }

  return NextResponse.json({ results: groupedResults });
}
