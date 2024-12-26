import React from "react";

interface KPICardProps {
  title: string;
  value: string | number;
  backgroundColor: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, backgroundColor }) => {
  return (
    <div
      className="rounded-lg p-4 shadow-lg"
      style={{ backgroundColor: backgroundColor }}
    >
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-2xl font-bold text-white">{value}</p>
    </div>
  );
};

export default KPICard;
