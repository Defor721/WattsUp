"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// 카드 데이터 배열
const features = [
  {
    title: "Turbincrew",
    description:
      "터빈크루는 AI와 IoT 기술을 활용하여 스마트 그린 에너지 솔루션을 제공하는 기업입니다.",
    image: "/assets/images/turbincrew.jpeg",
    link: "https://turbinecrew.co.kr",
  },
  {
    title: "전력거래소(KPX)",
    description:
      "전력거래소는 대한민국의 전력 시장 운영기관으로 전력 공급을 책임집니다.",
    image: "/assets/images/kpx.jpg",
    link: "https://www.kpx.or.kr/menu.es?mid=a10301010000",
  },
];

// FeaturesPart 컴포넌트 정의
function FeaturesPart() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-subColor">
      {/* 상단 Hero 섹션 */}
      <motion.div
        initial={{ opacity: 0, y: 50 }} // 초기 상태
        animate={{ opacity: 1, y: 0 }} // 애니메이션 상태
        transition={{ duration: 0.8 }} // 애니메이션 지속 시간
        className="relative flex h-[50vh] flex-col items-center justify-center text-center"
      >
        <Image
          src="/assets/images/earth.jpg"
          alt="Earth Icon"
          width={120}
          height={120}
          className="mx-auto mb-8"
        />
        <h1 className="mb-4 text-4xl font-bold">UNLEASH YOUR ENERGY</h1>
        <p className="text-xl">터빈크루와 함께 에너지의 미래를 열어가세요</p>
      </motion.div>

      {/* 카드 섹션 */}
      <div className="flex flex-col items-center bg-gray-100 py-12 dark:bg-subColor">
        <div className="grid max-w-7xl grid-cols-1 gap-8 px-4 md:grid-cols-2 lg:px-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }} // 초기 상태
              whileInView={{ opacity: 1, y: 0 }} // 뷰포트에 나타날 때 애니메이션 실행
              transition={{ duration: 0.8, delay: index * 0.2 }} // 애니메이션 지연
              viewport={{ once: true }} // 한 번만 실행
              className="group overflow-hidden rounded-lg bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl dark:bg-gray-800"
            >
              <Link
                href={feature.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="relative h-64">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    style={{ objectFit: "cover" }}
                    className="transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="flex items-center text-lg font-semibold text-white">
                      자세히 보기 <ArrowRight className="ml-2" />
                    </span>
                  </div>
                </div>
              </Link>
              <div className="p-6">
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FeaturesPart;
