import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table";
import { formatNumber } from "@/components/energytrade/mock/helpers";
import { PowerSupplyData } from "@/components/energytrade/mock/types";

interface DataTableProps {
  data: PowerSupplyData[];
}

export function DataTable({ data }: DataTableProps) {
  return (
    <div className="mb-8">
      <Card>
        <CardHeader>
          <CardTitle>시간대별 전력수급 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="text-lg">
                  <TableHead className="w-[200px]">시간</TableHead>
                  <TableHead>공급(MW)</TableHead>
                  <TableHead>수요(MW)</TableHead>
                  <TableHead>예비력(MW)</TableHead>
                  <TableHead className="w-[220px]">예비율(%)</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>
          <div className="max-h-[350px] overflow-y-auto">
            <Table>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="w-[200px]">{item.time}</TableCell>
                    <TableCell>{formatNumber(item.supply)}</TableCell>
                    <TableCell>{formatNumber(item.demand)}</TableCell>
                    <TableCell>{formatNumber(item.reserve)}</TableCell>
                    <TableCell className="w-[200px]">
                      {item.reserveRate.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
