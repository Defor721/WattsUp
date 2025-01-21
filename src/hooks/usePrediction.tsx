import { useQuery } from "@tanstack/react-query";
import * as tf from "@tensorflow/tfjs";
import apiClient from "@/lib/axios";

// React Query를 활용한 데이터 훅
export function usePrediction() {
  // 날씨 데이터
  const {
    data: weatherData,
    error: weatherError,
    isLoading: weatherLoading,
  } = useQuery({
    queryKey: ["weatherData"],
    queryFn: fetchWeatherData,
    staleTime: 1000 * 60 * 5, // 5분 캐싱
  });

  // 모델 예측 데이터
  const {
    data: chartData,
    error: chartError,
    isLoading: chartLoading,
  } = useQuery({
    queryKey: ["chartData", weatherData],
    queryFn: () => predictRegionData(weatherData!),
    enabled: !!weatherData, // weatherData가 있을 때만 실행
  });

  return {
    weatherData,
    chartData,
    loading: weatherLoading || chartLoading,
    error: weatherError || chartError,
  };
}

const LOCATIONS = [
  { name: "강원도", latitude: 37.8228, longitude: 128.1555 },
  { name: "경기도", latitude: 37.4138, longitude: 127.5183 },
  { name: "경상남도", latitude: 35.2374, longitude: 128.6922 },
  { name: "경상북도", latitude: 36.2486, longitude: 128.6647 },
  { name: "광주시", latitude: 35.1595, longitude: 126.8526 },
  { name: "대구시", latitude: 35.8714, longitude: 128.6014 },
  { name: "대전시", latitude: 36.3504, longitude: 127.3845 },
  { name: "부산시", latitude: 35.1796, longitude: 129.0756 },
  { name: "서울시", latitude: 37.5665, longitude: 126.978 },
  { name: "세종시", latitude: 36.4875, longitude: 127.2817 },
  { name: "울산시", latitude: 35.5384, longitude: 129.3114 },
  { name: "인천시", latitude: 37.4563, longitude: 126.7052 },
  { name: "전라남도", latitude: 34.8679, longitude: 126.991 },
  { name: "전라북도", latitude: 35.7175, longitude: 127.153 },
  { name: "충청남도", latitude: 36.5184, longitude: 126.8 },
  { name: "충청북도", latitude: 36.6357, longitude: 127.4917 },
];

const INPUT_STATS = { min: -24.6, max: 33.3 };
const OUTPUT_STATS = { min: 1.574659, max: 5263.160841499999 };

// 정규화 & 역정규화 함수
const normalize = (data: number[], min: number, max: number) =>
  data.map((value) => (value - min) / (max - min));

const denormalize = (data: number[], min: number, max: number) =>
  data.map((value) => value * (max - min) + min);

// 모델 로드 함수
const loadModel = async (): Promise<tf.LayersModel> => {
  console.time("Model Loading");
  const model = await tf.loadLayersModel("/assets/models/model.json");
  console.log("Model loaded successfully!");
  console.timeEnd("Model Loading");
  return model;
};

// 날씨 데이터를 가져오는 함수
const fetchWeatherData = async () => {
  const requests = LOCATIONS.map((location) =>
    apiClient
      .get(`/api/weather?lat=${location.latitude}&lon=${location.longitude}`)
      .then((response) => ({
        location: location.name,
        data: response.data.list,
      }))
      .catch(() => null),
  );

  const results = await Promise.allSettled(requests);

  const successfulResults = results
    .filter(
      (result): result is PromiseFulfilledResult<any> =>
        result.status === "fulfilled" && result.value !== null,
    )
    .map((result) => result.value);

  // 데이터 정리
  const processedWeatherData: Record<string, any[]> = {};
  successfulResults.forEach(({ location, data }) => {
    const groupedByDate = data.reduce((acc: any, entry: any) => {
      const date = entry.dt_txt.split(" ")[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          windSpeed: 0,
          temperature: 0,
          precipitation: 0,
          count: 0,
        };
      }
      acc[date].windSpeed += entry.wind.speed || 0;
      acc[date].temperature += entry.main.temp || 0;
      acc[date].precipitation += entry.rain?.["3h"] || 0;
      acc[date].count += 1;
      return acc;
    }, {});

    processedWeatherData[location] = Object.values(groupedByDate).map(
      (entry: any) => ({
        date: entry.date,
        windSpeed: (entry.windSpeed / entry.count).toFixed(2),
        temperature: (entry.temperature / entry.count).toFixed(2),
        precipitation: entry.precipitation.toFixed(2),
      }),
    );
  });

  return processedWeatherData;
};

// 모델을 사용하여 예측하는 함수
const predictRegionData = async (weatherData: Record<string, any[]>) => {
  if (!Object.keys(weatherData).length) return {};

  try {
    const model = await loadModel();
    if (!model) throw new Error("Model is not available.");

    const sampleInputs = LOCATIONS.flatMap((location) =>
      weatherData[location.name]?.map((day) => [
        day.windSpeed,
        day.temperature,
        day.precipitation,
      ]),
    );

    const inputTensor = tf.tensor2d(
      sampleInputs.map((input) =>
        input.map(
          (value) => normalize([value], INPUT_STATS.min, INPUT_STATS.max)[0],
        ),
      ),
    );

    const predictionsTensor = model.predict(inputTensor) as tf.Tensor;
    const predictionsArray = predictionsTensor.arraySync() as number[][];

    const denormalizedPredictions = predictionsArray.map(
      (pred) => denormalize([pred[0]], OUTPUT_STATS.min, OUTPUT_STATS.max)[0],
    );

    const formattedChartData: Record<string, any[]> = {};
    LOCATIONS.forEach((location, index) => {
      formattedChartData[location.name] = weatherData[location.name]?.map(
        (entry, i) => ({
          date: entry.date,
          amgo: denormalizedPredictions[i * LOCATIONS.length + index] || 0,
        }),
      );
    });

    return formattedChartData;
  } catch (err) {
    console.error("Error in prediction:", err);
    throw new Error("Failed to predict weather data.");
  }
};
