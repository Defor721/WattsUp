"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import Title from "@/components/ui/Title";
import { getTodayDate, getYesterdayDate } from "@/utils";

const SERVICE_KEY =
  "%2BogvV5gd7KZTwvXoJFZGnE4LWsrQmvXg6Ju%2B8BiqclEVzgKXi%2F93FUT7thwIoibDGUiHRjOwIDhayhAK4unN2Q%3D%3D";

const COLORS = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#FFC300",
  "#DAF7A6",
  "#900C3F",
  "#581845",
  "#C70039",
  "#7FFF00",
];

interface HourlyData {
  hour: string;
  수력: number;
  유류: number;
  유연탄: number;
  원자력: number;
  양수: number;
  가스: number;
  국내탄: number;
  신재생: number;
  태양광: number;
}

interface TotalData {
  수력: number;
  유류: number;
  유연탄: number;
  원자력: number;
  양수: number;
  가스: number;
  국내탄: number;
  신재생: number;
  태양광: number;
}

function Page() {
  const [timeData, setTimeData] = useState<HourlyData[]>([]);
  const [totalData, setTotalData] = useState<TotalData>({
    수력: 0,
    유류: 0,
    유연탄: 0,
    원자력: 0,
    양수: 0,
    가스: 0,
    국내탄: 0,
    신재생: 0,
    태양광: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const TODAY = getTodayDate();
        const YESTERDAY = getYesterdayDate();

        const yesterdayResponse = await fetch(
          `https://apis.data.go.kr/B552115/PwrAmountByGen/getPwrAmountByGen?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=288&dataType=json&baseDate=${YESTERDAY}`,
        );

        const todayResponse = await fetch(
          `https://apis.data.go.kr/B552115/PwrAmountByGen/getPwrAmountByGen?serviceKey=${SERVICE_KEY}&pageNo=1&numOfRows=288&dataType=json&baseDate=${TODAY}`,
        );

        if (!yesterdayResponse.ok || !todayResponse.ok) {
          throw new Error(`HTTP error! status: ${todayResponse.status}`);
        }

        const yesterdayData = await yesterdayResponse.json();
        const todayData = await todayResponse.json();

        const yesterdayItems = yesterdayData.response.body.items.item;
        const todayItems = todayData.response.body.items.item;

        const todayCount = todayItems.length;
        const relevantYesterdayData = yesterdayItems.slice(-288 + todayCount);

        const combinedData = [...relevantYesterdayData, ...todayItems];
        combinedData.sort((a: any, b: any) =>
          a.baseDatetime.localeCompare(b.baseDatetime),
        );

        // 1시간 단위 데이터 가공
        const hourlyData: HourlyData[] = [];
        combinedData.forEach((item: any) => {
          const hour = item.baseDatetime.slice(8, 10); // 시간 추출
          const existingHourData = hourlyData.find(
            (data) => data.hour === hour,
          );

          if (existingHourData) {
            // 시간대 데이터 누적
            Object.keys(existingHourData).forEach((key) => {
              if (key !== "hour") {
                existingHourData[key as keyof HourlyData] += item[key] || 0;
              }
            });
          } else {
            // 새로운 시간대 추가
            hourlyData.push({
              hour,
              수력: item.fuelPwr1 || 0,
              유류: item.fuelPwr2 || 0,
              유연탄: item.fuelPwr3 || 0,
              원자력: item.fuelPwr4 || 0,
              양수: item.fuelPwr5 || 0,
              가스: item.fuelPwr6 || 0,
              국내탄: item.fuelPwr7 || 0,
              신재생: item.fuelPwr8 || 0,
              태양광: item.fuelPwr9 || 0,
            });
          }
        });

        const totalData = hourlyData.reduce<TotalData>(
          (acc, curr) => {
            Object.keys(curr).forEach((key) => {
              if (key !== "hour") {
                acc[key as keyof TotalData] += curr[key as keyof HourlyData];
              }
            });
            return acc;
          },
          {
            수력: 0,
            유류: 0,
            유연탄: 0,
            원자력: 0,
            양수: 0,
            가스: 0,
            국내탄: 0,
            신재생: 0,
            태양광: 0,
          },
        );

        setTimeData(hourlyData);
        setTotalData(totalData);
      } catch (error) {
        console.log("fetchData error: ", error);
      }
    };

    fetchData();
  }, []);

  const totalPieData = Object.entries(totalData).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="dark:bg-[#050a18] md:w-full">
      <Title title={"대시보드"} />

      {/* 발전원별 시간당 발전량 */}
      <h2 className="mb-4 mt-8 text-center text-lg font-semibold">
        발전원별 시간당 발전량
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={timeData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          {Object.keys(totalData).map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={COLORS[index]}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>

      {/* 발전원별 누적 발전량 */}
      <h2 className="mb-4 mt-8 text-center text-lg font-semibold">
        발전원별 누적 발전량
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={totalPieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label
          >
            {totalPieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Legend />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Page;
