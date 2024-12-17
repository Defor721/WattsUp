export type PowerSupplyData = {
  time: string;
  supply: number;
  demand: number;
  reserve: number;
  reserveRate: number;
};

export type PowerForecastData = {
  time: string;
  forecastDemand: number;
};
