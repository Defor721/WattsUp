"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Building2,
  GlobeIcon,
  BarChart3,
  ArrowLeftRight,
  Zap,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

const PowerExchangePage = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="relative mb-12 overflow-visible">
        <div className="container mx-auto px-4">
          <div className="relative">
            <Image
              src="/assets/images/지도.jpg"
              alt="Earth from space"
              width={600}
              height={800}
              className="mx-auto"
            />
            <div className="absolute inset-0 flex items-end justify-start p-8">
              <motion.div
                className="max-w-2xl space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <motion.h1
                  className="text-7xl font-bold leading-tight text-white md:text-[8.5rem]"
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
                >
                  전력 거래소
                  <span className="mt-2 block text-[5rem] md:text-[5rem]">
                    Power Exchange
                  </span>
                </motion.h1>
                <motion.p
                  className="max-w-[100%] text-xl text-white md:text-3xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
                >
                  전기 생산자와 소비자 간의 효율적인 전력 거래를 중개하는
                  혁신적인 플랫폼
                </motion.p>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-20 px-8 py-12">
        <motion.div
          className="mb-20"
          variants={staggerChildren}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={fadeInUp}>
            <h2 className="mb-4 flex items-center text-3xl font-bold text-[rgb(7,15,38)]">
              <Building2 className="mr-2 h-8 w-8" />
              전력 거래소란?
            </h2>
            <p className="text-black">
              전력 거래소는 전기 생산자와 소비자 간의 전력 거래를 중개하는
              기관입니다. 주요 역할은 전력 시장의 운영, 전력 수급 계획 수립,
              그리고 전력 가격 결정 등입니다. 이를 통해 전력 시장의 효율성과
              투명성을 높이고, 안정적인 전력 공급을 보장합니다.
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerChildren}
          initial="initial"
          animate="animate"
          className="mb-20"
        >
          <h2 className="mb-6 flex items-center text-3xl font-bold text-[rgb(7,15,38)]">
            <BarChart3 className="mr-2 h-8 w-8" />
            전력 거래소 이용 방법
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                step: "회원 가입",
                desc: "발전 사업자 또는 전력 소비자로 등록",
              },
              {
                step: "입찰",
                desc: "발전 사업자는 판매 가격을, 소비자는 구매 가격을 제시",
              },
              { step: "거래", desc: "수요와 공급에 따라 전력 거래 가격 결정" },
              { step: "정산", desc: "거래된 전력량에 따라 대금 정산" },
              { step: "모니터링", desc: "실시간 전력 수급 상황 확인" },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="rounded-lg p-6"
              >
                <h3 className="mb-2 text-xl font-semibold text-[rgb(7,15,38)]">
                  {item.step}
                </h3>
                <p className="text-black">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={staggerChildren}
          initial="initial"
          animate="animate"
          className="mb-20"
        >
          <h2 className="mb-6 flex items-center text-3xl font-bold text-[rgb(7,15,38)]">
            <GlobeIcon className="mr-2 h-8 w-8" />
            한국과 다른 나라의 전력 거래소 비교
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                country: "한국 (KPX)",
                features: [
                  "단일 구매자 모델 (한국전력공사가 유일한 구매자)",
                  "정부 주도의 규제 시장",
                  "실시간 시장과 하루 전 시장 운영",
                ],
              },
              {
                country: "미국 (PJM)",
                features: [
                  "다수의 구매자와 판매자가 참여하는 자유 경쟁 시장",
                  "지역별로 다양한 전력 시장 운영",
                  "용량 시장 등 다양한 시장 메커니즘 존재",
                ],
              },
              {
                country: "유럽 (Nord Pool)",
                features: [
                  "국가 간 전력 거래 활성화",
                  "재생에너지 통합을 위한 유연한 시장 구조",
                  "당일 시장(Intraday Market) 활성화",
                ],
              },
              {
                country: "호주 (NEM)",
                features: [
                  "5분 단위의 실시간 가격 결정 시스템",
                  "장기 계약과 현물 시장의 조화",
                  "재생에너지 증가에 따른 시장 규칙 지속 개선",
                ],
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="rounded-lg p-6"
              >
                <h3 className="mb-2 text-xl font-semibold text-[rgb(7,15,38)]">
                  {item.country}
                </h3>
                <ul className="list-inside list-disc text-black">
                  {item.features.map((feature, fIndex) => (
                    <li key={fIndex}>{feature}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="initial"
          animate="animate"
          className="rounded-lg p-8 text-black"
        >
          <h2 className="mb-6 flex items-center text-3xl font-bold">
            <ArrowLeftRight className="mr-2 h-8 w-8" />
            전력 거래소의 미래
          </h2>
          <p className="mb-8">
            전력 거래소는 재생에너지의 증가, 스마트 그리드 기술의 발전, ��리고
            프로슈머(Prosumer) 등장으로 인해 큰 변화를 겪고 있습니다. 미래의
            전력 거래소는 더욱 유연하고 분산화된 시스템으로 발전할 것으로
            예상되며, 인공지능과 블록체인 기술을 활용한 효율적인 전력 거래
            플랫폼으로 진화할 것입니다.
          </p>
          <div className="text-center">
            <motion.a
              href="https://www.kpx.or.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-[rgb(7,15,38)] px-6 py-3 text-white transition-all hover:bg-purple-700"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              한국전력거래소 방문하기
              <ChevronRight className="ml-2 h-5 w-5" />
            </motion.a>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PowerExchangePage;
