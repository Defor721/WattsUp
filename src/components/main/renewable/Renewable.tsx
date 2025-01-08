"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Zap,
  Battery,
  BarChart2,
  TrendingUp,
  Shield,
  Leaf,
  Sun,
} from "lucide-react";
import Image from "next/image";

const EnergyInfoPage = () => {
  return (
    <div className="min-h-screen">
      {/* 한전거래소 전력시장 운영 섹션 */}
      <section className="relative flex min-h-screen flex-col lg:flex-row">
        {/* 왼쪽 섹션: 텍스트 콘텐츠 */}
        <div className="flex items-center bg-white p-6 dark:bg-subColor lg:w-1/2 lg:p-12">
          <div className="mx-auto max-w-xl lg:mx-0">
            {/* 메인 제목 애니메이션 */}
            <motion.h1
              className="mb-6 text-4xl font-bold lg:text-6xl"
              initial={{ opacity: 0, y: 20 }} // 초기 상태: 불투명하고 아래로 이동
              animate={{ opacity: 1, y: 0 }} // 애니메이션 이후 상태: 불투명도가 1로 증가하고 제자리로 이동
              transition={{ duration: 0.8 }} // 애니메이션 지속 시간
            >
              전력 거래소와
              <br />
              <span className="text-blue-600">신재생 에너지</span>
            </motion.h1>

            {/* 설명 텍스트 애니메이션 */}
            <motion.p
              className="mb-8 text-lg text-gray-600 dark:text-gray-300 lg:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              지속 가능한 미래를 위한 혁신적인 에너지 솔루션
            </motion.p>
          </div>
        </div>

        {/* 오른쪽 섹션: 이미지 및 정보 카드 */}
        <div className="relative overflow-hidden bg-blue-600 lg:w-1/2">
          {/* 배경 이미지 및 그래디언트 애니메이션 */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Image
              src="/assets/images/map.png"
              alt="Renewable Energy Visualization"
              fill
              className="object-cover opacity-50 mix-blend-overlay"
            />
          </motion.div>

          <div className="relative flex h-full items-center p-6 lg:p-12">
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-8">
              {[
                {
                  icon: Zap,
                  title: "전력 거래소",
                  description:
                    "전기 생산자와 소비자 간의 효율적인 전력 거래를 중개하는 기관으로, 전력 시장의 안정성과 투명성을 확보합니다.",
                },
                {
                  icon: Sun,
                  title: "신재생 에너지",
                  description:
                    "태양광, 풍력, 수력 등 환경 친화적이고 지속 가능한 에너지원으로, 기후 변화 대응과 에너지 안보 강화에 기여합니다.",
                },
                {
                  icon: Battery,
                  title: "에너지 저장",
                  description:
                    "배터리 기술의 발전으로 신재생 에너지의 간헐성 문제를 해결하고, 전력 그리드의 안정성을 높입니다.",
                },
                {
                  icon: Leaf,
                  title: "탄소 중립",
                  description:
                    "신재생 에너지 확대와 효율적인 전력 거래를 통해 2050년 탄소 중립 목표 달성을 위해 노력합니다.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="rounded-2xl bg-white/10 p-4 text-white backdrop-blur-md lg:p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 * index }}
                >
                  <item.icon className="mb-4 h-8 w-8" />
                  <h3 className="mb-2 text-lg font-semibold lg:text-xl">
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/80 lg:text-base">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EnergyInfoPage;
