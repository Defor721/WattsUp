"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";

function Page() {
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState<tf.Sequential | null>(null);
  const [inputTensor, setInputTensor] = useState<tf.Tensor | null>(null);
  const [outputTensor, setOutputTensor] = useState<tf.Tensor | null>(null);

  useEffect(() => {
    const fetchDataAndInitializeModel = async () => {
      try {
        // 데이터 가져오기
        const response_dataset = await axios.get("/api/learning/dataset");
        const response_amgo = await axios.get("/api/learning/amgo");

        const dataset = response_dataset.data.data;
        const amgoData = response_amgo.data.data;

        // 데이터 전처리
        const { inputs, outputs } = prepareData(dataset, amgoData);

        // Tensor 변환
        const inputTensor = tf.tensor2d(inputs);
        const outputTensor = tf.tensor2d(outputs);

        // 상태 저장
        setInputTensor(inputTensor);
        setOutputTensor(outputTensor);

        // 모델 생성
        const model = createModel();
        setModel(model);
      } catch (error) {
        console.error("데이터 가져오기 또는 초기화 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataAndInitializeModel();
  }, []);

  // 데이터 표준화 함수
  const standardizeData = (data: number[]) => {
    const mean = data.reduce((acc, value) => acc + value, 0) / data.length;
    const stdDev = Math.sqrt(
      data.reduce((acc, value) => acc + (value - mean) ** 2, 0) / data.length,
    );
    return data.map((value) => (value - mean) / stdDev);
  };

  // 데이터 전처리 함수
  const prepareData = (dataset: any[], amgoData: any[]) => {
    // 독립변수
    const rawInputs = dataset.map((item) => [
      parseFloat(item["일 강수량 (mm)"]),
      parseFloat(item["일 평균 수증기압 (hPa)"]),
      parseFloat(item["일 평균 지면온도 (C)"]),
      parseFloat(item["일 평균 풍속 (m/s)"]),
      parseFloat(item["일 평균 현지기압 (hPa)"]),
      parseFloat(item["일 평균기온 (C)"]),
      parseFloat(item["일사합 (MJ/m2)"]),
      parseFloat(item["일조합 (hr)"]),
      parseFloat(item["최대풍속 (m/s)"]),
    ]);

    // 각 피처를 표준화
    const standardizedInputs = rawInputs.map((row, rowIndex) =>
      row.map((value, colIndex) => {
        const columnValues = rawInputs.map((r) => r[colIndex]);
        const mean =
          columnValues.reduce((acc, val) => acc + val, 0) / columnValues.length;
        const stdDev = Math.sqrt(
          columnValues.reduce((acc, val) => acc + (val - mean) ** 2, 0) /
            columnValues.length,
        );
        return (value - mean) / stdDev;
      }),
    );

    // 종속변수 표준화
    const rawOutputs = amgoData.map((item) => parseFloat(item["amgo"]));
    const meanOutput =
      rawOutputs.reduce((acc, value) => acc + value, 0) / rawOutputs.length;
    const stdDevOutput = Math.sqrt(
      rawOutputs.reduce((acc, value) => acc + (value - meanOutput) ** 2, 0) /
        rawOutputs.length,
    );
    const standardizedOutputs = rawOutputs.map(
      (value) => (value - meanOutput) / stdDevOutput,
    );

    return {
      inputs: standardizedInputs,
      outputs: standardizedOutputs.map((value) => [value]),
    };
  };

  // 모델 생성 함수
  const createModel = () => {
    const model = tf.sequential();
    model.add(
      tf.layers.dense({ inputShape: [9], units: 64, activation: "relu" }),
    );
    model.add(tf.layers.dense({ units: 32, activation: "relu" }));
    model.add(tf.layers.dense({ units: 1 })); // 단일 출력
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
      epochs: 10, // 한 번에 학습할 에포크 수
      callbacks: {
        onEpochEnd: (epoch: number, logs: any) => {
          console.log(`Epoch ${epoch}: RMSE =>`, Math.sqrt(logs.loss));
        },
      },
    };

    await model.fit(inputTensor, outputTensor, fitParam);
    console.log("추가 학습 완료!");
  };

  const saveModel = async () => {
    if (!model) {
      console.error("모델이 초기화되지 않았습니다.");
      return;
    }

    try {
      // 모델 저장 (파일 다운로드)
      await model.save("downloads://trained-model");
      console.log("모델이 브라우저에 저장되었습니다!");
    } catch (error) {
      console.error("모델 저장 중 오류 발생:", error);
    }
  };

  const saveModelToIndexedDB = async () => {
    if (!model) {
      console.error("모델이 초기화되지 않았습니다.");
      return;
    }

    try {
      // 모델 저장 (IndexedDB)
      await model.save("indexeddb://trained-model");
      console.log("모델이 IndexedDB에 저장되었습니다!");
    } catch (error) {
      console.error("IndexedDB에 모델 저장 중 오류 발생:", error);
    }
  };

  const loadModelFromIndexedDB = async () => {
    try {
      const loadedModel = await tf.loadLayersModel("indexeddb://trained-model");
      setModel(loadedModel as tf.Sequential);
      console.log("IndexedDB에서 모델을 불러왔습니다!");
    } catch (error) {
      console.error("IndexedDB에서 모델 불러오기 중 오류 발생:", error);
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
      <button onClick={saveModelToIndexedDB}>모델 저장 (IndexedDB)</button>
      <br />
      <button onClick={loadModelFromIndexedDB}>
        IndexedDB에서 모델 불러오기
      </button>
      <br />
      <h2>학습 기록</h2>
      <ul>{/* 학습 기록 표시 */}</ul>
    </div>
  );
}

export default Page;
