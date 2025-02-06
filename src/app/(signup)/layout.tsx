import { Metadata } from "next";
import { ReactNode } from "react";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "회원가입 - WATTSUP",
  description: "WattsUp에 가입하고 에너지 거래 및 분석 서비스를 이용해 보세요.",
  metadataBase: new URL(baseUrl),
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: `${baseUrl}/signup`,
    siteName: "WattsUp Energy Dashboard",
    title: "회원가입 - WATTSUP",
    description:
      "WattsUp에 가입하고 에너지 거래 및 분석 서비스를 이용해 보세요.",
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

function SignupLayout({ children }: { children: ReactNode }) {
  return <main className="mx-auto my-20 w-[480px]">{children}</main>;
}

export default SignupLayout;
