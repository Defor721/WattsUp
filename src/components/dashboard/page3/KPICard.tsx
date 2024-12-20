import React from "react";

interface KPICardProps {
  title: string;
  value: string;
  unit?: string;
  trend: "up" | "down";
  change: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  trend,
  change,
}) => {
  return (
    <div className="rounded-lg bg-gray-800 p-4 shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        <span
          className={`text-sm font-bold ${trend === "up" ? "text-green-500" : "text-red-500"}`}
        >
          {trend === "up" ? "▲" : "▼"} {change}
        </span>
      </div>
      <div className="mt-2 text-2xl font-bold text-white">
        {value} <span className="text-lg text-gray-400">{unit}</span>
      </div>
    </div>
  );
};

export default KPICard;
