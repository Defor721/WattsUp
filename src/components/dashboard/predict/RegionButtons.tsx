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
              ? "bg-[rgb(7,15,38)] text-white"
              : "bg-gray-200"
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
