"use client";

import { Button, Separator } from "@/components/shadcn";
import Info from "@/components/my-page/Info";
import Stats from "@/components/my-page/Stats";
import RecentLog from "@/components/my-page/RecentLog";
import useFetchUserTradeData from "@/components/my-page/useFetchUserData";
import { useRouter } from "next/navigation";

export default function Mypage() {
  const { data, loading } = useFetchUserTradeData();
  const router = useRouter();

  const handleTradeClick = () => {
    router.push("/energy-trade");
  };

  return (
    <div className="mx-auto flex max-w-[1024px] flex-col items-center gap-3 p-5 xl:p-10">
      <h2 className="pointer-events-none select-none scroll-m-20 pt-5 text-3xl font-semibold tracking-tight text-mainColor first:mt-0 dark:text-white">
        마이 페이지
      </h2>

      <Info />

      <Separator className="my-5 bg-gray-200" />

      {data && (
        <div className="flex w-full flex-col gap-3">
          <Stats stats={data.stats} loading={loading} />

          <Separator className="my-5 bg-gray-200" />

          <RecentLog bidDatas={data.bidData} loading={loading} />
        </div>
      )}

      {!data && (
        <div className="flex flex-col gap-3">
          <div>최근 거래 내역이 없습니다.</div>
          <Button
            className="bg-mainColor text-white dark:bg-white dark:text-black"
            onClick={handleTradeClick}
          >
            거래하러 가기
          </Button>
        </div>
      )}
    </div>
  );
}
