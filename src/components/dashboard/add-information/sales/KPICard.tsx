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
      className="flex items-center justify-between rounded-lg p-4 shadow-md"
      style={{ backgroundColor }}
    >
      {/* 텍스트 섹션 */}
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-2xl font-bold">
          {value.toLocaleString()} <span className="text-base">{unit}</span>
        </p>
      </div>
    </div>
  );
};

export default KPICard;
