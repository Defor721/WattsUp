import React from "react";

interface KPICardProps {
  title: string;
  value: string | number;
  backgroundColor: string; // 카드 배경색
}

const KPICard: React.FC<KPICardProps> = ({ title, value, backgroundColor }) => {
  return (
    <div
      className={`flex items-center justify-between rounded-lg p-4 shadow-md`}
      style={{ backgroundColor }}
    >
      {/* 제목 및 값 */}
      <div className="flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export default KPICard;
