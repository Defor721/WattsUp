import React from "react";

interface KPICardProps {
  title: string;
  value: string;
  backgroundColor: string;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, backgroundColor }) => {
  return (
    <div className="rounded-lg p-4 shadow-md" style={{ backgroundColor }}>
      <h4 className="text-sm font-medium">{title}</h4>
      <p className="mt-2 text-xl font-bold">{value}</p>
    </div>
  );
};

export default KPICard;
