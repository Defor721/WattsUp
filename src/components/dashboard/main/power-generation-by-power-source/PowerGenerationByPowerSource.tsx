"use client";

import React, { useEffect, useState } from "react";

import { getTodayDate, getYesterdayDate } from "@/utils";
import Loading from "@/app/loading";
import { formatNumberWithoutDecimal } from "@/hooks/useNumberFormatter";

import Container from "../Container";
import LineChart from "./LineChart";
import PieChart from "./PieChart";

// const SERVICE_KEY = process.env.NEXT_PUBLIC_DATA_PORTAL_SERVICE_KEY;
const SERVICE_KEY =
  "clU8FdFV5AjUB0cF0LYErXsHT8KUPSq78yitDKHIZ8R4q6lb%2FL%2BUQVNzOKztZgJWNweqAWOVMSPWFAvOozgMgQ%3D%3D";

const COLORS: Record<string, string> = {
  수력: "#1F77B4",
  유류: "#FF7F0E",
  유연탄: "#2CA02C",
  원자력: "#D62728",
  가스: "#9467BD",
  국내탄: "#8C564B",
  신재생: "#E377C2",
  태양광: "#17BECF",
};

interface HourlyData {
  hour: string;
  수력: number;
  유류: number;
  유연탄: number;
  원자력: number;
  가스: number;
  국내탄: number;
  신재생: number;
  태양광: number;
}

function PowerGenerationByPowerSource() {
  const [chartData, setChartData] = useState<HourlyData[]>([]);
  const [totalData, setTotalData] = useState<{ name: string; value: number }[]>(
    [],
  );

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

        const todayItemsLength = todayItems.length;
        const yesterdayItemsLength = 287 - todayItemsLength;
        const formatYesterdayItems =
          yesterdayItems.slice(-yesterdayItemsLength);

        const processHourlyData = (items: any[]) => {
          const hourlyData: HourlyData[] = [];

          items.forEach((item: any) => {
            // 시간 추출 (HH:00 형식으로 변환)
            const itemDate = new Date(
              `${item.baseDatetime.slice(0, 4)}-${item.baseDatetime.slice(
                4,
                6,
              )}-${item.baseDatetime.slice(6, 8)}T${item.baseDatetime.slice(
                8,
                10,
              )}:${item.baseDatetime.slice(10, 12)}:00`,
            );
            const hour = `${itemDate.getHours()}:00`;

            // 해당 시간 데이터 찾기
            const existingHourData = hourlyData.find(
              (data) => data.hour === hour,
            );

            if (existingHourData) {
              // 동일 시간 데이터가 있다면 합산
              existingHourData.수력 += item.fuelPwr1 || 0;
              existingHourData.유류 += item.fuelPwr2 || 0;
              existingHourData.유연탄 += item.fuelPwr3 || 0;
              existingHourData.원자력 += item.fuelPwr4 || 0;
              existingHourData.가스 += item.fuelPwr6 || 0;
              existingHourData.국내탄 += item.fuelPwr7 || 0;
              existingHourData.신재생 += item.fuelPwr8 || 0;
              existingHourData.태양광 += item.fuelPwr9 || 0;
            } else {
              // 새로운 시간 데이터 추가
              hourlyData.push({
                hour,
                수력: item.fuelPwr1 || 0,
                유류: item.fuelPwr2 || 0,
                유연탄: item.fuelPwr3 || 0,
                원자력: item.fuelPwr4 || 0,
                가스: item.fuelPwr6 || 0,
                국내탄: item.fuelPwr7 || 0,
                신재생: item.fuelPwr8 || 0,
                태양광: item.fuelPwr9 || 0,
              });
            }
          });

          return hourlyData;
        };

        const hourlyYesterday = processHourlyData(formatYesterdayItems);
        const hourlyToday = processHourlyData(todayItems);

        const combinedData = [...hourlyYesterday, ...hourlyToday];

        const pieData = Object.entries(
          combinedData.reduce(
            (acc, curr) => {
              acc["수력"] += curr.수력 || 0;
              acc["유류"] += curr.유류 || 0;
              acc["유연탄"] += curr.유연탄 || 0;
              acc["원자력"] += curr.원자력 || 0;
              acc["가스"] += curr.가스 || 0;
              acc["국내탄"] += curr.국내탄 || 0;
              acc["신재생"] += curr.신재생 || 0;
              acc["태양광"] += curr.태양광 || 0;
              return acc;
            },
            {
              수력: 0,
              유류: 0,
              유연탄: 0,
              원자력: 0,
              가스: 0,
              국내탄: 0,
              신재생: 0,
              태양광: 0,
            },
          ),
        ).map(([name, value]) => ({ name, value }));

        const filteredData = combinedData.map((data) => ({
          ...data,
          수력: data.수력 > 0 ? data.수력 : 0,
          유류: data.유류 > 0 ? data.유류 : 0,
          유연탄: data.유연탄 > 0 ? data.유연탄 : 0,
          원자력: data.원자력 > 0 ? data.원자력 : 0,
          가스: data.가스 > 0 ? data.가스 : 0,
          국내탄: data.국내탄 > 0 ? data.국내탄 : 0,
          신재생: data.신재생 > 0 ? data.신재생 : 0,
          태양광: data.태양광 > 0 ? data.태양광 : 0,
        }));

        setChartData(filteredData);
        setTotalData(pieData);
      } catch (error) {
        console.error("fetchData error: ", error);
      }
    };

    fetchData();
  }, []);

  if (!chartData || chartData.length === 0) return <Loading />;

  return (
    <Container>
      {/* 라인 그래프 */}
      <h2 className="mb-4 mt-8 text-center text-lg font-semibold">
        발전원별 시간당 발전량
      </h2>
      <LineChart chartData={chartData} colors={COLORS} />

      {/* 파이 그래프 */}
      <h2 className="mb-4 mt-8 text-center text-lg font-semibold">
        발전원별 누적 비율
      </h2>
      <div className="flex items-center justify-center gap-5">
        <div className="w-[450px]">
          <PieChart totalData={totalData} colors={COLORS} />
        </div>
        {/* 파이 그래프 리스트 */}
        <div className="flex flex-col gap-2">
          {totalData
            .sort((a, b) => b.value - a.value)
            .map((item, index) => (
              <div
                key={item.name}
                className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-200"
              >
                <div
                  className="h-4 w-4 rounded-full"
                  style={{ backgroundColor: COLORS[item.name] }}
                ></div>
                <span>
                  {item.name}: {formatNumberWithoutDecimal(item.value)} MWh
                </span>
              </div>
            ))}
        </div>
      </div>
    </Container>
  );
}

export default PowerGenerationByPowerSource;
