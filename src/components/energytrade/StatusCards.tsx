import { motion } from "framer-motion";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import { formatNumber } from "@/components/energytrade/mock/helpers";
import { PowerSupplyData } from "@/components/energytrade/mock/types";

const MotionCard = motion(Card);

interface StatusCardsProps {
  currentSupply: PowerSupplyData;
}

export function StatusCards({ currentSupply }: StatusCardsProps) {
  const items = [
    { title: "현재 수요", value: currentSupply.demand },
    { title: "현재 공급", value: currentSupply.supply },
    { title: "현재 예비력", value: currentSupply.reserve },
    {
      title: "현재 예비율",
      value: currentSupply.reserveRate,
      isPercentage: true,
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 p-2 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => (
        <MotionCard
          key={item.title}
          initial={{ opacity: 0, y: 90, x: -5 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ duration: 0.9, delay: index * 0.1 }}
          className="bg-white text-[rgb(7,15,38)]"
        >
          <CardHeader>
            <CardTitle className="text-md">{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-2xl font-bold">
              {item.isPercentage
                ? `${item.value.toFixed(2)}%`
                : `${formatNumber(item.value)} MW`}
            </p>
          </CardContent>
        </MotionCard>
      ))}
    </div>
  );
}
