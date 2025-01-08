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
    <div className="flex items-center justify-end gap-3">
      <Label
        htmlFor="region"
        className="text-mainColor dark:text-white md:text-base"
      >
        지역 선택
      </Label>
      <Select value={selectedRegion} onValueChange={setSelectedRegion}>
        <SelectTrigger id="region" className="w-[180px]">
          <SelectValue placeholder="지역 선택 " />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-subColor">
          {regions.map((region) => (
            <SelectItem
              className="z-10 bg-white dark:bg-subColor"
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
