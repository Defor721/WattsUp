"use client";

import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { BatteryCharging, TrendingUp, TrendingDown, Users } from "lucide-react";

// import KPICard from "@/app/dashboard/electro/KPIcard";

interface PowerData {
  연도: number;
  "발전설비총계(MW)": number;
  "총발전량총계(GWh)": number;
  "부하율(%)": number;
  "이용율(%)": number;
}

const PowerDashboard: React.FC = () => {
  const [data, setData] = useState<PowerData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [currentData, setCurrentData] = useState<PowerData | null>(null);
  const [previousData, setPreviousData] = useState<PowerData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/assets/HOME_주요지표_전력지표.xlsx");
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
        type: "array",
      });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: PowerData[] = XLSX.utils.sheet_to_json(worksheet);
      setData(jsonData);
      setSelectedYear(jsonData[0]?.연도 || null);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      const current = data.find((d) => d.연도 === selectedYear);
      const previous = data.find((d) => d.연도 === selectedYear - 1);
      setCurrentData(current || null);
      setPreviousData(previous || null);
    }
  }, [selectedYear, data]);

  const calculateChange = (current: number, previous: number | undefined) => {
    if (previous === undefined || previous === 0) return null;
    return (((current - previous) / previous) * 100).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-gray-200">
      <h1 className="mb-6 text-center text-4xl font-bold text-white">
        {"Today's Power Metrics"}
      </h1>
      <div className="grid grid-cols-4 gap-4">
        {/* {currentData && previousData && (
          <>
            <KPICard
              title="발전설비총계"
              value={`${currentData["발전설비총계(MW)"]} MW`}
              change={parseFloat(
                calculateChange(
                  currentData["발전설비총계(MW)"],
                  previousData["발전설비총계(MW)"],
                ) || "0",
              )}
              icon={<BatteryCharging className="text-yellow-400" />}
              color="text-yellow-400"
            />
            <KPICard
              title="총발전량"
              value={`${currentData["총발전량총계(GWh)"]} GWh`}
              change={parseFloat(
                calculateChange(
                  currentData["총발전량총계(GWh)"],
                  previousData["총발전량총계(GWh)"],
                ) || "0",
              )}
              icon={<TrendingUp className="text-green-400" />}
              color="text-green-400"
            />
            <KPICard
              title="부하율"
              value={`${currentData["부하율(%)"]}%`}
              change={parseFloat(
                calculateChange(
                  currentData["부하율(%)"],
                  previousData["부하율(%)"],
                ) || "0",
              )}
              icon={<Users className="text-blue-400" />}
              color="text-blue-400"
            />
            <KPICard
              title="이용율"
              value={`${currentData["이용율(%)"]}%`}
              change={parseFloat(
                calculateChange(
                  currentData["이용율(%)"],
                  previousData["이용율(%)"],
                ) || "0",
              )}
              icon={<TrendingDown className="text-red-400" />}
              color="text-red-400"
            />
          </>
        )} */}
      </div>
    </div>
  );
};

export default PowerDashboard;
