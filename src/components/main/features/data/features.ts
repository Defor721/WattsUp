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
