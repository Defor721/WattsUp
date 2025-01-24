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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn";
import Loading from "@/app/loading";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUserInfo } from "@/services/adminService";
import Selector from "@/components/common/Selector";

const LIMIT = 4;

const filterItems = [
  { value: "all", label: "전체" },
  { value: "email", label: "아이디" },
  { value: "name", label: "사업자명" },
  { value: "companyName", label: "상호명" },
  { value: "businessNumber", label: "사업자등록번호" },
  { value: "corporateNumber", label: "법인등록번호" },
];

const orderItems = [
  { value: "desc", label: "내림차순" },
  { value: "asc", label: "오름차순" },
];
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function UserTable() {
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);

  const [selected, setSelected] = useState("all");
  const [sortOrder, setSortOrder] = useState("desc"); // 기본값 최신순

  // 필터링
  const [searchTerm, setSearchTerm] = useState(""); // 검색 입력 상태
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data, isLoading } = useQuery({
    queryKey: ["users", currentPage, selected, debouncedSearchTerm],
    queryFn: () =>
      fetchUserInfo(
        LIMIT,
        currentPage - 1,
        selected,
        encodeURIComponent(debouncedSearchTerm),
      ),
    staleTime: 5000,
  });

  const users = data?.userSet ?? [];
  const totalPages = Math.ceil((data?.totalCount ?? 0) / LIMIT);

  // useEffect(() => {
  //   if (totalPages && currentPage < totalPages) {
  //     const nextPage = currentPage + 1;
  //     queryClient.prefetchQuery({
  //       queryKey: ["users", nextPage],
  //       queryFn: () => fetchUserInfo(LIMIT, nextPage - 1),
  //     });
  //   }
  // }, [currentPage, queryClient, totalPages]);

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

  if (isLoading && !data) return <Loading />;

  return (
    <div className="mt-3">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h4 className="my-3 scroll-m-20 text-xl font-semibold tracking-tight text-[#070f26] dark:text-white">
            유저 테이블
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
            setCurrentPage(1);
          }}
        />
      </div>
      <div className="overflow-x-auto">
        <Table className="min-w-full border border-gray-700 text-center text-[#070f26] dark:text-white">
          <TableHeader className="bg-tableHeader-light dark:bg-tableHeader-dark">
            <TableRow className="[&>*]:text-center">
              <TableHead className="border border-gray-700 px-3 py-2">
                사용자 아이디
              </TableHead>
              <TableHead className="border border-gray-700 px-3 py-2">
                사업자명
              </TableHead>
              <TableHead className="border border-gray-700 px-3 py-2">
                상호명
              </TableHead>
              <TableHead className="border border-gray-700 px-3 py-2">
                사업자등록번호
              </TableHead>
              <TableHead className="border border-gray-700 px-3 py-2">
                법인등록번호
              </TableHead>
              <TableHead className="border border-gray-700 px-3 py-2">
                가입날짜
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const business = String(user.businessNumber);
              const formattedBusiness = `${business.slice(0, 3)}-${business.slice(3, 5)}-${business.slice(5)}`;

              const corporate = String(user.corporateNumber);
              const formattedCorporate = `${corporate.slice(0, 6)}-${corporate.slice(6)}`;

              const date = new Date(user.createdAt);
              const formattedDate = date.toISOString().split("T")[0];
              return (
                <TableRow
                  key={user.corporateNumber}
                  className=""
                  // onClick={() => handleUserClick(user.businessNumber)}
                >
                  <TableCell className="border border-gray-700 p-3">
                    {user.email}
                  </TableCell>
                  <TableCell className="border border-gray-700 p-3">
                    {user.name}
                  </TableCell>
                  <TableCell className="border border-gray-700 p-3">
                    {user.companyName}
                  </TableCell>
                  <TableCell className="border border-gray-700 p-3">
                    {formattedBusiness}
                  </TableCell>
                  <TableCell className="border border-gray-700 p-3">
                    {formattedCorporate}
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
          onClick={() => setCurrentPage((prev) => prev - 1)}
          disabled={currentPage === 1}
          className={`border px-3 py-1 ${currentPage === 1 ? "text-gray-500" : "text-subColor dark:text-white"}`}
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
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalPages}
          className={`border px-3 py-1 ${currentPage === totalPages ? "text-gray-500" : "text-subColor dark:text-white"}`}
        >
          다음
        </Button>
      </div>
    </div>
  );
}

export default UserTable;
