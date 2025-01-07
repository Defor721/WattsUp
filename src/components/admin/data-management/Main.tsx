"use client";

import React from "react";

import RegionData from "./RegionData";
import TradeTable from "./TradeTable";

function Main() {
  return (
    <div className="mt-3">
      <RegionData />
      <TradeTable />
    </div>
  );
}

export default Main;
