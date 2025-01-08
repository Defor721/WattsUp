"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
import apiClient from "@/lib/axios";
import Loading from "@/app/loading";

interface Users {
  businessNumber: number;
  companyName: string;
  corporateNumber: number;
  createdAt: string;
  email: string;
  name: string;
  provider: null | "google";
  signupType: string;
}

function UserTable() {
  const router = useRouter();
  const [users, setUsers] = useState<Users[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 필터링
  const [searchTerm, setSearchTerm] = useState(""); // 검색 입력 상태

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const itemsPerPage = 15; // 한 페이지에 보여줄 항목 수

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(
          `http://localhost:3000//api/admin/userinfo`,
        );
        const data = response.data.users;
        setUsers(data);
      } catch (error) {
        console.error("Error: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleUserClick = (email: string) => {
    router.push(`http://localhost:3000/admin/user-management/${email}`);
  };

  // 검색어에 따른 필터링
  const filteredUsers = users
    .sort((a, b) => {
      const dateA =
        typeof a.createdAt === "string" ? Date.parse(a.createdAt) : a.createdAt;
      const dateB =
        typeof b.createdAt === "string" ? Date.parse(b.createdAt) : b.createdAt;
      return dateB - dateA;
    })
    .filter((user) => {
      const searchValue = searchTerm.toLowerCase();
      return (
        user.email.toLowerCase().includes(searchValue) || // 이메일 필터
        user.name.toLowerCase().includes(searchValue) || // 이름 필터
        user.companyName.toLowerCase().includes(searchValue) || // 상호명 필터
        user.businessNumber.toString().includes(searchValue) || // 사업자등록번호 필터
        user.corporateNumber.toString().includes(searchValue) || // 법인등록번호 필터
        user.createdAt.toString().includes(searchValue) // 가입날짜 필터
      );
    });

  // 페이지네이션에 따라 표시할 데이터 계산
  const totalItems = filteredUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  if (isLoading) return <Loading />;

  return (
    <div className="mt-3">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="my-3 scroll-m-20 text-xl font-semibold tracking-tight text-[#070f26] dark:text-white">
          사용자 관리 테이블
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
            {currentUsers.map((user) => {
              const business = String(user.businessNumber);
              const formattedBusiness = `${business.slice(0, 3)}-${business.slice(3, 5)}-${business.slice(5)}`;

              const corporate = String(user.corporateNumber);
              const formattedCorporate = `${corporate.slice(0, 6)}-${corporate.slice(6)}`;

              const date = new Date(user.createdAt);
              const formattedDate = date.toISOString().split("T")[0];
              return (
                <TableRow
                  key={user.corporateNumber}
                  className="odd:bg-[#FFF] even:bg-[#F8F9FA] hover:cursor-pointer dark:odd:bg-[rgb(10,20,40)] dark:even:bg-[rgb(15,25,50)]"
                  onClick={() => handleUserClick(user.email)}
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
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`border px-3 py-1 ${currentPage === i + 1 ? "bg-subColor text-white dark:bg-white dark:text-subColor" : "text-subColor dark:text-white"}`}
          >
            {i + 1}
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
