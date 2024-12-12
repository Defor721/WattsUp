import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

// 지점번호 매핑
const locations: Record<string, number> = {
  충청북도: 131,
  충청남도: 129,
  전라북도: 146,
  전라남도: 156,
  인천시: 112,
  울산시: 152,
  세종시: 133, // 대전 지점번호와 동일
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

// 열 이름을 한국 설명 이름으로 지정
const columnsKorean = [
  "관측일(KST)",
  "국내 지점번호",
  "일 평균 풍속 (m/s)",
  "일 풍정 (m)",
  "최대풍향",
  "최대풍속 (m/s)",
  "최대풍속 시각 (시분)",
  "최대순간풍향",
  "최대순간풍속 (m/s)",
  "최대순간풍속 시각 (시분)",
  "일 평균기온 (C)",
  "최고기온 (C)",
  "최고기온 시각 (시분)",
  "최저기온 (C)",
  "최저기온 시각 (시분)",
  "일 평균 이슬점온도 (C)",
  "일 평균 지면온도 (C)",
  "일 최저 초상온도 (C)",
  "일 평균 상대습도 (%)",
  "최저습도 (%)",
  "최저습도 시각 (시분)",
  "일 평균 수증기압 (hPa)",
  "소형 증발량 (mm)",
  "대형 증발량 (mm)",
  "안개계속시간 (hr)",
  "일 평균 현지기압 (hPa)",
  "일 평균 해면기압 (hPa)",
  "최고 해면기압 (hPa)",
  "최고 해면기압 시각 (시분)",
  "최저 해면기압 (hPa)",
  "최저 해면기압 시각 (시분)",
  "일 평균 전운량 (1/10)",
  "일조합 (hr)",
  "가조시간 (hr)",
  "캄벨 일조 (hr)",
  "일사합 (MJ/m2)",
  "최대 1시간일사 (MJ/m2)",
  "최대 1시간일사 시각 (시분)",
  "일 강수량 (mm)",
  "9-9 강수량 (mm)",
  "강수계속시간 (hr)",
  "1시간 최다강수량 (mm)",
  "1시간 최다강수량 시각 (시분)",
  "10분간 최다강수량 (mm)",
  "10분간 최다강수량 시각 (시분)",
  "최대 강우강도 (mm/h)",
  "최대 강우강도 시각 (시분)",
  "최심 신적설 (cm)",
  "최심 신적설 시각 (시분)",
  "최심 적설 (cm)",
  "최심 적설 시각 (시분)",
  "0.5m 지중온도 (C)",
  "1.0m 지중온도 (C)",
  "1.5m 지중온도 (C)",
  "3.0m 지중온도 (C)",
  "5.0m 지중온도 (C)",
];

// 제거할 열 목록
const columnsToRemove = [
  "일 풍정 (m)",
  "최대풍향",
  "최대풍속 시각 (시분)",
  "최대순간풍향",
  "최대순간풍속 (m/s)",
  "최대순간풍속 시각 (시분)",
  "최고기온 (C)",
  "최고기온 시각 (시분)",
  "최저기온 (C)",
  "최저기온 시각 (시분)",
  "일 평균 이슬점온도 (C)",
  "일 최저 초상온도 (C)",
  "일 평균 상대습도 (%)",
  "최저습도 (%)",
  "최저습도 시각 (시분)",
  "소형 증발량 (mm)",
  "대형 증발량 (mm)",
  "안개계속시간 (hr)",
  "일 평균 해면기압 (hPa)",
  "최고 해면기압 (hPa)",
  "최고 해면기압 시각 (시분)",
  "최저 해면기압 (hPa)",
  "최저 해면기압 시각 (시분)",
  "일 평균 전운량 (1/10)",
  "가조시간 (hr)",
  "캄벨 일조 (hr)",
  "최대 1시간일사 (MJ/m2)",
  "최대 1시간일사 시각 (시분)",
  "9-9 강수량 (mm)",
  "강수계속시간 (hr)",
  "1시간 최다강수량 (mm)",
  "1시간 최다강수량 시각 (시분)",
  "10분간 최다강수량 (mm)",
  "10분간 최다강수량 시각 (시분)",
  "최대 강우강도 (mm/h)",
  "최대 강우강도 시각 (시분)",
  "최심 신적설 (cm)",
  "최심 신적설 시각 (시분)",
  "최심 적설 (cm)",
  "최심 적설 시각 (시분)",
  "0.5m 지중온도 (C)",
  "1.0m 지중온도 (C)",
  "1.5m 지중온도 (C)",
  "3.0m 지중온도 (C)",
  "5.0m 지중온도 (C)",
];

// 기상청 API 요청 함수
async function fetchWeatherData(date: string, stn: number) {
  const url = "https://apihub.kma.go.kr/api/typ01/url/kma_sfcdd.php";
  const params = {
    tm: date,
    stn: stn.toString(),
    disp: "0",
    help: "0",
    authKey: process.env.KMA_API_KEY, // API 인증키
  };

  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error(`API 요청 실패 (${stn}):`, error);
    return null;
  }
}

// Next.js API Route
export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const results: Record<string, any>[] = [];

  for (const [stationName, stationId] of Object.entries(locations)) {
    const responseData = await fetchWeatherData(currentDate, stationId);
    if (responseData) {
      const csvRows = responseData
        .split("\n")
        .filter((row: string) => row.trim() && !row.startsWith("#"));
      const parsedData = csvRows.map((row: string) => row.split(/\s+/)); // 공백 기준으로 데이터 분리

      // 열 이름 설정 및 제거할 열 처리
      const filteredData = parsedData.map((row: any[]) => {
        const dataObj = Object.fromEntries(
          columnsKorean.map((col, idx) => [col, row[idx]]),
        );
        columnsToRemove.forEach((col) => delete dataObj[col]); // 제거할 열 삭제
        return dataObj;
      });

      results.push({ stationName, data: filteredData });
    }
  }

  res.status(200).json({ date: currentDate, results });
}
