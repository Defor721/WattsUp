import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import TradingStats from "@/components/energy-trade/TradingStats";
import BidForm from "@/components/energy-trade/BidForm";
import SupplyChart from "@/components/energy-trade/SupplyChart";

export default function TradePage() {
  return (
    <div className="p-12">
      <h1 className="mb-8 text-center text-4xl font-bold">
        태양광 전력 거래소
      </h1>
      <div className="container mx-auto flex w-full p-8">
        <div className="flex w-1/2 flex-col">
          <TradingStats />
          <SupplyChart />
        </div>
        <div className="flex w-1/2 flex-col p-8">
          {/* 입찰하기 */}
          <BidForm />
        </div>
      </div>
    </div>
  );
}
