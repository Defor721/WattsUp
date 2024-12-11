"use client";

import React, { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";

function Page() {
  const [model, setModel] = useState<tf.Sequential | tf.LayersModel | null>(
    null,
  );

  // 모델 초기화
  useEffect(() => {
    const model = createModel();
    setModel(model);
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
    if (!model) {
      console.error("모델 초기화되지 않았습니다.");
      return;
    }

    const rawInputData = [
      [3, 6.1],
      [1.7, 2.9],
      [3.4, 2.3],
      [7.5, 10],
    ];
    const rawOutputData = [1806.988292, 701.585258, 1482.81824, 925.309851];

    // 정규화
    const inputStats = rawInputData[0].map((_, colIndex) =>
      calcStats(rawInputData.map((row) => row[colIndex])),
    );

    const normalizedInputs = rawInputData.map((row) =>
      row.map(
        (value, index) =>
          normalize([value], inputStats[index].min, inputStats[index].max)[0],
      ),
    );

    const outputStats = calcStats(rawOutputData);
    const normalizedOutputs = normalize(
      rawOutputData,
      outputStats.min,
      outputStats.max,
    );

    // 텐서 변환
    const inputDataTensor = tf.tensor2d(normalizedInputs);
    const outputDataTensor = tf.tensor2d(normalizedOutputs.map((val) => [val]));

    // 학습
    const fitParam = {
      epochs: 100, // 한 번에 학습할 에포크 수
      batchSize: 64,
      callbacks: {
        onEpochEnd: (epoch: number, logs: any) => {
          console.log(`Epoch ${epoch}: RMSE =>`, Math.sqrt(logs.loss));
        },
      },
    };

    await model.fit(inputDataTensor, outputDataTensor, fitParam);
    console.log("추가 학습 완료!");

    // 예측값 계산
    const predictions = model.predict(inputDataTensor) as tf.Tensor;
    const normalizedPrediction = predictions.dataSync(); // 정규화된 예측값

    // 역정규화
    const denormalizedPrediction = denormalize(
      Array.from(normalizedPrediction),
      outputStats.min,
      outputStats.max,
    );

    console.log("예측값 (역정규화):", denormalizedPrediction);
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

  return (
    <div>
      <h1>TensorFlow.js Model Training</h1>
      <p>모델 학습 및 초기화 완료.</p>
      <button onClick={trainModel}>추가 학습</button>
      <br />
      <button onClick={saveModel}>모델 저장 (다운로드)</button>
      <br />

      {
        "mix-max 정규화를 하지 않고, 이 상태로 학습을 한 1,000 ~ 2,000번 정도 돌리면서 예측값을 확인해보니 점차 amgo값과 가까워지는 것을 발견했는데, min-max 정규화가 추가되면 "
      }
    </div>
  );
}

export default Page;
