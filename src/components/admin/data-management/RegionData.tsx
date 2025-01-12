"use client";

import React from "react";

import { Button, Card } from "@/components/shadcn";
import apiClient from "@/lib/axios";

interface RegionDataProps {
  firstData: {
    date: string;
    regions: { region: string; amgo: number }[];
  };
}

function RegionData({ firstData }: RegionDataProps) {
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);

  // 버튼 상태 복원
  React.useEffect(() => {
    const savedDate = localStorage.getItem("lastClickedDate");
    const today = new Date().toISOString().split("T")[0];

    if (savedDate === today) {
      setIsButtonDisabled(true);
    } else {
      setIsButtonDisabled(false);
    }
  }, []);

  // 백엔드로 firstData 보내기
  const sendRegionsDataToDB = async () => {
    try {
      const { data } = await apiClient.post(
        "/api/admin/userinfo/updatesupply",
        firstData,
      );
      console.log("First data sent successfully:", data);

      const today = new Date().toISOString().split("T")[0];
      localStorage.setItem("lastClickedDate", today);
      setIsButtonDisabled(true);
    } catch (error) {
      console.error("Error sending first data:", error);
    }
  };

  return (
    <Card className="flex flex-col gap-3 border-none shadow-none dark:shadow-none">
      <div className="flex items-center gap-5">
        <Button
          onClick={sendRegionsDataToDB}
          disabled={isButtonDisabled}
          className={`bg-mainColor text-white dark:bg-white dark:text-mainColor ${
            isButtonDisabled ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          오늘의 지역별 발전량
        </Button>
      </div>

      {/* 지역별 발전량 텍스트로 표시 */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
        {firstData.regions
          .sort((a, b) => a.region.localeCompare(b.region))
          .map((regionData) => (
            <Card
              key={regionData.region}
              className="bg-cardBackground-light p-5 dark:bg-cardBackground-dark"
            >
              <p className="text-xs font-semibold">{regionData.region}</p>
              <p className="text-base font-bold">
                {regionData.amgo.toLocaleString()} kWh
              </p>
            </Card>
          ))}
      </div>
    </Card>
  );
}

export default RegionData;
