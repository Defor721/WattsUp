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
import Loading from "@/app/loading";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchUserInfo } from "@/services/adminService";

const LIMIT = 1;

function UserTable() {
  const queryClient = useQueryClient();

  const [currentPage, setCurrentPage] = useState(1);

  // 필터링
  const [searchTerm, setSearchTerm] = useState(""); // 검색 입력 상태

  const { data, isLoading } = useQuery({
    queryKey: ["users", currentPage],
    queryFn: () => fetchUserInfo(currentPage),
  });

  const users = data?.users ?? [];
  const totalPages = 6;

  useEffect(() => {
    if (totalPages && currentPage < totalPages) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery({
        queryKey: ["users", nextPage],
        queryFn: () => fetchUserInfo(nextPage),
      });
    }
  }, [currentPage, queryClient]);

  console.log("data: ", data);

  // 검색어에 따른 필터링
  const filteredUsers = users.sort((a, b) => {
    const dateA =
      typeof a.createdAt === "string" ? Date.parse(a.createdAt) : a.createdAt;
    const dateB =
      typeof b.createdAt === "string" ? Date.parse(b.createdAt) : b.createdAt;
    return dateB - dateA;
  });
  // .filter((user) => {
  //   const searchValue = searchTerm.toLowerCase();
  //   return (
  //     user.email.toLowerCase().includes(searchValue) || // 이메일 필터
  //     user.name.toLowerCase().includes(searchValue) || // 이름 필터
  //     user.companyName.toLowerCase().includes(searchValue) || // 상호명 필터
  //     user.businessNumber.toString().includes(searchValue) || // 사업자등록번호 필터
  //     user.corporateNumber.toString().includes(searchValue) || // 법인등록번호 필터
  //     user.createdAt.toString().includes(searchValue) // 가입날짜 필터
  //   );
  // });

  // 페이지네이션 버튼 (최대 5개)
  const maxPageButtons = 5;
  const pageButtons = useMemo(() => {
    const currentGroup = Math.ceil(currentPage / maxPageButtons);
    const startPage = (currentGroup - 1) * maxPageButtons + 1;
    const endPage = Math.min(startPage + maxPageButtons - 1, totalPages);

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i,
    );
  }, [currentPage, totalPages]);

  if (isLoading) return <Loading />;

  return (
    <div className="mt-3">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="my-3 scroll-m-20 text-xl font-semibold tracking-tight text-[#070f26] dark:text-white">
          유저 테이블
        </h4>
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
            {filteredUsers.map((user) => {
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
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
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
