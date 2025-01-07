import React from "react";

const KPICard = ({
  title,
  value,
  backgroundColor,
}: {
  title: string;
  value: string;
  backgroundColor: string;
}) => (
  <div className="rounded-lg p-4 shadow-lg" style={{ backgroundColor }}>
    <h3 className="text-sm font-semibold">{title}</h3>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export { KPICard };
