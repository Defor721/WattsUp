"use client";

import React, { useEffect, useState, useMemo } from "react";
import * as tf from "@tensorflow/tfjs";
import axios from "axios";

import PredictChart from "@/components/dashboard/predict/Chart";
import { regions } from "@/utils/regions";
import { Button } from "@/components/shadcn";

const inputStats = {
  min: -11.7,
  max: 33.3,
};

const outputStats = {
  min: 1.574659,
  max: 18407.543211,
};

async function loadModel() {
  return await tf.loadLayersModel("/assets/models/model.json");
}

let isTfReady = false;

function Page() {
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<Record<string, any[]>>();
  const [chartData, setChartData] = useState<Record<string, any[]>>({});
  const [selectedRegion, setSelectedRegion] = useState("서울시");

  useEffect(() => {
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
    const fetchDataAndPredict = async () => {
      try {
        setLoading(true);

        const [weatherResponse, model] = await Promise.all([
          axios.get("/api/weather"),
          loadModel(),
        ]);

        const weatherData = weatherResponse.data.results;
        setWeatherData(weatherData);

        const sampleInputs: number[][] = [];
        regions.forEach((region) => {
          weatherData[region].forEach((day: any) => {
            sampleInputs.push([
              parseFloat(day.data[0]["일 평균기온 (C)"]) || 0,
            ]);
          });
        });

        const inputTensor = tf.tensor2d(sampleInputs);
        const normalizedInputs = inputTensor
          .sub(inputStats.min)
          .div(inputStats.max - inputStats.min);

        const predictions = model.predict(normalizedInputs) as tf.Tensor;
        const denormalizedPredictions = predictions
          .mul(outputStats.max - outputStats.min)
          .add(outputStats.min);

        const predictionArray =
          denormalizedPredictions.arraySync() as number[][];

        const formattedData: Record<string, any[]> = {};
        regions.forEach((region, regionIndex) => {
          formattedData[region] = weatherData[region].map((day, dayIndex) => {
            const predictionIndex = dayIndex * regions.length + regionIndex;
            return {
              date: day.date,
              amgo: parseFloat(
                Math.max(0, predictionArray[predictionIndex]?.[0] || 0).toFixed(
                  2,
                ),
              ),
            };
          });
        });

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching or processing data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndPredict();
  }, []);

  useEffect(() => {
    const configureBackend = async () => {
      if (!isTfReady) {
        await tf.ready();
        const backend = tf.getBackend();
        if (backend !== "cpu") {
          await tf.setBackend("cpu");
        }
        isTfReady = true;
      }
    };

    configureBackend();
  }, []);

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

  return (
    <div>
      <h1>TensorFlow.js Model Predictions</h1>
      <div>{regionButtons}</div>
      <div>
        <h2>{selectedRegion}</h2>
        <PredictChart
          data={chartData[selectedRegion]}
          region={selectedRegion}
        />
      </div>
    </div>
  );
}

export default Page;
