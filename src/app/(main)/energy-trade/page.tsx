import Main from "@/components/energy-trade/Main";
import Title from "@/components/ui/Title";
import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "전력거래 - WATTSUP",
  description: "WattsUp에서 에너지 거래 및 분석을 시작하세요.",
  metadataBase: new URL(baseUrl),
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: `${baseUrl}/energy-trade`,
    siteName: "WattsUp Energy Dashboard",
    title: "전력거래 - WATTSUP",
    description: "WattsUp에서 에너지 거래 및 분석을 시작하세요.",
    images: [
      {
        url: "/assets/images/logo.webp",
        width: 1200,
        height: 630,
        alt: "WattsUp 로고",
      },
    ],
  },
};

export default function TradePage() {
  return (
    <div className="mx-auto flex max-w-[1920px] flex-col p-5 xl:p-10">
      <Title title="태양광 전력 거래소" className="md:mb-5" />
      <Main />
    </div>
  );
}
