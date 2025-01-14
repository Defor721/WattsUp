import React from "react";
import { CircleCheck } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ScrollArea,
} from "@/components/shadcn";
import { formatNumberWithoutDecimal } from "@/hooks/useNumberFormatter";
import Loading from "@/app/loading";

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

interface BidData {
  email: string;
  now: string;
  price: number;
  quantity: number;
  region: string;
}

interface RecentLogProps {
  bidDatas: BidData[];
  loading: boolean;
}

function RecentLog({ bidDatas, loading }: RecentLogProps) {
  if (loading) return <Loading />;

  return (
    <div className="flex flex-col">
      <CardHeader>
        <CardTitle>최근 거래 내역</CardTitle>
      </CardHeader>
      <CardContent className="h-[280px]">
        <ScrollArea className="h-full">
          <Card className="border-none bg-cardBackground-light p-cardPadding dark:border-none dark:bg-cardBackground-dark">
            <ul className="flex flex-col gap-3">
              {bidDatas
                .sort(
                  (a, b) =>
                    new Date(b.now).getTime() - new Date(a.now).getTime(),
                )
                .map((bid, index) => (
                  <div
                    key={index}
                    className="flex w-full flex-col justify-between md:flex-row md:items-center"
                  >
                    <div className="flex flex-col">
                      <div>{`${bid.region} 발전소 ${formatNumberWithoutDecimal(bid.quantity)} kWh`}</div>
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
    </div>
  );
}

export default RecentLog;
