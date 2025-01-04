"use client";

import React, { useEffect, useMemo, useState } from "react";
import * as tf from "@tensorflow/tfjs";

import { regions } from "@/utils/regions";
import { get6Days } from "@/utils";
import apiClient from "@/lib/axios";
import { formatNumberWithDecimal } from "@/hooks/useNumberFormatter";
import Loading from "@/app/loading";
import KakaoMap from "@/components/introduce/KakaoMap";

import Container from "./Container";
import TodayValue from "./TodayValue";
import RegionButtons from "./RegionButtons";
import PredictChart from "./Chart";
import PredictTable from "./Table";

// OpenWeather API 설정
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

const INPUT_STATS = { min: -24.6, max: 33.3 };
const OUTPUT_STATS = { min: 1.574659, max: 5263.160841499999 };
const API_KEY = "79eb1cc0bb4be154c5d7cba7344315bc";

let modelInstance: tf.LayersModel | null = null;

async function loadModel() {
  if (!modelInstance) {
    try {
      console.time("Model Loading");
      modelInstance = await tf.loadLayersModel("/assets/models/model.json");
      console.log("Model loaded successfully!");
      console.timeEnd("Model Loading");
    } catch (error) {
      console.error("Error loading model:", error);
    }
  }
  return modelInstance;
}

const normalize = (data: number[], min: number, max: number) =>
  data.map((value) => (value - min) / (max - min));

const denormalize = (data: number[], min: number, max: number) =>
  data.map((value) => value * (max - min) + min);

function DashboardMain() {
  const [selectedRegion, setSelectedRegion] = useState("서울시"); // 선택된 지역 상태
  const [chartData, setChartData] = useState<Record<string, any[]>>({});
  const [weatherData, setWeatherData] = useState<Record<string, any[]>>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        const requests = LOCATIONS.map((location) => {
          const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${location.latitude}&lon=${location.longitude}&appid=${API_KEY}&units=metric`;

          return apiClient.get(url).then((response) => ({
            location: location.name,
            data: response.data.list,
          }));
        });

        const results = await Promise.all(requests);

        const processedWeatherData: Record<string, any[]> = {};

        results.forEach(({ location, data }) => {
          const groupedByDate = data.reduce((acc: any, entry: any) => {
            const date = entry.dt_txt.split(" ")[0];
            const windSpeed = entry.wind.speed || 0;
            const temperature = entry.main.temp || 0;
            const precipitation = entry.rain?.["3h"] || 0;

            if (!acc[date]) {
              acc[date] = {
                date,
                windSpeed: 0,
                temperature: 0,
                precipitation: 0,
                count: 0,
              };
            }

            acc[date].windSpeed += windSpeed;
            acc[date].temperature += temperature;
            acc[date].precipitation += precipitation;
            acc[date].count += 1;
            return acc;
          }, {});

          const processedData = Object.values(groupedByDate).map(
            (entry: any) => ({
              date: entry.date,
              windSpeed: parseFloat((entry.windSpeed / entry.count).toFixed(2)),
              temperature: parseFloat(
                (entry.temperature / entry.count).toFixed(2),
              ),
              precipitation: parseFloat(entry.precipitation.toFixed(2)),
            }),
          );

          processedWeatherData[location] = processedData;
        });

        setWeatherData(processedWeatherData);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  useEffect(() => {
    const predictRegionData = async () => {
      if (!weatherData) return;

      try {
        const model = await loadModel();

        const sampleInputs = regions.flatMap((region) =>
          weatherData[region]?.map((day) => [
            day.windSpeed,
            day.temperature,
            day.precipitation,
          ]),
        );

        const inputTensor = tf.tensor2d(
          sampleInputs.map((input) =>
            input.map(
              (value) =>
                normalize([value], INPUT_STATS.min, INPUT_STATS.max)[0],
            ),
          ),
        );
        if (!model) return;
        const predictionsTensor = model.predict(inputTensor) as tf.Tensor;
        const predictionsArray = predictionsTensor.arraySync() as number[][];

        const denormalizedPredictions = predictionsArray.map(
          (pred) =>
            denormalize([pred[0]], OUTPUT_STATS.min, OUTPUT_STATS.max)[0],
        );

        const dates = get6Days();
        const formattedChartData = regions.reduce(
          (acc, region, regionIndex) => {
            acc[region] = dates.map((date, dateIndex) => ({
              date,
              amgo:
                denormalizedPredictions[
                  dateIndex * regions.length + regionIndex
                ] || 0,
            }));
            return acc;
          },
          {} as Record<string, any[]>,
        );

        setChartData(formattedChartData);
      } catch (error) {
        console.error("Error during prediction:", error);
      }
    };

    predictRegionData();
  }, [weatherData]);

  const tableData = useMemo(() => {
    if (!weatherData || !selectedRegion) {
      return;
    }
    return weatherData[selectedRegion].map(
      (
        item: {
          date: string;
          windSpeed: string;
          temperature: string;
          precipitation: string;
        },
        index: number,
      ) => ({
        date: item.date,
        windSpeed: item.windSpeed,
        temperature: item.temperature,
        precipitation: item.precipitation,
        amgo: chartData[selectedRegion]?.[index]?.amgo
          ? formatNumberWithDecimal(chartData[selectedRegion][index].amgo)
          : "-",
      }),
    );
  }, [chartData, selectedRegion, weatherData]);

  if (loading) return <Loading />;

  return (
    <Container>
      <div className="mb-10 flex flex-col justify-between">
        <div>
          <h2 className="flex scroll-m-20 text-3xl font-semibold tracking-tight text-mainColor first:mt-0 dark:text-white">
            대시보드
          </h2>
          <div className="flex justify-end">
            <RegionButtons
              regions={regions}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
            />
          </div>
        </div>
      </div>
      <div className="mb-10 flex h-full w-full gap-6">
        <div
          id="map"
          style={{
            width: "35%",
            height: "300px",
          }}
        >
          <KakaoMap
            onRegionClick={(region) => setSelectedRegion(region)} // 클릭된 지역 설정
          />
        </div>

        <PredictChart
          data={chartData[selectedRegion]}
          region={selectedRegion}
          selectedRegion={selectedRegion}
        />
      </div>
      <PredictTable
        tableData={tableData || []}
        selectedRegion={selectedRegion}
      />
    </Container>
  );
}

export default DashboardMain;
