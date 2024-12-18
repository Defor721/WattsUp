import React from "react";
import Image from "next/image";

function FeaturesPart() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 transition-all sm:px-4 lg:px-8">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
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
  );
}

export default FeaturesPart;
