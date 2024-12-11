"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";

function Page() {
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState<tf.Sequential | tf.LayersModel | null>(
    null,
  );
  const [inputTensor, setInputTensor] = useState<tf.Tensor | null>(null);
  const [outputTensor, setOutputTensor] = useState<tf.Tensor | null>(null);
  const [inputStats, setInputStats] = useState<any>(null);
  const [outputStats, setOutputStats] = useState<any>(null);

  useEffect(() => {
    const fetchDataAndInitializeModel = async () => {
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

        // console.log("inputs: ", inputs);
        // console.log("outputs: ", outputs);

        // Tensor 변환
        const inputTensor = tf.tensor2d(inputs);
        const outputTensor = tf.tensor2d(outputs);

        // inputTensor.print();
        // outputTensor.print();

        // 상태 저장
        setInputTensor(inputTensor);
        setOutputTensor(outputTensor);
        setInputStats(inputStats);
        setOutputStats(outputStats);

        // 모델 생성
        // const loadedModel = await tf.loadLayersModel(
        //   "/assets/models/model.json",
        // );
        // loadedModel.compile({
        //   optimizer: tf.train.adam(),
        //   loss: tf.losses.meanSquaredError,
        //   metrics: ["mse"],
        // });
        // setModel(loadedModel);

        const model = createModel();
        setModel(model);
        console.log("모델 초기화 완료 !");
      } catch (error) {
        console.error("데이터 가져오기 또는 초기화 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndInitializeModel();
  }, []);

  const prepareData = (dataset: any[], amgoData: any[]) => {
    // 독립변수 데이터 추출
    const rawInputs = dataset.map((item) => [
      parseFloat(item["일 평균 풍속 (m/s)"] || 0),
      // parseFloat(item["최대풍속 (m/s)"] || 0),
      parseFloat(item["일 평균기온 (C)"] || 0),
      // parseFloat(item["일 평균 지면온도 (C)"] || 0),
      // parseFloat(item["일 평균 수증기압 (hPa)"] || 0),
      // parseFloat(item["일 평균 현지기압 (hPa)"] || 0),
      // parseFloat(item["일조합 (hr)"] || 0),
      // parseFloat(item["일사합 (MJ/m2)"] || 0),
      // parseFloat(item["일 강수량 (mm)"] || 0),
    ]);

    // 종속변수 데이터 추출
    const rawOutputs = amgoData.map((item) => parseFloat(item["amgo"] || 0));

    // console.log("rawInputs ", rawInputs);
    // console.log("rawOutputs: ", rawOutputs);

    // Min-Max 정규화
    const normalize = (data: number[], min: number, max: number) =>
      data.map((value) => (value - min) / (max - min));

    const calcStats = (data: number[]) => ({
      min: Math.min(...data),
      max: Math.max(...data),
    });

    // 입력 데이터 정규화
    const inputStats = rawInputs[0].map((_, colIndex) =>
      calcStats(rawInputs.map((row) => row[colIndex])),
    );
    const normalizedInputs = rawInputs.map((row) =>
      row.map(
        (value, index) =>
          normalize([value], inputStats[index].min, inputStats[index].max)[0],
      ),
    );

    // console.log("Normalized Inputs:", normalizedInputs);
    // console.log("Input Stats:", inputStats);

    // 출력 데이터 정규화
    const outputStats = calcStats(rawOutputs);
    const normalizedOutputs = normalize(
      rawOutputs,
      outputStats.min,
      outputStats.max,
    );

    return {
      inputs: normalizedInputs,
      outputs: normalizedOutputs.map((value) => [value]), // 2D 배열로 변환
      inputStats,
      outputStats,
    };
  };

  const denormalize = (data: number[], min: number, max: number) =>
    data.map((value) => value * (max - min) + min);

  // 모델 생성 함수
  const createModel = () => {
    const model = tf.sequential();

    model.add(
      tf.layers.dense({ inputShape: [2], units: 32, activation: "relu" }),
    );
    model.add(tf.layers.batchNormalization()); // 배치 정규화 추가

    model.add(tf.layers.dense({ units: 16, activation: "relu" }));
    model.add(tf.layers.batchNormalization()); // 배치 정규화 추가

    // 출력층
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
    if (!model || !inputTensor || !outputTensor) {
      console.error("모델 또는 데이터가 초기화되지 않았습니다.");
      return;
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

    const rawInput = [1, 14.7]; // 입력값
    const normalizedInput = rawInput.map(
      (value, index) =>
        (value - inputStats[index].min) /
        (inputStats[index].max - inputStats[index].min),
    );

    const tensorInput = tf.tensor2d([normalizedInput]);
    const predictions = model.predict(tensorInput) as tf.Tensor;

    // 정규화된 예측값
    console.log("Raw Predictions (정규화된 값):", predictions.dataSync());

    // 역정규화된 예측값
    const denormalizedPredictions = Array.from(predictions.dataSync()).map(
      (value) => value * (outputStats.max - outputStats.min) + outputStats.min,
    );
    console.log(
      "Denormalized Predictions (역정규화된 값):",
      denormalizedPredictions,
    );
  };

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
