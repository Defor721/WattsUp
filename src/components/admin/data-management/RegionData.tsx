"use client";

import React from "react";

import { Button, Card } from "@/components/shadcn";
import apiClient from "@/lib/axios";

import { toast } from "@/hooks/useToast";

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
    setIsButtonDisabled(true);
    try {
      const { data } = await apiClient.post(
        "/api/admin/userinfo/updatesupply",
        firstData,
      );

      const today = new Date().toISOString().split("T")[0];
      localStorage.setItem("lastClickedDate", today);

      toast({
        title: "데이터 전송 성공",
        description: "데이터 전송이 성공적으로 제출되었습니다.",
        variant: "success",
      });
    } catch (error) {
      setIsButtonDisabled(false);
      console.error("Error sending first data:", error);
      toast({
        title: "데이터 전송 실패",
        description: "데이터 전송 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
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
              className="border-none bg-cardBackground-light p-5 dark:border-none dark:bg-cardBackground-dark"
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
