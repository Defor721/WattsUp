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
} from "recharts";

import Title from "@/components/ui/Title";
import { getTodayDate, getYesterdayDate } from "@/utils";

const SERVICE_KEY =
  "%2BogvV5gd7KZTwvXoJFZGnE4LWsrQmvXg6Ju%2B8BiqclEVzgKXi%2F93FUT7thwIoibDGUiHRjOwIDhayhAK4unN2Q%3D%3D";

const COLORS = {
  수력: "#FF5733",
  유류: "#33FF57",
  유연탄: "#3357FF",
  원자력: "#FFC300",
  양수: "#DAF7A6",
  가스: "#900C3F",
  국내탄: "#581845",
  신재생: "#C70039",
  태양광: "#7FFF00",
};

function Page() {
  const [timeData, setTimeData] = useState([]);

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

        const yesterdayItems = yesterdayData.response.body.items.item || [];
        const todayItems = todayData.response.body.items.item || [];

        const todayCount = todayItems.length;
        const relevantYesterdayData = yesterdayItems.slice(-288 + todayCount);

        const combinedData = [...relevantYesterdayData, ...todayItems];

        combinedData.sort((a, b) => {
          const dateA = new Date(
            a.baseDatetime.slice(0, 4),
            a.baseDatetime.slice(4, 6) - 1,
            a.baseDatetime.slice(6, 8),
            a.baseDatetime.slice(8, 10),
            a.baseDatetime.slice(10, 12),
          );
          const dateB = new Date(
            b.baseDatetime.slice(0, 4),
            b.baseDatetime.slice(4, 6) - 1,
            b.baseDatetime.slice(6, 8),
            b.baseDatetime.slice(8, 10),
            b.baseDatetime.slice(10, 12),
          );
          return dateA - dateB;
        });

        const hourlyData = [];
        const temp = {};

        combinedData.forEach((item) => {
          const hour = parseInt(item.baseDatetime.slice(8, 10), 10);
          if (!temp[hour]) {
            temp[hour] = {
              hour: `${hour}:00`,
              수력: 0,
              유류: 0,
              유연탄: 0,
              원자력: 0,
              양수: 0,
              가스: 0,
              국내탄: 0,
              신재생: 0,
              태양광: 0,
            };
          }

          temp[hour].수력 += item.fuelPwr1 || 0;
          temp[hour].유류 += item.fuelPwr2 || 0;
          temp[hour].유연탄 += item.fuelPwr3 || 0;
          temp[hour].원자력 += item.fuelPwr4 || 0;
          temp[hour].양수 += item.fuelPwr5 || 0;
          temp[hour].가스 += item.fuelPwr6 || 0;
          temp[hour].국내탄 += item.fuelPwr7 || 0;
          temp[hour].신재생 += item.fuelPwr8 || 0;
          temp[hour].태양광 += item.fuelPwr9 || 0;
        });

        Object.values(temp)
          .sort((a, b) => parseInt(a.hour, 10) - parseInt(b.hour, 10))
          .forEach((value) => hourlyData.push(value));

        console.log("Hourly Data:", hourlyData);

        setTimeData(hourlyData);
      } catch (error) {
        console.log("fetchData error: ", error);
      }
    };

    fetchData();
  }, []);

  const chartKeys = [
    "수력",
    "유류",
    "유연탄",
    "원자력",
    "양수",
    "가스",
    "국내탄",
    "신재생",
    "태양광",
  ];

  return (
    <div className="dark:bg-[#050a18] md:w-full">
      <Title title={"대시보드"} />

      {/* 발전원별 개별 차트 */}
      {chartKeys.map((key) => (
        <div key={key} className="mb-8">
          <h2 className="mb-4 text-center text-lg font-semibold">{key}</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={timeData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey={key}
                stroke={COLORS[key]}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </div>
  );
}

export default Page;
