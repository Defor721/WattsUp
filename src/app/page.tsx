// "use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const links = [
    { title: "Explore Dashboard", href: "/dashboard" },
    { title: "Electricity Transaction Status", href: "/energytrade" },
    { title: "Smart Trading", href: "/trading" },
    { title: "With Turbin Crew", href: "https://turbinecrew.co.kr/" },
  ];

  return (
    <div className="relative min-h-screen bg-[rgb(7,15,38)] p-2">
      {/* Full-width video header with overlay links */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <video
          src="/assets/videos/istockphoto-1569244272-640_adpp_is.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60" />

        {/* Grid of links */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="mb-8 text-center">
            <span className="bg-gradient-to-r from-teal-200 to-blue-300 bg-clip-text text-[100px] font-bold text-transparent sm:text-[100px]">
              WattsUp
            </span>
          </h1>
          <div className="grid w-full max-w-4xl grid-cols-2 gap-0 px-4 sm:px-0">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="flex items-center justify-between bg-black bg-opacity-50 p-8 text-white transition-all duration-200 hover:scale-105 hover:bg-opacity-80"
              >
                <span className="text-xl font-semibold">{link.title}</span>
                <ArrowRight className="h-6 w-6" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="mx-auto max-w-7xl px-4 py-12 transition-all sm:px-4 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              title: "Turbincrew",
              description:
                "터빈크루는 인공지능(AI)과 사물인터넷(IoT) 기술을 활용하여 스마트 그린 에너지 솔루션을 제공하는 기업입니다. 2021년 9월에 설립되어 신재생에너지 분야에서 혁신적인 기술 개발에 주력하고 있습니다.",
              image: "/assets/images/th.jpg",
            },
            {
              title: "전력거래소(KPX, Korea Power Exchange)",
              description:
                "전력거래소(KPX)는 대한민국의 전력 시장 운영기관이자 전력 시스템 운영자입니다. 전력의 안정적인 공급과 수요 관리를 책임지며, 발전사와 소비자(전력회사) 간 전력 거래를 공정하고 효율적으로 관리합니다.",
              icon: "/assets/images/kpx.png",
            },
            {
              title: "재생에너지란?",
              description:
                "재생에너지(Renewable Energy)는 자연적으로 지속 가능하게 재생되는 에너지 자원을 의미합니다. 태양, 바람, 물, 지열, 생물 연료 등을 포함하며, 탄소 배출이 적어 환경친화적인 에너지원으로 평가받습니다.",
              icon: "/assets/images/재생에너지.jpeg",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="rounded-lg bg-white p-6 shadow-md transition-all hover:scale-105"
            >
              <Image
                src={feature.image || "/assets/images/kpx.png"}
                alt={feature.title}
                width={100}
                height={100}
                className="mb-4"
              />
              <h3 className="mb-3 text-xl font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
