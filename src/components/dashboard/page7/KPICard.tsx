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
        <p className="text-sm font-semibold text-gray-200">{title}</p>
        <p className="text-2xl font-bold text-white">
          {value.toLocaleString()} <span className="text-base">{unit}</span>
        </p>
      </div>

      {/* 아이콘 섹션 */}
      <div
        className="flex h-10 w-10 items-center justify-center rounded-full"
        style={{ backgroundColor: iconColor }}
      >
        <span className="text-xl text-white">★</span>
      </div>
    </div>
  );
};

export default KPICard;
