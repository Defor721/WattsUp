import React from "react";

interface KPICardProps {
  title: string;
  value: string;
  unit?: string;
  trend?: "up" | "down"; // 선택적 속성으로 변경
  change?: string; // 선택적 속성으로 변경
  icon: React.ReactNode;
  backgroundColor: string;
  iconColor: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  trend,
  change,
  icon,
  backgroundColor,
  iconColor,
}) => {
  return (
    <div
      className="rounded-lg p-4 shadow-md"
      style={{ backgroundColor: backgroundColor }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-200">{title}</h3>
        {trend &&
          change && ( // trend와 change가 있을 때만 표시
            <span
              className={`text-sm font-bold ${
                trend === "up" ? "text-green-400" : "text-red-400"
              }`}
            >
              {trend === "up" ? "▲" : "▼"} {change}
            </span>
          )}
      </div>
      <div className="mt-4 flex items-center">
        <div className="mr-3" style={{ color: iconColor }}>
          {icon}
        </div>
        <div className="text-2xl font-bold text-white">
          {value} <span className="text-lg text-gray-300">{unit}</span>
        </div>
      </div>
    </div>
  );
};

export default KPICard;
