import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  const API_KEY = process.env.OPEN_WEATHER_API_KEY; // 실제 API 키로 교체하세요
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");
  if (!lat || !lon) {
    return NextResponse.json(
      { error: "Latitude and longitude are required" },
      { status: 400 },
    );
  }
  try {
    // OpenWeatherMap API 호출
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    const response = await axios.get(url);

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error fetching weather data:", error);

    // 에러 응답
    return NextResponse.json(
      { error: "Failed to fetch weather data", details: error.message },
      { status: 500 },
    );
  }
}
