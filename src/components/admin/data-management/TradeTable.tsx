"use client";

import React, { useEffect, useState } from "react";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Input,
  Button,
} from "@/components/shadcn";

import { formatNumberWithoutDecimal } from "@/hooks/useNumberFormatter";
import { useQueryClient } from "@tanstack/react-query";
import { fetchBidLists } from "@/services/adminService";

interface BidData {
  _id: string;
  email: string;
  region: string;
  price: number;
  quantity: number;
  now: string;
}

function TradeTable({ bidLists }: { bidLists: BidData[] }) {
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = 5;

  useEffect(() => {
    if (totalPages && currentPage < totalPages) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery({
        queryKey: ["users", nextPage],
        queryFn: () => fetchBidLists(),
      });
    }
  }, [currentPage, queryClient]);

  // 필터링
  const [searchTerm, setSearchTerm] = useState("");

  // 검색어에 따른 필터링
  const filteredTradeData = bidLists.sort(
    (a, b) => new Date(b.now).getTime() - new Date(a.now).getTime(),
  );
  // .filter((trade) => {
  //   const searchValue = searchTerm.toLowerCase();
  //   return (
  //     trade._id.toLowerCase().includes(searchValue) || // ID 필터
  //     trade.email.includes(searchValue) || // 사업자 번호 필터
  //     trade.region.toLowerCase().includes(searchValue) || // 지역 필터
  //     String(trade.price).includes(searchValue) || // 가격 필터
  //     String(trade.quantity).includes(searchValue) || // 수량 필터
  //     trade.now.toLowerCase().includes(searchValue) // 날짜 필터
  //   );
  // });

  return (
    <div className="m-w-[700px]">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-[#070f26] dark:text-white">
          모든 거래 내역
        </h4>
        <Input
          placeholder="검색창"
          className="max-w-80"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // 검색 시 첫 페이지로 이동
          }}
        />
      </div>
      <div className="overflow-x-auto">
        <Table className="min-w-full border border-gray-700 text-center text-[#070f26] dark:text-white">
          <TableHeader className="bg-tableHeader-light dark:bg-tableHeader-dark">
            <TableRow className="[&>*]:text-center">
              <TableHead className="border border-gray-700 px-3 py-2">
                이메일
              </TableHead>
              <TableHead className="border border-gray-700 px-3 py-2">
                지역
              </TableHead>
              <TableHead className="border border-gray-700 px-3 py-2">
                가격
              </TableHead>
              <TableHead className="border border-gray-700 px-3 py-2">
                수량
              </TableHead>
              <TableHead className="border border-gray-700 px-3 py-2">
                날짜
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTradeData.map((trade) => {
              const formattedDate = new Date(trade.now)
                .toISOString()
                .split("T")[0];
              const formattedPrice = formatNumberWithoutDecimal(trade.price);
              const formattedQuantity = formatNumberWithoutDecimal(
                trade.quantity,
              );
              return (
                <TableRow key={trade._id} className="">
                  <TableCell className="border border-gray-700 p-3">
                    {trade.email}
                  </TableCell>
                  <TableCell className="border border-gray-700 p-3">
                    {trade.region}
                  </TableCell>
                  <TableCell className="border border-gray-700 p-3">
                    {formattedPrice} 원
                  </TableCell>
                  <TableCell className="border border-gray-700 p-3">
                    {formattedQuantity}
                  </TableCell>
                  <TableCell className="border border-gray-700 p-3">
                    {formattedDate}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="mt-5 flex justify-center gap-2">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`border px-3 py-1 ${
            currentPage === 1
              ? "text-gray-500"
              : "text-subColor dark:text-white"
          }`}
        >
          이전
        </Button>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`border px-3 py-1 ${
              currentPage === i + 1
                ? "bg-subColor text-white dark:bg-white dark:text-subColor"
                : "text-subColor dark:text-white"
            }`}
          >
            {i + 1}
          </Button>
        ))}
        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className={`border px-3 py-1 ${
            currentPage === totalPages
              ? "text-gray-500"
              : "text-subColor dark:text-white"
          }`}
        >
          다음
        </Button>
      </div>
    </div>
  );
}

export default TradeTable;
