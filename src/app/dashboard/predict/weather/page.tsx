"use client";
import React, { useEffect, useState } from "react";

const LOCATIONS = [
  { name: "강원도", latitude: 37.8228, longitude: 128.1555 },
  { name: "경기도", latitude: 37.4138, longitude: 127.5183 },
  { name: "경상남도", latitude: 35.2374, longitude: 128.6922 },
  { name: "경상북도", latitude: 36.2486, longitude: 128.6647 },
  { name: "광주시", latitude: 35.1595, longitude: 126.8526 },
  { name: "대구시", latitude: 35.8714, longitude: 128.6014 },
  { name: "대전시", latitude: 36.3504, longitude: 127.3845 },
  { name: "부산시", latitude: 35.1796, longitude: 129.0756 },
  { name: "서울시", latitude: 37.5665, longitude: 126.978 },
  { name: "세종시", latitude: 36.4875, longitude: 127.2817 },
  { name: "울산시", latitude: 35.5384, longitude: 129.3114 },
  { name: "인천시", latitude: 37.4563, longitude: 126.7052 },
  { name: "전라남도", latitude: 34.8679, longitude: 126.991 },
  { name: "전라북도", latitude: 35.7175, longitude: 127.153 },
  { name: "충청남도", latitude: 36.5184, longitude: 126.8 },
  { name: "충청북도", latitude: 36.6357, longitude: 127.4917 },
];

const API_KEY = "79eb1cc0bb4be154c5d7cba7344315bc"; // OpenWeather API 키를 입력하세요.

function Page() {
  const [dataset, setDataset] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllData() {
      try {
        const requests = LOCATIONS.map((location) => {
          const URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&appid=${API_KEY}&units=metric`;

          return fetch(URL)
            .then((res) => {
              if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
              }
              return res.json();
            })
            .then((data) => ({
              location: location.name,
              data: data.list,
            }));
        });

        const results = await Promise.all(requests);
        console.log("results: ", results);

        const formattedDataset = results.flatMap(({ location, data }) => {
          return data.map((entry) => {
            const temp = entry.main.temp; // 현재 기온
            const humidity = entry.main.humidity; // 상대습도 (%)
            const windSpeed = entry.wind.speed; // 풍속 (m/s)
            const rainfall = entry.rain?.["3h"] || 0; // 강수량 (mm, 없으면 0)

            // 수증기압 계산
            const vaporPressure = calculateVaporPressure(humidity, temp);

            return {
              location,
              date: entry.dt_txt.split(" ")[0],
              windSpeed,
              temperature: temp,
              vaporPressure,
              precipitation: rainfall,
            };
          });
        });

        setDataset(formattedDataset);
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllData();
  }, []);

  function calculateVaporPressure(humidity, temperature) {
    // 포화 수증기압 계산 (hPa)
    const saturatedVaporPressure =
      6.11 * Math.exp((17.27 * temperature) / (temperature + 237.3));
    // 수증기압 계산 (hPa)
    return (humidity * saturatedVaporPressure) / 100;
  }

  if (loading) return <div>로딩 중...</div>;
  if (dataset.length === 0) return <div>데이터가 없습니다.</div>;

  return (
    <div>
      <h1>OpenWeather Weather Data for Model Training</h1>
      <table>
        <thead>
          <tr>
            <th>지역</th>
            <th>날짜</th>
            <th>평균 풍속 (m/s)</th>
            <th>평균 기온 (°C)</th>
            <th>수증기압 (hPa)</th>
            <th>강수량 (mm/3h)</th>
          </tr>
        </thead>
        <tbody>
          {dataset.map((entry, index) => (
            <tr key={index}>
              <td>{entry.location}시</td>
              <td>{entry.date}</td>
              <td>{entry.windSpeed.toFixed(2)}</td>
              <td>{entry.temperature.toFixed(2)}</td>
              <td>{entry.vaporPressure.toFixed(2)}</td>
              <td>{entry.precipitation.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Page;
