import { Zap, Code, Lightbulb, Users, Rocket } from "lucide-react";
import type { Info } from "@/components/main/web/types/info";

export const teamInfo: Info[] = [
  {
    title: "WattsUp 팀",
    description: "혁신적인 전력 거래 플랫폼 개발",
    icon: (
      <Zap className="h-6 w-6 transition-colors group-hover:text-yellow-300" />
    ),
  },
  {
    title: "프론트엔드 전문가",
    description: "최신 웹 기술로 효율적인 UI 구현",
    icon: (
      <Code className="h-6 w-6 transition-colors group-hover:text-yellow-300" />
    ),
  },
  {
    title: "혁신적인 아이디어",
    description: "빅데이터와 AI로 미래 솔루션 제시",
    icon: (
      <Lightbulb className="h-6 w-6 transition-colors group-hover:text-yellow-300" />
    ),
  },
  {
    title: "협업의 힘",
    description: "다양한 기술로 시너지 창출",
    icon: (
      <Users className="h-6 w-6 transition-colors group-hover:text-yellow-300" />
    ),
  },
  {
    title: "미래를 향한 도전",
    description: "지속 가능한 에너지 거래 선도",
    icon: (
      <Rocket className="h-6 w-6 transition-colors group-hover:text-yellow-300" />
    ),
  },
];
