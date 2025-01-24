"use client";

import React, { useEffect, useMemo, useState } from "react";

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

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchBidData } from "@/services/adminService";
import Selector from "@/components/common/Selector";
import { formatNumberWithoutDecimal } from "@/hooks/useNumberFormatter";

const filterItems = [
  { value: "all", label: "전체" },
  { value: "email", label: "아이디" },
  { value: "region", label: "지역" },
  { value: "count", label: "전력량" },
];

const orderItems = [
  { value: "desc", label: "내림차순" },
  { value: "asc", label: "오름차순" },
];

const LIMIT = 5;

function TradeTable() {
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);

  const [selected, setSelected] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc"); // 기본값 최신순

  // 필터링
  const [searchTerm, setSearchTerm] = useState("");

  // 거래 내역 가져오기
  const { data: bidData } = useQuery({
    queryKey: ["bidData", currentPage, selected, searchTerm],
    queryFn: () => fetchBidData(LIMIT, currentPage - 1, selected, searchTerm),
  });

  const totalCount = bidData?.stats.totalCount ?? 0;
  const totalPages = Math.ceil(totalCount / LIMIT);
  // const totalPages = 5;

  const bidLists = bidData?.bidSet ?? [];

  // useEffect(() => {
  //   if (totalPages && currentPage < totalPages) {
  //     const nextPage = currentPage + 1;
  //     queryClient.prefetchQuery({
  //       queryKey: ["users", nextPage],
  //       queryFn: () => fetchBidLists(),
  //     });
  //   }
  // }, [currentPage, queryClient]);

  // 페이지네이션 버튼 (최대 5개)
  const maxPageButtons = 5;
  const pageButtons = useMemo(() => {
    const currentGroup = Math.ceil(currentPage / maxPageButtons);
    const startPage = (currentGroup - 1) * maxPageButtons + 1;
    const endPage = Math.min(startPage + maxPageButtons - 1, totalPages);

    return Array.from(
      { length: Math.ceil(endPage - startPage + 1) },
      (_, i) => startPage + i,
    );
  }, [currentPage, totalPages]);

  return (
    <div className="m-w-[700px]">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-[#070f26] dark:text-white">
            모든 거래 내역
          </h4>
          <div className="flex items-center gap-4">
            <Selector
              value={selected}
              onChange={setSelected}
              placeholder="검색 필터링"
              items={filterItems}
            />
            <Selector
              width="w-[150px]"
              value={sortOrder}
              onChange={setSortOrder}
              placeholder="날짜 필터링"
              items={orderItems}
            />
          </div>
        </div>
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
                전력량
              </TableHead>
              <TableHead className="border border-gray-700 px-3 py-2">
                날짜
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bidLists.map((trade) => {
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
                    {formattedQuantity} kWh
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
        {pageButtons.map((page) => (
          <Button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`border px-3 py-1 ${currentPage === page ? "bg-subColor font-bold text-white dark:bg-white dark:text-subColor" : "text-subColor dark:text-white"}`}
          >
            {page}
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
