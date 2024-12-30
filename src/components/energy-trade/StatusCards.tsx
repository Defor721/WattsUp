import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import { PowerSupplyData } from "@/components/energy-trade/mock/types";

interface StatusCardsProps {
  currentSupply: PowerSupplyData;
}

export const StatusCards: React.FC<StatusCardsProps> = ({ currentSupply }) => {
  const reserveRate =
    ((currentSupply.supply - currentSupply.demand) / currentSupply.demand) *
    100;

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">현재 수요</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {currentSupply.demand.toLocaleString()} MW
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">현재 공급</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {currentSupply.supply.toLocaleString()} MW
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">현재 예비력</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {(currentSupply.supply - currentSupply.demand).toLocaleString()} MW
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">현재 예비율</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{reserveRate.toFixed(2)}%</div>
        </CardContent>
      </Card>
    </>
  );
};
