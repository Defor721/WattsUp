import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

function FeaturesPart() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 transition-all sm:px-4 lg:px-8">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {[
          {
            title: "Turbincrew",
            description:
              "터빈크루는 인공지능(AI)과 사물인터넷(IoT) 기술을 활용하여 스마트 그린 에너지 솔루션을 제공하는 기업입니다. 2021년 9월에 설립되어 신재생에너지 분야에서 혁신적인 기술 개발에 주력하고 있습니다.",
            image: "/assets/images/th.jpg",
            link: "https://turbincrew.com",
          },
          {
            title: "전력거래소(KPX, Korea Power Exchange)",
            description:
              "전력거래소(KPX)는 대한민국의 전력 시장 운영기관이자 전력 시스템 운영자입니다. 전력의 안정적인 공급과 수요 관리를 책임지며, 발전사와 소비자(전력회사) 간 전력 거래를 공정하고 효율적으로 관리합니다.",
            image: "/assets/images/kpx.jpeg",
            link: "https://www.kpx.or.kr",
          },
        ].map((feature, index) => (
          <div key={index} className="rounded-lg bg-white p-6 shadow-md">
            <Link href={feature.link} target="_blank" rel="noopener noreferrer">
              <div className="group relative mb-4 h-40 w-40 cursor-pointer overflow-hidden rounded-full">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-all group-hover:scale-110"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all group-hover:bg-opacity-50">
                  <div className="text-white opacity-0 transition-all group-hover:opacity-100">
                    <span className="mr-2 text-xl">보러가기</span>
                    <ArrowRight className="inline-block" size={20} />
                  </div>
                </div>
              </div>
            </Link>
            <h3 className="mb-3 text-xl font-semibold text-gray-900">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeaturesPart;
