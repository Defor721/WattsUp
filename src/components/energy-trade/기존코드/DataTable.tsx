"use client"; // 이 컴포넌트가 클라이언트 사이드에서 실행됨을 나타냄

import { useState } from "react";

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
import { formatNumber } from "@/components/energy-trade/mock/helpers";
import { PowerSupplyData } from "@/components/energy-trade/mock/types";

// DataTable 컴포넌트의 props 타입 정의
interface DataTableProps {
  data: PowerSupplyData[]; // PowerSupplyData 배열을 받음
}

export function DataTable({ data }: DataTableProps) {
  // 정렬 설정을 위한 상태. 초기값은 supply를 기준으로 오름차순 정렬
  const [sortConfig, setSortConfig] = useState<{
    key: keyof PowerSupplyData;
    direction: "asc" | "desc";
  }>({ key: "supply", direction: "asc" });

  // 정렬 처리 함수. 같은 키를 다시 클릭하면 정렬 방향을 전환
  const handleSort = (key: keyof PowerSupplyData) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  // 정렬을 초기 상태로 리셋하는 함수 ( 제목 누르면 처음 화면으로 돌아오게 설정했어용 )
  const resetSort = () => {
    setSortConfig({ key: "supply", direction: "asc" });
    // key 값은 현재 어떤 속성을 기준으로 정렬할지를 지정 : 공급량(supply)을 기준으로 정렬
  };

  // 현재 정렬 설정에 따라 데이터를 정렬
  const sortedData =
    sortConfig.key === "supply" && sortConfig.direction === "asc"
      ? data // 초기 상태일 경우 원본 데이터 그대로 사용
      : [...data].sort((a, b) => {
          if (sortConfig.direction === "asc")
            return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
          return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
        });

  // 정렬 버튼 렌더링 함수
  const renderSortButton = (key: keyof PowerSupplyData) => (
    <button
      className={`ml-2 rounded px-2 py-1 text-sm ${
        sortConfig.key === key
          ? sortConfig.direction === "asc"
            ? "bg-pink-500 text-white"
            : "bg-blue-500 text-white"
          : "bg-gray-200 text-gray-800"
      }`}
      onClick={() => handleSort(key)}
    >
      {sortConfig.key === key
        ? sortConfig.direction === "asc"
          ? "▲"
          : "▼"
        : "▲"}
    </button>
  );

  // 컴포넌트 렌더링
  return (
    <div className="mb-8">
      <Card>
        <CardHeader className="flex">
          <div className="flex justify-between">
            <CardTitle className="cursor-pointer" onClick={resetSort}>
              시간대별 전력수급 현황
            </CardTitle>
            <div>
              <span className="m-1 bg-pink-500 p-2 text-white">
                ▲ : 오름차순
              </span>
              <span className="m-1 bg-blue-500 p-2 text-white">
                ▼ : 내림차순
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* 테이블 헤더 부분 */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="text-lg">
                  <TableHead className="w-[200px]">시간</TableHead>
                  <TableHead>
                    공급(MW)
                    {renderSortButton("supply")}
                  </TableHead>
                  <TableHead>
                    수요(MW)
                    {renderSortButton("demand")}
                  </TableHead>
                  <TableHead>
                    예비력(MW)
                    {renderSortButton("reserve")}
                  </TableHead>
                  <TableHead>
                    예비율(%)
                    {renderSortButton("reserveRate")}
                  </TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>
          {/* 테이블 본문 부분. 스크롤 가능한 영역 */}
          <div className="h-full overflow-y-auto">
            <Table>
              <TableBody>
                {sortedData.map((item, index) => (
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
