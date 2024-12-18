/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import React from "react";
import { motion, useInView } from "framer-motion";
import { Zap, Code, Lightbulb, Users, Rocket } from "lucide-react";

const teamInfo = [
  {
    icon: <Zap size={100} />,
    title: "WattsUp 팀",
    description:
      "터빈크루 기업연계 9팀, 혁신적인 전력 거래 플랫폼을 개발하는 열정적인 5인 프론트엔드 팀입니다. 우리는 지속 가능한 에너지 미래를 위해 노력하며, 사용자 중심의 직관적인 인터페이스로 전력 거래의 새로운 패러다임을 제시합니다. 다양한 배경을 가진 팀원들의 협업을 통해 혁신적인 솔루션을 만들어갑니다.",
  },
  {
    icon: <Code size={100} />,
    title: "프론트엔드 전문가",
    description:
      "최신 웹 기술을 활용하여 사용자 친화적이고 효율적인 인터페이스를 구현합니다. React, Next.js, TypeScript 등 현대적인 프레임워크와 라이브러리를 능숙하게 다루며, 반응형 디자인과 접근성을 고려한 개발을 지향합니다. 지속적인 학습과 기술 향상을 통해 최적화된 사용자 경험을 제공하는 것이 우리의 목표입니다.",
  },
  {
    icon: <Lightbulb size={100} />,
    title: "혁신적인 아이디어",
    description:
      "전력 거래의 미래를 그려나가는 창의적인 솔루션을 제시합니다. 빅데이터와 AI 기술을 활용한 예측 모델, 블록체인 기반의 안전한 거래 시스템, 실시간 모니터링 대시보드 등 혁신적인 아이디어를 실현합니다. 우리는 항상 사용자의 니즈를 파악하고, 이를 바탕으로 한 발 앞선 솔루션을 개발하는 데 주력합니다.",
  },
  {
    icon: <Users size={100} />,
    title: "협업의 힘",
    description:
      "다양한 배경과 기술을 가진 5명의 팀원이 시너지를 발휘하여 최고의 결과물을 만들어냅니다. 각자의 전문성을 살리면서도 열린 마인드로 소통하며, 서로의 아이디어를 존중하고 발전시킵니다. 애자일 방법론을 적용한 효율적인 프로젝트 관리와 코드 리뷰를 통한 품질 향상으로 탁월한 팀워크를 자랑합니다.",
  },
  {
    icon: <Rocket size={100} />,
    title: "미래를 향한 도전",
    description:
      "지속 가능한 에너지 관리와 스마트한 전력 거래의 미래를 선도합니다. 신재생 에너지 통합, IoT 기기와의 연동, 스마트 그리드 최적화 등 미래 지향적인 기술을 탐구하고 적용합니다. 우리의 목표는 단순한 플랫폼 개발을 넘어, 에너지 산업의 디지털 혁신을 주도하고 더 나은 미래를 만드는 것입니다.",
  },
];

const TeamIntroduction = () => {
  return (
    <section className="bg-gradient-to-b from-white to-gray-100 py-40">
      <div className="container mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-24 text-center text-5xl font-bold text-[rgb(7,15,38)]"
        >
          WattsUp 팀 소개
        </motion.h1>

        {teamInfo.map((info, index) => {
          const ref = React.useRef(null);
          const isInView = useInView(ref, { once: true, amount: 0.3 });

          return (
            <motion.div
              key={index}
              ref={ref}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`m-32 grid grid-cols-1 items-center gap-2 p-4 md:grid-cols-2 ${
                index % 2 === 0 ? "md:text-left" : "md:text-right"
              }`}
            >
              <div className={index % 2 === 0 ? "md:order-1" : "md:order-2"}>
                <div className="mx-auto flex h-24 w-24 items-center justify-center text-[rgb(7,15,38)]">
                  {info.icon}
                </div>
              </div>
              <div className={index % 2 === 0 ? "md:order-2" : "md:order-1"}>
                <h2 className="mb-4 text-3xl font-semibold text-[rgb(7,15,38)]">
                  {info.title}
                </h2>
                <p className="text-lg leading-relaxed text-gray-600">
                  {info.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default TeamIntroduction;
