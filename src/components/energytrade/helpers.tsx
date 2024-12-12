import React from "react";

import { PowerSupplyData, PowerForecastData } from "./types";

export function formatNumber(num: number): string {
  return num.toLocaleString("ko-KR");
}

export function calculateReserveRate(supply: number, demand: number): number {
  return ((supply - demand) / demand) * 100;
}

export function mockPowerSupplyData(): PowerSupplyData[] {
  const currentDate = new Date();
  const data: PowerSupplyData[] = [];

  for (let i = 0; i < 24; i++) {
    const time = new Date(currentDate);
    time.setHours(i, 0, 0, 0);

    const supply = Math.floor(Math.random() * (80000 - 60000) + 60000);
    const demand = Math.floor(Math.random() * (supply - 50000) + 50000);
    const reserve = supply - demand;
    const reserveRate = calculateReserveRate(supply, demand);

    data.push({
      time: time.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      supply,
      demand,
      reserve,
      reserveRate,
    });
  }

  return data;
}

export function mockPowerForecastData(): PowerForecastData[] {
  const currentDate = new Date();
  const data: PowerForecastData[] = [];

  for (let i = 0; i < 24; i++) {
    const time = new Date(currentDate);
    time.setHours(i, 0, 0, 0);

    const forecastDemand = Math.floor(Math.random() * (80000 - 60000) + 60000);

    data.push({
      time: time.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      forecastDemand,
    });
  }

  return data;
}
