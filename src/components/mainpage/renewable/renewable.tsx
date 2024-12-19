"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Sun,
  Wind,
  Zap,
  BarChart2,
  Droplet,
  ArrowRight,
  Battery,
  Leaf,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import Image from "next/image";

const EnergyInfoPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative flex min-h-screen flex-col lg:flex-row">
        {/* Left Section */}
        <div className="flex items-center bg-white p-6 lg:w-1/2 lg:p-12">
          <div className="mx-auto max-w-xl lg:mx-0">
            <motion.h1
              className="mb-6 text-4xl font-bold lg:text-6xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              전력 거래소와
              <br />
              <span className="text-blue-600">신재생 에너지</span>
            </motion.h1>
            <motion.p
              className="mb-8 text-lg text-gray-600 lg:text-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              지속 가능한 미래를 위한 혁신적인 에너지 솔루션
            </motion.p>
          </div>
        </div>

        {/* Right Section */}
        <div className="relative overflow-hidden bg-blue-600 lg:w-1/2">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <Image
              src="/assets/images/지도.jpg"
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

      {/* Content Sections */}
      <section className="bg-gray-50 px-6 py-16 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 lg:text-4xl">
                전력 거래소
              </h2>
              <p className="text-base text-gray-600 lg:text-lg">
                전력 거래소는 전기 생산자와 소비자 사이의 전력 거래를 중개하는
                기관입니다.
              </p>
              <h3 className="text-xl font-semibold"> | 주요 역할</h3>
              <ul className="space-y-4">
                {[
                  "전력 시장 운영: 실시간 수요와 공급을 바탕으로 전력 거래 중개",
                  "전력 수급 계획 수립: 장단기 전력 수요 예측 및 공급 계획 수립",
                  "전력 가격 결정: 시장 원리에 따른 공정한 전력 가격 결정",
                  "전력 시장의 투명성과 효율성 증진: 공정한 거래 환경 조성",
                  "신재생 에너지 통합: 변동성 높은 신재생 에너지의 계통 연계 지원",
                  "전력 계통 안정성 유지: 수요와 공급의 실시간 균형 유지",
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center space-x-3 text-gray-700"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <ArrowRight className="h-5 w-5 flex-shrink-0 text-blue-600" />
                    <span className="text-sm lg:text-base">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-gray-900 lg:text-4xl">
                신재생 에너지
              </h2>
              <p className="text-base text-gray-600 lg:text-lg">
                신재생 에너지는 화석 연료를 대체하는 친환경적이고 지속 가능한
                에너지원입니다.
              </p>
              <h3 className="text-xl font-semibold"> | 주요 종류와 특징</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6">
                {[
                  {
                    icon: Sun,
                    label: "태양광",
                    color: "text-yellow-500",
                    desc: "태양 에너지를 직접 전기로 변환",
                  },
                  {
                    icon: Wind,
                    label: "풍력",
                    color: "text-blue-500",
                    desc: "바람의 운동 에너지를 전기로 변환",
                  },
                  {
                    icon: Droplet,
                    label: "수력",
                    color: "text-blue-400",
                    desc: "물의 유동 에너지를 전기로 변환",
                  },
                  {
                    icon: BarChart2,
                    label: "지열",
                    color: "text-red-500",
                    desc: "지구 내부의 열에너지를 이용",
                  },
                  {
                    icon: TrendingUp,
                    label: "바이오매스",
                    color: "text-green-500",
                    desc: "유기물을 연료로 활용",
                  },
                  {
                    icon: DollarSign,
                    label: "경제성",
                    color: "text-purple-500",
                    desc: "지속적인 비용 감소 추세",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex flex-col items-start space-y-2 rounded-xl bg-white p-4 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className={`h-6 w-6 ${item.color}`} />
                      <span className="font-medium text-gray-700">
                        {item.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EnergyInfoPage;
