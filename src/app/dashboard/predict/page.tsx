"use client";

import React, { useEffect, useState, useMemo } from "react";
import * as tf from "@tensorflow/tfjs";
import axios from "axios";

import PredictChart from "@/components/dashboard/predict/PredictChart";
import { Button } from "@/components/shadcn";

const inputStats = {
  min: tf.tensor([-99]),
  max: tf.tensor([1032]),
};

const outputStats = {
  min: tf.tensor([1.574658989906311]),
  max: tf.tensor([18407.54296875]),
};

const regions = [
  "강원도",
  "경기도",
  "경상남도",
  "경상북도",
  "광주시",
  "대구시",
  "대전시",
  "부산시",
  "서울시",
  "세종시",
  "울산시",
  "인천시",
  "전라남도",
  "전라북도",
  "충청남도",
  "충청북도",
];

const getLast7Days = (): string[] => {
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().slice(0, 10);
  }).sort();
};

async function loadModel() {
  return await tf.loadLayersModel("/assets/models/model.json");
}

function Page() {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<Record<string, any[]>>({});
  const [selectedRegion, setSelectedRegion] = useState("서울시");

  useEffect(() => {
    const fetchDataAndPredict = async () => {
      try {
        setLoading(true);

        const [weatherResponse, model] = await Promise.all([
          axios.get("/api/weather"),
          loadModel(),
        ]);

        const weatherData = weatherResponse.data.results;
        const sampleInputs: number[][] = [];

        regions.forEach((region) => {
          weatherData[region].forEach((day: any) => {
            sampleInputs.push([
              parseFloat(day.data[0]["일 평균 풍속 (m/s)"] || 0),
              parseFloat(day.data[0]["최대풍속 (m/s)"] || 0),
              parseFloat(day.data[0]["일 평균기온 (C)"] || 0),
              parseFloat(day.data[0]["일 평균 지면온도 (C)"] || 0),
              parseFloat(day.data[0]["일 평균 수증기압 (hPa)"] || 0),
              parseFloat(day.data[0]["일 평균 현지기압 (hPa)"] || 0),
              parseFloat(day.data[0]["일조합 (hr)"] || 0),
              parseFloat(day.data[0]["일사합 (MJ/m2)"] || 0),
              parseFloat(day.data[0]["일 강수량 (mm)"] || 0),
            ]);
          });
        });

        const inputTensor = tf.tensor2d(sampleInputs);
        const normalizedInputs = inputTensor
          .sub(inputStats.min)
          .div(inputStats.max.sub(inputStats.min));

        const predictions = model.predict(normalizedInputs) as tf.Tensor;
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
              amgo:
                Math.max(
                  0,
                  parseFloat(
                    (predictionArray[predictionIndex]?.[0] || 0).toFixed(2),
                  ),
                ) / 1000,
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

  const regionButtons = useMemo(() => {
    return regions.map((region) => (
      <Button
        key={region}
        variant={"outline"}
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
