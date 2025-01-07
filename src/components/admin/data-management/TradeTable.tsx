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
  Pagination,
  Button,
} from "@/components/shadcn";
import apiClient from "@/lib/axios";
import Loading from "@/app/loading";
import { formatNumberWithoutDecimal } from "@/hooks/useNumberFormatter";

interface TradeData {
  _id: string;
  businessNumber: number;
  region: string;
  price: number;
  quantity: number;
  now: string;
}

function TradeTable() {
  const [tradeData, setTradeData] = useState<TradeData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 검색어 상태
  const [searchTerm, setSearchTerm] = useState("");

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchTradeData = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(
          "http://localhost:3000/api/admin/userinfo/bidlist",
        );
        const data = response.data.bids;
        setTradeData(data);
      } catch (error) {
        console.error("Error fetching trade data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTradeData();
  }, []);

  // 검색어에 따른 필터링
  const filteredTradeData = tradeData.filter((trade) => {
    const searchValue = searchTerm.toLowerCase();
    return (
      trade._id.toLowerCase().includes(searchValue) || // ID 필터
      String(trade.businessNumber).includes(searchValue) || // 사업자 번호 필터
      trade.region.toLowerCase().includes(searchValue) || // 지역 필터
      String(trade.price).includes(searchValue) || // 가격 필터
      String(trade.quantity).includes(searchValue) || // 수량 필터
      trade.now.toLowerCase().includes(searchValue) // 날짜 필터
    );
  });

  // 페이지네이션 데이터 계산
  const totalItems = filteredTradeData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTrades = filteredTradeData.slice(startIndex, endIndex);

  if (isLoading) return <Loading />;

  return (
    <div className="mt-3">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight text-[#070f26] dark:text-white">
          거래 내역 테이블
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
          <TableHeader>
            <TableRow className="bg-[#F8F9FA] dark:bg-[rgb(15,25,50)] [&>*]:text-center">
              <TableHead className="border border-gray-700 px-3 py-2">
                ID
              </TableHead>
              <TableHead className="border border-gray-700 px-3 py-2">
                사업자 번호
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
            {currentTrades.map((trade) => {
              const formattedDate = new Date(trade.now)
                .toISOString()
                .split("T")[0];
              const business = String(trade.businessNumber);
              const formattedBusiness = `${business.slice(0, 3)}-${business.slice(3, 5)}-${business.slice(5)}`;
              const formattedPrice = formatNumberWithoutDecimal(trade.price);
              const formattedQuantity = formatNumberWithoutDecimal(
                trade.quantity,
              );
              return (
                <TableRow
                  key={trade._id}
                  className="odd:bg-[#FFF] even:bg-[#F8F9FA] hover:cursor-pointer dark:odd:bg-[rgb(10,20,40)] dark:even:bg-[rgb(15,25,50)]"
                >
                  <TableCell className="border border-gray-700 p-3">
                    {trade._id}
                  </TableCell>
                  <TableCell className="border border-gray-700 p-3">
                    {formattedBusiness}
                  </TableCell>
                  <TableCell className="border border-gray-700 p-3">
                    {trade.region}
                  </TableCell>
                  <TableCell className="border border-gray-700 p-3">
                    {formattedPrice}
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
