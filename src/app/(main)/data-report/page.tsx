import React from "react";

import DataReport from "@/components/data-report/DataReport";
import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "AI 데이터 분석 챗봇 - WATTSUP",
  description: "WattsUp에서 에너지 거래 및 분석을 시작하세요.",
  metadataBase: new URL(baseUrl),
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: `${baseUrl}/data-report`,
    siteName: "WattsUp Energy Dashboard",
    title: "AI 데이터 분석 챗봇 - WATTSUP",
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

function Page() {
  return <DataReport />;
}

export default Page;
