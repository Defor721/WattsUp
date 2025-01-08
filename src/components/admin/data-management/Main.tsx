"use client";

import React from "react";

import RegionData from "./RegionData";
import TradeTable from "./TradeTable";
import TotalStats from "./TotalStats";

function Main() {
  return (
    <div className="mt-3">
      <div className="flex gap-3">
        <RegionData />
        <TotalStats />
      </div>
      <TradeTable />
    </div>
  );
}

export default Main;
