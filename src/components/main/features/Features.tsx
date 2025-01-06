"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building, Globe, Heart } from "lucide-react";
import { motion } from "framer-motion";

function FeaturesPart() {
  return (
    <div className="flex h-screen min-h-screen flex-col bg-[#F5F5F5]">
      {/* Hero Section */}
      <div className="relative flex h-[50vh] flex-col items-center justify-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="z-10"
        >
          <Image
            src="/assets/images/earth.jpg"
            alt="Earth Icon"
            width={120}
            height={120}
            className="mx-auto mb-8"
          />
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            UNLEASH YOUR ENERGY
          </h1>
          <p className="text-xl text-gray-700">
            터빈크루와 함께 에너지의 미래를 열어가세요
          </p>
        </motion.div>
      </div>

      {/* Cards Section */}
      <div className="bg-[#F5F5F5]0 flex">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
            {[
              {
                title: "Turbincrew",
                description:
                  "터빈크루는 인공지능(AI)과 사물인터넷(IoT) 기술을 활용하여 스마트 그린 에너지 솔루션을 제공하는 기업입니다. 2021년 9월에 설립되어 신재생에너지 분야에서 혁신적인 기술 개발에 주력하고 있습니다.",
                image: "/assets/images/turbincrew.jpeg",
                link: "https://turbincrew.com",
              },
              {
                title: "전력거래소(KPX, Korea Power Exchange)",
                description:
                  "전력거래소(KPX)는 대한민국의 전력 시장 운영기관이자 전력 시스템 운영자입니다. 전력의 안정적인 공급과 수요 관리를 책임지며, 발전사와 소비자(전력회사) 간 전력 거래를 공정하고 효율적으로 관리합니다.",
                image: "/assets/images/kpx.jpg",
                link: "https://www.kpx.or.kr/menu.es?mid=a10301010000",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="group overflow-hidden rounded-lg bg-white shadow-lg transition-shadow duration-300 hover:shadow-2xl"
              >
                <Link
                  href={feature.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block h-64 overflow-hidden"
                >
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    style={{ objectFit: "cover" }}
                    className="transform transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="flex items-center text-lg font-semibold text-white">
                      자세히 보기 <ArrowRight className="ml-2" />
                    </span>
                  </div>
                </Link>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-700">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturesPart;
