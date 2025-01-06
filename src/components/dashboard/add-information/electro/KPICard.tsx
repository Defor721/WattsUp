import React from "react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  backgroundColor: string; // 카드 배경색
  iconColor: string; // 아이콘 배경색
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon,
  backgroundColor,
  iconColor,
}) => {
  return (
    <div
      className="flex items-center justify-between rounded-lg p-4 shadow-md"
      style={{
        backgroundColor: backgroundColor || "#1E293B", // 카드 배경색
      }}
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
