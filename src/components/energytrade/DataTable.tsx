"use client";

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
import { formatNumber } from "@/components/energytrade/mock/helpers";
import { PowerSupplyData } from "@/components/energytrade/mock/types";

interface DataTableProps {
  data: PowerSupplyData[];
}

export function DataTable({ data }: DataTableProps) {
  const [sortKey, setSortKey] = useState<keyof PowerSupplyData>("supply");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  // 정렬 함수: 기준 열과 정렬 방향을 설정
  const handleSort = (
    key: keyof PowerSupplyData,
    direction: "asc" | "desc",
  ) => {
    setSortKey(key); // 기준 열 업데이트
    setOrder(direction); // 정렬 방향 업데이트
  };

  // 정렬된 데이터 생성
  const sortedData = [...data].sort((a, b) => {
    if (order === "asc") return a[sortKey] > b[sortKey] ? 1 : -1;
    return a[sortKey] < b[sortKey] ? 1 : -1;
  });

  return (
    <div className="mb-8">
      <Card>
        <CardHeader className="flex">
          <div className="flex justify-between p-2">
            <CardTitle>시간대별 전력수급 현황</CardTitle>
            <div>
              <span className="m-1 bg-pink-500 p-2 text-white">
                {" "}
                ▲ : 오름차순
              </span>
              <span className="m-1 bg-blue-500 p-2 text-white">
                {" "}
                ▼ : 내림차순
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="text-lg">
                  <TableHead className="w-[200px]">시간</TableHead>

                  {/* 공급 정렬 버튼 */}
                  <TableHead>
                    공급(MW)
                    <button
                      className={`ml-2 rounded px-2 py-1 text-sm ${
                        sortKey === "supply" && order === "asc"
                          ? "bg-pink-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                      onClick={() => handleSort("supply", "asc")}
                    >
                      ▲
                    </button>
                    <button
                      className={`ml-1 rounded px-2 py-1 text-sm ${
                        sortKey === "supply" && order === "desc"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                      onClick={() => handleSort("supply", "desc")}
                    >
                      ▼
                    </button>
                  </TableHead>

                  {/* 수요 정렬 버튼 */}
                  <TableHead>
                    수요(MW)
                    <button
                      className={`ml-2 rounded px-2 py-1 text-sm ${
                        sortKey === "demand" && order === "asc"
                          ? "bg-pink-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                      onClick={() => handleSort("demand", "asc")}
                    >
                      ▲
                    </button>
                    <button
                      className={`ml-1 rounded px-2 py-1 text-sm ${
                        sortKey === "demand" && order === "desc"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                      onClick={() => handleSort("demand", "desc")}
                    >
                      ▼
                    </button>
                  </TableHead>

                  {/* 예비력 정렬 버튼 */}
                  <TableHead>
                    예비력(MW)
                    <button
                      className={`ml-2 rounded px-2 py-1 text-sm ${
                        sortKey === "reserve" && order === "asc"
                          ? "bg-pink-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                      onClick={() => handleSort("reserve", "asc")}
                    >
                      ▲
                    </button>
                    <button
                      className={`ml-1 rounded px-2 py-1 text-sm ${
                        sortKey === "reserve" && order === "desc"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                      onClick={() => handleSort("reserve", "desc")}
                    >
                      ▼
                    </button>
                  </TableHead>

                  {/* 예비율 정렬 버튼 */}
                  <TableHead>
                    예비율(%)
                    <button
                      className={`ml-2 rounded px-2 py-1 text-sm ${
                        sortKey === "reserveRate" && order === "asc"
                          ? "bg-pink-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                      onClick={() => handleSort("reserveRate", "asc")}
                    >
                      ▲
                    </button>
                    <button
                      className={`ml-1 rounded px-2 py-1 text-sm ${
                        sortKey === "reserveRate" && order === "desc"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                      onClick={() => handleSort("reserveRate", "desc")}
                    >
                      ▼
                    </button>
                  </TableHead>
                </TableRow>
              </TableHeader>
            </Table>
          </div>

          {/* 테이블 본문 */}
          <div className="max-h-[350px] overflow-y-auto">
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
