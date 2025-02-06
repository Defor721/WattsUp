export interface Feature {
  title: string;
  description: string;
  image: string;
  link: string;
}

export const features: Feature[] = [
  {
    title: "Turbincrew",
    description:
      "터빈크루는 인공지능(AI)과 사물인터넷(IoT) 기술을 활용하여 스마트 그린 에너지 솔루션을 제공하는 기업입니다. 2021년 9월에 설립되어 신재생에너지 분야에서 혁신적인 기술 개발에 주력하고 있습니다.",
    image: "/assets/images/turbincrew.jpeg",
    link: "https://turbinecrew.co.kr",
  },
  {
    title: "전력거래소(KPX)",
    description:
      "전력거래소(KPX)는 대한민국의 전력 시장 운영기관이자 전력 시스템 운영자입니다. 전력의 안정적인 공급과 수요 관리를 책임지며, 발전사와 소비자(전력회사) 간 전력 거래를 공정하고 효율적으로 관리합니다.",
    image: "/assets/images/kpx.jpg",
    link: "https://www.kpx.or.kr/menu.es?mid=a10301010000",
  },
];
