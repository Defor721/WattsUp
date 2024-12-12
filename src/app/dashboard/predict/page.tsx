"use client";

import React, { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import axios from "axios";

function Page() {
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState<tf.Sequential | tf.LayersModel | null>(
    null,
  );

  // 데이터 초기화
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response_weather = await axios.get("/api/weather");

        const weatherData = response_weather.data.results;

        console.log("weatherData: ", weatherData);

        // const loadedModel = await tf.loadLayersModel(
        //   "/assets/models/model.json",
        // );
        // setModel(loadedModel);

        console.log("모델 및 데이터 초기화 완료");
      } catch (error) {
        console.error("데이터 가져오기 또는 초기화 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>TensorFlow.js Model Training</h1>
    </div>
  );
}

export default Page;
