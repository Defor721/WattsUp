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
        color: "#FFFFFF", // 텍스트 색상
      }}
    >
      {/* 아이콘 */}
      <div
        className="flex h-12 w-12 items-center justify-center rounded-full"
        style={{
          backgroundColor: iconColor || "#334155", // 아이콘 배경색
        }}
      >
        {icon}
      </div>

      {/* 제목 및 값 */}
      <div className="ml-4 flex-1">
        <p className="text-sm font-semibold text-gray-300">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>

      {/* 메뉴 아이콘 */}
      <div className="cursor-pointer text-gray-500">⋮</div>
    </div>
  );
};

export default KPICard;
