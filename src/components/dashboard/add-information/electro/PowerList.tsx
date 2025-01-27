import React from "react";

import { Card, Progress } from "@/components/shadcn";

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
    <div className="flex w-full flex-col gap-2">
      {powerDataArray
        .sort((a, b) => b.value - a.value)
        .map((item) => {
          const percentage = (item.value / total) * 100; // 퍼센트 계산

          return (
            <div key={item.name} className="">
              <div className="flex justify-between">
                <span className="font-medium">{item.name}</span>
                <span className="text-sm text-gray-400">
                  {percentage.toFixed(1)}% ({item.value.toLocaleString()} GWh)
                </span>
              </div>
              <Progress
                value={percentage} // 퍼센트 값 전달
                className={`h-full ${item.color}`} // 높이와 색상 추가
              />
            </div>
          );
        })}
    </div>
  );
};

export default PowerList;
