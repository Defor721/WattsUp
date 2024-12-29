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
      className="flex flex-col justify-between rounded-lg p-4 shadow-md"
      style={{ backgroundColor }}
    >
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="flex items-end justify-between">
        <p className="text-4xl font-bold text-white">{value}</p>
        <span className="text-lg text-gray-300">{unit}</span>
      </div>
    </div>
  );
};

export default KPICard;
