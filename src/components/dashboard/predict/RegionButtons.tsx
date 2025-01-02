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
    // <div className="flex flex-wrap gap-2">
    //   {regions.map((region) => (
    //     <Button
    //       key={region}
    //       variant={"outline"}
    //       className={`${
    //         selectedRegion === region
    //           ? "bg-[#070f26] text-white dark:bg-gray-50 dark:text-black" // 현재 선택된 도시
    //           : "bg-gray-50 dark:bg-[#070f26] dark:text-white" // 현재 선택되지 않은 도시시
    //       }`}
    //       onClick={() => setSelectedRegion(region)}
    //     >
    //       {region}
    //     </Button>
    //   ))}
    // </div>
  );
}

export default RegionButtons;
