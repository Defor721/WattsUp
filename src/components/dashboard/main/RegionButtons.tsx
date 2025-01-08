import React from "react";

import {
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn";

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
    <div className="mb-4 flex items-center justify-end gap-4">
      <Label htmlFor="region" className="md:text-base">
        지역 선택
      </Label>
      <Select value={selectedRegion} onValueChange={setSelectedRegion}>
        <SelectTrigger
          id="region"
          className="w-[180px] bg-white dark:bg-cardBackground-dark"
        >
          <SelectValue placeholder="지역 선택 " />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-cardBackground-dark">
          {regions.map((region) => (
            <SelectItem
              className="z-10 bg-white dark:bg-cardBackground-dark"
              key={region}
              value={region}
            >
              {region}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default RegionButtons;
