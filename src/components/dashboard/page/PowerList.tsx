import React from "react";

import { Card } from "@/components/ui/card";

interface PowerListProps {
  data: {
    "수력(GWh)": number;
    "화력(GWh)": number;
    "원자력(GWh)": number;
    "자가용(GWh)": number;
  };
}

const PowerList: React.FC<PowerListProps> = ({ data }) => {
  const powerDataArray = [
    { name: "수력", value: data["수력(GWh)"], color: "bg-blue-400" },
    { name: "화력", value: data["화력(GWh)"], color: "bg-yellow-400" },
    { name: "원자력", value: data["원자력(GWh)"], color: "bg-red-400" },
    { name: "자가용", value: data["자가용(GWh)"], color: "bg-green-400" },
  ];

  const total = powerDataArray.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <Card className="bg-gray-800 p-6">
      <h2 className="mb-4 text-lg font-semibold text-white">
        가장 많이 생산하는 전력 종류
      </h2>
      <div className="space-y-3">
        {powerDataArray
          .sort((a, b) => b.value - a.value) // 정렬
          .map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            return (
              <div
                key={item.name}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-gray-400">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-medium text-white">{item.name}</span>
                <div className="relative mx-4 h-2 w-2/3 rounded-full bg-gray-700">
                  <div
                    className={`absolute left-0 top-0 h-2 rounded-full ${item.color}`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-300">{percentage}%</span>
                <span className="font-medium text-gray-400">
                  {item.value.toLocaleString()} GWh
                </span>
              </div>
            );
          })}
      </div>
    </Card>
  );
};

export default PowerList;
