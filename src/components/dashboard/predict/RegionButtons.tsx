import React from "react";

import { Button } from "@/components/shadcn";

interface RegionButtonsProps {
  regions: string[];
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
}

function RegionButtons({
  regions,
  selectedRegion,
  setSelectedRegion,
}: RegionButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {regions.map((region) => (
        <Button
          key={region}
          variant={"outline"}
          className={`${
            selectedRegion === region
              ? "bg-[#070f26] text-white dark:bg-gray-50 dark:text-black" // 현재 선택된 도시
              : "bg-gray-50 dark:bg-[#070f26] dark:text-white" // 현재 선택되지 않은 도시시
          }`}
          onClick={() => setSelectedRegion(region)}
        >
          {region}
        </Button>
      ))}
    </div>
  );
}

export default RegionButtons;
