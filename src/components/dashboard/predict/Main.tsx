"use client";

import React, { useEffect, useState, useMemo } from "react";
import * as tf from "@tensorflow/tfjs";
import axios from "axios";

import PredictChart from "@/components/dashboard/predict/Chart";
import { Button } from "@/components/shadcn";
import PredictTable from "@/components/dashboard/predict/Table";
import { regions } from "@/utils/regions";
import { getLast7Days } from "@/utils/getLast7Days";

const inputStats = {
  min: tf.tensor([-99]),
  max: tf.tensor([1032]),
};

const outputStats = {
  min: tf.tensor([1.574658989906311]),
  max: tf.tensor([18407.54296875]),
};

let modelInstance: tf.LayersModel | null = null;
let isInitialized = false;

async function loadModel() {
  if (!modelInstance) {
    modelInstance = await tf.loadLayersModel("/assets/models/model2.json");
  }
  return modelInstance;
}

async function initializeTensorFlow() {
  if (!isInitialized) {
    await tf.ready();
    const backend = tf.getBackend();
    if (backend !== "cpu") {
      await tf.setBackend("cpu");
    }
    isInitialized = true;
  }
}

function PredictMain() {
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<Record<string, any[]>>();
  const [chartData, setChartData] = useState<Record<string, any[]>>({});
  const [selectedRegion, setSelectedRegion] = useState("서울시");

  useEffect(() => {
    initializeTensorFlow();

    const suppressWarnings = () => {
      const originalWarn = console.warn;
      console.warn = (message, ...args) => {
        if (
          message.includes("already registered") ||
          message.includes("backend 'webgl'")
        ) {
          return;
        }
        originalWarn(message, ...args);
      };
    };

    suppressWarnings();
  }, []);

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

        // 독립변수 tensor화
        const inputTensor = tf.tensor2d(sampleInputs);
        // 독립변수 min-max스케일링
        const normalizedInputs = inputTensor
          .sub(inputStats.min)
          .div(inputStats.max.sub(inputStats.min));

        // 종속변수 예측값
        const predictions = model.predict(normalizedInputs) as tf.Tensor;
        // 종속변수 역스케일링
        const denormalizedPredictions = predictions
          .mul(outputStats.max.sub(outputStats.min))
          .add(outputStats.min);

        const predictionArray =
          denormalizedPredictions.arraySync() as number[][];
        console.log("predictionArray: ", predictionArray);

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
        console.log("formattedData2: ", formattedData);
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
  }, [chartData, selectedRegion]);
  console.log("tableData: ", tableData);

  const regionButtons = useMemo(() => {
    return regions.map((region) => (
      <Button
        key={region}
        variant={selectedRegion === region ? "secondary" : "outline"}
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
      <div className="flex gap-2">{regionButtons}</div>
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
          {selectedRegion} 테이블
        </h4>
        <PredictTable tableData={tableData || []} />
      </div>
    </div>
  );
}

export default PredictMain;
