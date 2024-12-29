import React from "react";

interface KPICardProps {
  title: string;
  value: string | number;
  unit: string;
  backgroundColor: string;
  iconColor: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  backgroundColor,
  iconColor,
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-lg p-6 shadow-lg"
      style={{ backgroundColor }}
    >
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="mt-2 text-2xl font-bold text-white">
        {value} <span className="text-base text-gray-300">{unit}</span>
      </p>
      <div
        className="mt-4 h-10 w-10 rounded-full"
        style={{ backgroundColor: iconColor }}
      ></div>
    </div>
  );
};

export default KPICard;
