"use client";

import React, { useEffect, useState, useMemo } from "react";
import * as tf from "@tensorflow/tfjs";
import axios from "axios";

import PredictChart from "@/components/dashboard/predict/Chart";
import { Button } from "@/components/shadcn";
import PredictTable from "@/components/dashboard/predict/Table";
import { regions } from "@/utils/regions";

const inputStats = {
  min: tf.tensor([-99]),
  max: tf.tensor([1032]),
};

const outputStats = {
  min: tf.tensor([1.574658989906311]),
  max: tf.tensor([18407.54296875]),
};

const getLast7Days = (): string[] => {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().slice(0, 10);
  }).sort();
};

let modelInstance: tf.LayersModel | null = null;

async function loadModel() {
  if (!modelInstance) {
    console.time("Model Loading");

    // IndexedDB에서 모델 불러오기 시도
    try {
      modelInstance = await tf.loadLayersModel("indexeddb://my-model");
      console.log("Model loaded from IndexedDB");
    } catch (error) {
      console.warn("No model found in IndexedDB. Loading from file...");
      modelInstance = await tf.loadLayersModel("/assets/models/model-9.json");

      // 모델을 IndexedDB에 저장
      try {
        await modelInstance.save("indexeddb://my-model");
        console.log("Model saved to IndexedDB");
      } catch (saveError) {
        console.error("Failed to save model to IndexedDB", saveError);
      }
    }

    console.timeEnd("Model Loading");
  }
  return modelInstance;
}

function Page() {
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<Record<string, any[]>>();
  const [chartData, setChartData] = useState<Record<string, any[]>>({});
  const [selectedRegion, setSelectedRegion] = useState("서울시");

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        const weatherResponse = await axios.get("/api/weather");
        setWeatherData(weatherResponse.data.results);
      } catch (error) {
        console.error("Error fetching weather data: ", error);
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
          weatherData[region].map((day: any) => [
            parseFloat(day.data[0]["일 평균 풍속 (m/s)"] || 0),
            parseFloat(day.data[0]["최대풍속 (m/s)"] || 0),
            parseFloat(day.data[0]["일 평균기온 (C)"] || 0),
            parseFloat(day.data[0]["일 평균 지면온도 (C)"] || 0),
            parseFloat(day.data[0]["일 평균 수증기압 (hPa)"] || 0),
            parseFloat(day.data[0]["일 평균 현지기압 (hPa)"] || 0),
            parseFloat(day.data[0]["일조합 (hr)"] || 0),
            parseFloat(day.data[0]["일사합 (MJ/m2)"] || 0),
            parseFloat(day.data[0]["일 강수량 (mm)"] || 0),
          ]),
        );

        const inputTensor = tf.tensor2d(sampleInputs);
        const normalizedInputs = inputTensor
          .sub(inputStats.min)
          .div(inputStats.max.sub(inputStats.min));

        console.time("Prediction");
        const predictions = model.predict(normalizedInputs) as tf.Tensor;
        console.timeEnd("Prediction");

        const denormalizedPredictions = predictions
          .mul(outputStats.max.sub(outputStats.min))
          .add(outputStats.min);

        const predictionArray =
          denormalizedPredictions.arraySync() as number[][];

        const dates = getLast7Days();
        const formattedData: Record<string, any[]> = {};

        regions.forEach((region, regionIndex) => {
          formattedData[region] = dates.map((date, dateIndex) => {
            const predictionIndex = dateIndex * regions.length + regionIndex;
            return {
              date,
              amgo: parseFloat(
                (
                  Math.max(0, predictionArray[predictionIndex]?.[0] || 0) / 1000
                ).toFixed(2),
              ),
            };
          });
        });

        setChartData(formattedData);
      } catch (error) {
        console.error("Error predicting data: ", error);
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
          data: Array<Record<string, string>>;
        },
        index: number,
      ) => ({
        date: item.date,
        data: item.data || [],
        amgo: chartData[selectedRegion]?.[index]?.amgo || "-",
      }),
    );
  }, [chartData, selectedRegion, weatherData]);

  const regionButtons = useMemo(() => {
    return regions.map((region) => (
      <Button
        key={region}
        variant={"outline"}
        className={`${
          selectedRegion === region
            ? "bg-[rgb(7,15,38)] text-white"
            : "bg-gray-200"
        }`}
        onClick={() => setSelectedRegion(region)}
      >
        {region}
      </Button>
    ));
  }, [selectedRegion]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="flex-wrap justify-start gap-2 md:flex">
        {regionButtons}
      </div>
      <div className="mt-5">
        <h4 className="my-2 scroll-m-20 text-center text-xl font-semibold tracking-tight">
          {selectedRegion} 발전량 예측 그래프
        </h4>
        <PredictChart
          data={chartData[selectedRegion]}
          region={selectedRegion}
        />
      </div>
      <div className="mt-5">
        <h4 className="my-2 scroll-m-20 text-center text-xl font-semibold tracking-tight">
          {selectedRegion} 날씨 데이터
        </h4>
        <PredictTable tableData={tableData || []} />
      </div>
    </div>
  );
}

export default Page;
