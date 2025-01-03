import React from "react";

interface KPICardProps {
  title: string;
  value: string;
  backgroundColor: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, backgroundColor }) => {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-lg p-4 text-center shadow-lg"
      style={{ backgroundColor }}
    >
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
};

export default KPICard;
