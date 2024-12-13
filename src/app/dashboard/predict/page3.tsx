"use client";

import React, { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import axios from "axios";

function Page() {
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState<tf.Sequential | tf.LayersModel | null>(
    null,
  );
  const [scalerX, setScalerX] = useState<any>(null);
  const [scalerY, setScalerY] = useState<any>(null);
  const [inputs, setInputs] = useState<tf.Tensor | null>(null);
  const [outputs, setOutputs] = useState<tf.Tensor | null>(null);

  // 모델 초기화
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response_dataset = await axios.get("/api/learning/dataset");
        const response_amgo = await axios.get("/api/learning/amgo");

        const dataset = response_dataset.data.data;
        const amgoData = response_amgo.data.data;
        const { inputs, outputs } = await prepareData(dataset, amgoData);
        // console.log(inputs);
        // console.log(outputs);
        // inputs.print();
        // outputs.print();
        setInputs(inputs);
        setOutputs(outputs);

        const loadedModel = await tf.loadLayersModel(
          "/assets/models/model.json",
        );
        setModel(loadedModel);

        // const modelInstance = createModel();
        // setModel(modelInstance);

        console.log("모델 초기화 완료");
      } catch (error) {
        console.error("데이터 가져오기 또는 초기화 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 데이터 전처리 함수
  const prepareData = async (dataset: any[], amgoData: any[]) => {
    const rawInputs = dataset.map((item) => [
      parseFloat(item["일 평균 풍속 (m/s)"] || 0),
      parseFloat(item["최대풍속 (m/s)"] || 0),
      parseFloat(item["일 평균기온 (C)"] || 0),
      parseFloat(item["일 평균 지면온도 (C)"] || 0),
      parseFloat(item["일 평균 수증기압 (hPa)"] || 0),
      parseFloat(item["일 평균 현지기압 (hPa)"] || 0),
      parseFloat(item["일조합 (hr)"] || 0),
      parseFloat(item["일사합 (MJ/m2)"] || 0),
      parseFloat(item["일 강수량 (mm)"] || 0),
    ]);
    const rawOutputs = amgoData.map((item) => parseFloat(item["amgo"] || 0));

    // console.log(features);
    // console.log(targets);

    const inputTensor = tf.tensor2d(rawInputs);
    const outputTensor = tf.tensor2d(rawOutputs, [rawOutputs.length, 1]);

    // console.log(inputTensor);
    // console.log(outputTensor);

    // Min-Max 스케일링
    const { normalizedTensor: normalizedInputs, stats: inputStats } =
      normalizeTensor(inputTensor);
    const { normalizedTensor: normalizedOutputs, stats: outputStats } =
      normalizeTensor(outputTensor);

    setScalerX(inputStats);
    setScalerY(outputStats);

    return { inputs: normalizedInputs, outputs: normalizedOutputs };
  };

  const normalizeTensor = (tensor: tf.Tensor) => {
    const min = tensor.min();
    const max = tensor.max();
    const normalizedTensor = tensor.sub(min).div(max.sub(min));

    return { normalizedTensor, stats: { min, max } };
  };

  const denormalizeTensor = (tensor: tf.Tensor, stats: any) => {
    return tensor.mul(stats.max.sub(stats.min)).add(stats.min);
  };

  // 모델 생성 함수
  const createModel = () => {
    const model = tf.sequential();

    model.add(
      tf.layers.dense({ inputShape: [9], units: 32, activation: "relu" }),
    );
    model.add(tf.layers.batchNormalization());

    model.add(tf.layers.dense({ units: 16, activation: "relu" }));
    model.add(tf.layers.batchNormalization());

    model.add(tf.layers.dense({ units: 1 }));

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
      if (!model || !inputs || !outputs) {
        throw new Error("모델 또는 데이터가 초기화되지 않았습니다.");
      }

      const fitParam = {
        epochs: 10,
        batchSize: 32,
        validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch: number, logs: any) => {
            console.log(`Epoch ${epoch}: RMSE =>`, Math.sqrt(logs.loss));
          },
        },
      };

      await model.fit(inputs, outputs, fitParam);
      console.log("추가 학습 완료!");
    } catch (error) {
      console.error("학습 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };

  const predict = async (inputData: number[]) => {
    if (!model || !scalerX || !scalerY) {
      console.error("모델 또는 스케일러가 초기화되지 않았습니다.");
      return;
    }

    const inputTensor = tf.tensor2d([inputData]);
    const normalizedInput = inputTensor
      .sub(scalerX.min)
      .div(scalerX.max.sub(scalerX.min));

    const prediction = model.predict(normalizedInput) as tf.Tensor;
    const denormalizedPrediction = denormalizeTensor(prediction, scalerY);

    // 배열로 변환
    const predictionArray = denormalizedPrediction.arraySync();

    if (Array.isArray(predictionArray)) {
      const formattedPrediction = predictionArray
        .flat(Infinity)
        .map((value) => (typeof value === "number" ? value.toFixed(2) : value));
      console.log("예측값 (역정규화):", formattedPrediction);
    } else {
      console.log(
        "예측값 (역정규화):",
        typeof predictionArray === "number"
          ? predictionArray.toFixed(2)
          : predictionArray,
      );
    }
  };

  const saveModel = () => {
    if (!model) {
      throw new Error("모델 또는 데이터가 초기화되지 않았습니다.");
    }
    model.save("downloads://model");
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
      <button
        onClick={() =>
          predict([1.5, 4.3, 13.8, 13, 10.3, 1012.6, 9.3, 12.67, -9])
        }
      >
        예측
      </button>
      <br />
      <button onClick={saveModel}>저장</button>
    </div>
  );
}

export default Page;
