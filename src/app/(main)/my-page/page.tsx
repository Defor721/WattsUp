"use client";

import { Button, Separator } from "@/components/shadcn";
import Info from "@/components/my-page/Info";
import Stats from "@/components/my-page/Stats";
import RecentLog from "@/components/my-page/RecentLog";
import useFetchUserTradeData from "@/hooks/useFetchUserData";
import { useRouter } from "next/navigation";

// TODO: Metadata는 "use client" 해결 후 사용할 것
// const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

// export const metadata: Metadata = {
//   title: "마이페이지 - WATTSUP",
//   description:
//     "WattsUp에서 에너지 거래 및 분석을 시작하세요.",
//   metadataBase: new URL(baseUrl),
//   openGraph: {
//     type: "website",
//     locale: "ko_KR",
//     url: `${baseUrl}/my-page`,
//     siteName: "WattsUp Energy Dashboard",
//     title: "마이페이지 - WATTSUP",
//     description:
//     "WattsUp에서 에너지 거래 및 분석을 시작하세요.",
//     images: [
//       {
//         url: "/assets/images/logo.webp",
//         width: 1200,
//         height: 630,
//         alt: "WattsUp 로고",
//       },
//     ],
//   },
// };

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
