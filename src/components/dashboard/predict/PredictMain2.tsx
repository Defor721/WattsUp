import React, { useEffect, useMemo, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import axios from "axios";

import { regions } from "@/utils/regions";
import { Button } from "@/components/shadcn";
import { getLast7Days } from "@/utils/getLast7Days";

import PredictChart from "./PredictChart";
import PredictTable from "./PredictTable";

function PredictMain() {
  const [loading, setLoading] = useState(true);
  const [weatherData, setWeatherData] = useState<Record<string, any[]>>();
  const [chartData, setChartData] = useState<Record<string, any[]>>({});
  const [selectedRegion, setSelectedRegion] = useState("서울시");

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        const weatherResponse = await axios.get("/api/weather");
        console.log(
          "weatherResponse.data.results: ",
          weatherResponse.data.results,
        );
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

        console.log("sampleInputs: ", sampleInputs);
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
      <div className="flex-wrap justify-start gap-2 md:flex">
        {regionButtons}
      </div>
    </div>
  );
}

export default PredictMain;
