"use client";

import React, { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import axios from "axios";

import PredictChart from "@/components/dashboard/predict/PredictChart";

let modelInstance: tf.LayersModel | null = null; // 모델 캐싱

// 학습 시 사용한 inputStats와 outputStats를 하드코딩
const inputStats = {
  min: tf.tensor([-99]), // 학습 시 저장된 최소값
  max: tf.tensor([1032]), // 학습 시 저장된 최대값
};

const outputStats = {
  min: tf.tensor([1.574658989906311]), // 학습 시 저장된 최소값
  max: tf.tensor([18407.54296875]), // 학습 시 저장된 최대값
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
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().slice(0, 10)); // ISO 형식 날짜
  }
  return dates.sort(); // 오름차순 정렬
};

async function loadModel() {
  if (!modelInstance) {
    modelInstance = await tf.loadLayersModel("/assets/models/model.json");
  }
  return modelInstance;
}

function Page() {
  const [loading, setLoading] = useState(true);
  const [inputs, setInputs] = useState<tf.Tensor | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response_weather = await axios.get("/api/weather");
        const weatherData = response_weather.data.results;

        // TensorFlow.js 플랫폼 초기화 방지
        await tf.ready();
        if (!tf.engine().backendNames().includes("cpu")) {
          await tf.setBackend("cpu");
        }

        const sampleInputs: number[][] = [];
        for (const date in weatherData) {
          weatherData[date].forEach((region: any) => {
            sampleInputs.push([
              parseFloat(region.data[0]["일 평균 풍속 (m/s)"] || 0),
              parseFloat(region.data[0]["최대풍속 (m/s)"] || 0),
              parseFloat(region.data[0]["일 평균기온 (C)"] || 0),
              parseFloat(region.data[0]["일 평균 지면온도 (C)"] || 0),
              parseFloat(region.data[0]["일 평균 수증기압 (hPa)"] || 0),
              parseFloat(region.data[0]["일 평균 현지기압 (hPa)"] || 0),
              parseFloat(region.data[0]["일조합 (hr)"] || 0),
              parseFloat(region.data[0]["일사합 (MJ/m2)"] || 0),
              parseFloat(region.data[0]["일 강수량 (mm)"] || 0),
            ]);
          });
        }

        const inputTensor = tf.tensor2d(sampleInputs);
        const normalizedInputs = normalizeTensor(inputTensor, inputStats);
        setInputs(normalizedInputs);

        console.log("모델 및 데이터 초기화 완료");
      } catch (error) {
        console.error("데이터 가져오기 또는 초기화 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const predictIfReady = async () => {
      if (inputs) {
        console.log("모든 초기화 완료: 예측 실행 시작");
        await performPredictions(inputs);
      }
    };

    predictIfReady();
  }, [inputs]);

  // 데이터 정규화 함수
  const normalizeTensor = (tensor: tf.Tensor, stats: any) => {
    return tensor.sub(stats.min).div(stats.max.sub(stats.min));
  };

  // 데이터 역정규화 함수
  const denormalizeTensor = (tensor: tf.Tensor, stats: any) => {
    return tensor.mul(stats.max.sub(stats.min)).add(stats.min);
  };

  // 예측 수행 함수
  const performPredictions = async (normalizedTensor: tf.Tensor) => {
    try {
      const model = await loadModel();
      if (!model) {
        console.error("모델이 초기화되지 않았습니다.");
        return;
      }

      console.log("예측 수행 중...");
      const predictions = model.predict(normalizedTensor) as tf.Tensor;
      const denormalizedPredictions = denormalizeTensor(
        predictions,
        outputStats,
      );

      // 예측값 가공 (0보다 작은 값은 0으로 처리)
      const predictionArray = denormalizedPredictions.arraySync() as number[][];
      const processedPredictions = predictionArray.map((row) =>
        row.map((value) => (value < 0 ? 0 : (value / 1000).toFixed(2))),
      );

      const dates = getLast7Days();

      // console.log("processedPredictions: ", processedPredictions);
      // console.log("dates: ", dates);
      // console.log("regions: ", regions);

      const formattedData = dates.map((date, dateIndex) => {
        const row = { name: date }; // 각 날짜별 데이터 그룹 생성
        regions.forEach((region, regionIndex) => {
          // 날짜 인덱스와 지역 인덱스를 기반으로 예측값 매핑
          const predictionIndex = dateIndex * regions.length + regionIndex;
          row[region] = parseFloat(
            processedPredictions[predictionIndex]?.[0] || 0,
          );
        });
        return row;
      });

      // 결과 확인
      console.log("formattedData: ", formattedData);

      setChartData(formattedData);

      // console.log("예측 결과 (가공 후):", formattedData);
    } catch (error) {
      console.error("예측 수행 중 오류 발생:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>TensorFlow.js Model Predictions</h1>
      <PredictChart data={chartData} />
    </div>
  );
}

export default Page;
