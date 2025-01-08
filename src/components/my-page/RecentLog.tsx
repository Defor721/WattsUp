import React from "react";
import { CircleCheck } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ScrollArea,
} from "@/components/shadcn";
import Loading from "@/app/loading";

import useFetchUserTradeData from "./useFetchUserData";

function formatTimeDifference(now: string): string {
  const currentTime = new Date(); // 현재 시간
  const eventTime = new Date(now); // 거래 시간
  const timeDiff = currentTime.getTime() - eventTime.getTime(); // 밀리초 차이

  const diffInMinutes = Math.floor(timeDiff / (1000 * 60)); // 분 단위로 변환
  const diffInHours = Math.floor(diffInMinutes / 60); // 시간 단위로 변환
  const diffInDays = Math.floor(diffInHours / 24); // 일 단위로 변환

  if (diffInDays >= 2) {
    return `${diffInDays}일 전`;
  } else if (diffInDays === 1) {
    return `하루 전`;
  } else if (diffInHours >= 1) {
    return `${diffInHours}시간 전`;
  } else if (diffInMinutes >= 1) {
    return `${diffInMinutes}분 전`;
  } else {
    return `방금 전`;
  }
}

function RecentLog() {
  const { data, loading } = useFetchUserTradeData();

  if (!data || loading) return <Loading />;

  const bidDatas = data.bidData;
  console.log("bidDatas: ", bidDatas);

  return (
    <Card className="flex flex-col border-0 shadow-none">
      <CardHeader>
        <CardTitle>최근 활동</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[250px]">
          <Card className="p-5">
            <ul className="flex flex-col gap-3">
              {bidDatas
                .sort(
                  (a, b) =>
                    new Date(b.now).getTime() - new Date(a.now).getTime(),
                )
                .map((bid, index) => (
                  <div
                    key={index}
                    className="flex w-full items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <div>{`${bid.region} 발전소 ${bid.quantity} kMh`}</div>
                      <div>{formatTimeDifference(bid.now)}</div>
                    </div>
                    <div className="flex gap-2 rounded-md bg-green-400 p-2 text-green-700">
                      <CircleCheck />
                      <div>approve</div>
                    </div>
                  </div>
                ))}
            </ul>
          </Card>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default RecentLog;
