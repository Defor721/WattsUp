import React from "react";

interface KPICardProps {
  title: string;
  value: string | number;
  unit: string;
  backgroundColor: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  unit,
  backgroundColor,
}) => {
  return (
    <div
      className="flex items-center justify-between rounded-lg p-4 shadow-md"
      style={{
        backgroundColor: backgroundColor,
      }}
    >
      {/* Title and Value Section */}
      <div className="ml-4 flex-1 text-subColor">
        <p className="text-sm font-semibold">{title}</p>
        <div className="flex items-center gap-1">
          <p className="text-2xl font-bold">{value}</p>
          <span className="text-base font-bold">{unit}</span>
        </div>
      </div>
    </div>
  );
};

export default KPICard;
