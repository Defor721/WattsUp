import React, { useEffect, useMemo, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import axios from "axios";

import { regions } from "@/utils/regions";
import { Button } from "@/components/shadcn";

import PredictChart from "./PredictChart";
import PredictTable from "./PredictTable";

function PredictMain() {
  const [loading, setLoading] = useState(true);
  const [model, setModel] = useState<tf.Sequential | tf.LayersModel | null>(
    null,
  );
  const [inputTensor, setInputTensor] = useState<tf.Tensor | null>(null);
  const [outputTensor, setOutputTensor] = useState<tf.Tensor | null>(null);
  const [inputStats, setInputStats] = useState<any>(null);
  const [outputStats, setOutputStats] = useState<any>(null);
  const [selectedRegion, setSelectedRegion] = useState("서울시");

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

        console.log("inputStats: ", inputStats);
        console.log("outputStats: ", outputStats);

        // Tensor 변환
        const inputTensor = tf.tensor(inputs);
        const outputTensor = tf.tensor(outputs);

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
      parseFloat(item["일 평균기온 (C)"] || 0),
      // parseFloat(item["일사합 (MJ/m2)"] || 0),
    ]);

    // 특정 이상치 수정
    const fixedInputs = fixSpecificOutliers(rawInputs);

    // 독립 변수 정규화
    const inputStats = calcStats(fixedInputs); // 항상 객체로 처리

    // 독립변수 정규화
    const normalizedInputs = normalize(
      fixedInputs,
      inputStats.min,
      inputStats.max,
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
      tf.layers.dense({ inputShape: [1], units: 64, activation: "relu" }),
    );
    model.add(tf.layers.batchNormalization());
    model.add(tf.layers.dropout({ rate: 0.3 })); // 드롭아웃 추가

    model.add(tf.layers.dense({ units: 32, activation: "relu" }));
    model.add(tf.layers.batchNormalization());
    model.add(tf.layers.dropout({ rate: 0.3 })); // 드롭아웃 추가

    model.add(tf.layers.dense({ units: 16, activation: "relu" }));
    model.add(tf.layers.batchNormalization());
    model.add(tf.layers.dropout({ rate: 0.3 })); // 드롭아웃 추가

    model.add(tf.layers.dense({ units: 1 }));

    model.compile({
      optimizer: tf.train.adam(0.0001),
      loss: tf.losses.meanSquaredError,
    });

    return model;
  };

  // 학습 함수
  const trainModel = async () => {
    setLoading(true);
    try {
      if (!model || !inputTensor || !outputTensor) {
        throw new Error("모델 또는 데이터가 초기화되지 않았습니다.");
      }

      const fitParam = {
        epochs: 10,
        batchSize: 64,
        callbacks: {
          onEpochEnd: (epoch: number, logs: any) => {
            // console.log(`Epoch ${epoch}: RMSE =>`, Math.sqrt(logs.loss));
            console.log(`Epoch ${epoch}: LOSS =>`, logs.loss);
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

      console.log("예측값 (소수점 2자리):", formattedPrediction);
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

  const fixSpecificOutliers = (rawInputs: any[]) => {
    let outlierCount = 0; // 수정된 -99의 개수를 추적

    return rawInputs.map((row) => {
      const [temp] = row; // 일사합을 고려하지 않으므로 첫 번째 값만 확인

      if (temp === -99) {
        outlierCount += 1; // 수정 대상 발생 시 카운트 증가

        if (outlierCount === 1) {
          return [25]; // 첫 번째 -99를 25로 변경
        }

        if (outlierCount === 2) {
          return [27.8]; // 두 번째 -99를 27.8로 변경
        }
      }

      return row; // 나머지 값은 그대로 유지
    });
  };

  const handlePrintStats = () => {
    console.log("Input Stats:", inputStats);
    console.log("Output Stats:", outputStats);
  };

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
      <button onClick={trainModel}>추가 학습</button>
      <br />
      <button onClick={saveModel}>모델 저장 (다운로드)</button>
      <br />
      <button onClick={handlePrintStats}>스탯 알아보기</button>
    </div>
  );
}

export default PredictMain;
