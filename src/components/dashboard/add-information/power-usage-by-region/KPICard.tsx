import React from "react";

interface KPICardProps {
  title: string;
  value: string | number;
  unit: string;
  backgroundColor: string;
  iconColor: string;
  icon?: React.ReactNode;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  backgroundColor,
  iconColor,
  icon,
}) => {
  return (
    <div
      className="flex items-center justify-between rounded-lg p-4 shadow-md"
      style={{
        backgroundColor: backgroundColor,
        color: "#FFFFFF",
      }}
    >
      {/* Icon Section */}
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full"
        style={{
          backgroundColor: iconColor,
        }}
      >
        {icon || "📊"}
      </div>

      {/* Title and Value Section */}
      <div className="ml-4 flex-1">
        <p className="text-sm font-semibold text-gray-300">{title}</p>
        <p className="text-2xl font-bold">
          {value} <span className="text-base">{unit}</span>
        </p>
      </div>
    </div>
  );
};

export default KPICard;
