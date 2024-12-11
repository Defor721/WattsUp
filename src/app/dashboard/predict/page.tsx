"use client";

import React, { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import axios from "axios";

function Page() {
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState<tf.Sequential | tf.LayersModel | null>(
    null,
  );
  const [inputTensor, setInputTensor] = useState<tf.Tensor | null>(null);
  const [outputTensor, setOutputTensor] = useState<tf.Tensor | null>(null);
  const [inputStats, setInputStats] = useState<any>(null);
  const [outputStats, setOutputStats] = useState<any>(null);

  // 모델 초기화
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 데이터 가져오기
        const response_dataset = await axios.get("/api/learning/dataset");
        const response_amgo = await axios.get("/api/learning/amgo");

        const dataset = response_dataset.data.data;
        const amgoData = response_amgo.data.data;

        // 데이터 전처리
        const { inputs, outputs, inputStats, outputStats } = prepareData(
          dataset,
          amgoData,
        );

        // console.log(inputs);
        // console.log(outputs);

        // Tensor 변환
        const inputTensor = tf.tensor(inputs);
        const outputTensor = tf.tensor(outputs);
        // inputTensor.print();
        // outputTensor.print();

        // 상태 저장
        setInputTensor(inputTensor);
        setOutputTensor(outputTensor);
        setInputStats(inputStats);
        setOutputStats(outputStats);

        const model = createModel();
        setModel(model);
        console.log("모델 초기화 완료");
      } catch (error) {
        console.error("데이터 가져오기 또는 초기화 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Min-Max 정규화 함수
  const normalize = (data: number[], min: number, max: number) =>
    data.map((value) => (value - min) / (max - min));

  // 역정규화 함수
  const denormalize = (data: number[], min: number, max: number) =>
    data.map((value) => value * (max - min) + min);

  // 통계 계산 함수
  const calcStats = (data: number[]) => ({
    min: Math.min(...data),
    max: Math.max(...data),
  });

  // 데이터 전처리 함수
  const prepareData = (dataset: any[], amgoData: any[]) => {
    const rawInputs = dataset.map((item) => [
      parseFloat(item["일 평균 풍속 (m/s)"] || 0),
      parseFloat(item["일 평균기온 (C)"] || 0),
    ]);

    // 독립 변수 정규화
    const inputStats = rawInputs[0].map((_, colIndex) =>
      calcStats(rawInputs.map((row) => row[colIndex])),
    );
    const normalizedInputs = rawInputs.map((row) =>
      row.map(
        (value, index) =>
          normalize([value], inputStats[index].min, inputStats[index].max)[0],
      ),
    );

    const rawOutputs = amgoData.map((item) => parseFloat(item["amgo"] || 0));

    // 종속 변수 정규화
    const outputStats = calcStats(rawOutputs);
    const normalizedOutputs = normalize(
      rawOutputs,
      outputStats.min,
      outputStats.max,
    );

    return {
      inputs: normalizedInputs, // 2차원 배열
      outputs: normalizedOutputs.map((value) => [value]), // 2차원 배열로 변환
      inputStats,
      outputStats,
    };
  };

  // 모델 생성 함수
  const createModel = () => {
    const model = tf.sequential();

    model.add(
      tf.layers.dense({ inputShape: [2], units: 32, activation: "relu" }),
    );
    model.add(tf.layers.batchNormalization()); // 배치 정규화 추가

    model.add(tf.layers.dense({ units: 16, activation: "relu" }));
    model.add(tf.layers.batchNormalization()); // 배치 정규화 추가

    model.add(tf.layers.dense({ units: 1 })); // 단일 출력층

    // 모델 컴파일
    model.compile({
      optimizer: tf.train.adam(),
      loss: tf.losses.meanSquaredError,
    });

    return model;
  };

  // 학습 함수
  const trainModel = async () => {
    setLoading(true);
    try {
      if (
        !model ||
        !inputTensor ||
        !outputTensor ||
        !inputStats ||
        !outputStats
      ) {
        throw new Error("모델 또는 데이터가 초기화되지 않았습니다.");
      }

      const fitParam = {
        epochs: 10,
        batchSize: 64,
        callbacks: {
          onEpochEnd: (epoch: number, logs: any) => {
            console.log(`Epoch ${epoch}: RMSE =>`, Math.sqrt(logs.loss));
          },
        },
      };

      await model.fit(inputTensor, outputTensor, fitParam);
      console.log("추가 학습 완료!");

      const predictions = model.predict(inputTensor) as tf.Tensor;
      const normalizedPrediction = predictions.dataSync();
      const denormalizedPrediction = denormalize(
        Array.from(normalizedPrediction),
        outputStats.min,
        outputStats.max,
      );

      const formattedPrediction = denormalizedPrediction.map((value) =>
        parseFloat(value.toFixed(2)),
      );

      console.log("예측값 (역정규화, 소수점 2자리):", formattedPrediction);
    } catch (error) {
      console.error("학습 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };

  // 모델 저장
  const saveModel = async () => {
    if (!model) {
      console.error("모델이 초기화되지 않았습니다.");
      return;
    }

    try {
      // 모델 저장 (파일 다운로드)
      await model.save("downloads://model");
      console.log("모델이 브라우저에 저장되었습니다!");
    } catch (error) {
      console.error("모델 저장 중 오류 발생:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>TensorFlow.js Model Training</h1>
      <p>모델 학습 및 초기화 완료.</p>
      <button onClick={trainModel}>추가 학습</button>
      <br />
      <button onClick={saveModel}>모델 저장 (다운로드)</button>
      <br />
    </div>
  );
}

export default Page;
