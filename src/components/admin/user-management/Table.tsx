import React from "react";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/shadcn";

const users = [
  {
    id: "test1@naver.com",
    businessName: "윤경민",
    tradeName: "(주)팀장",
    businessRegistrationNumber: "0123456789",
    corporateRegistrationNumber: "1234567891234",
    joinDate: "20241201",
    lastLoginTime: "20241228",
  },
  {
    id: "test2@naver.com",
    businessName: "김하영",
    tradeName: "(주)팀대표자",
    businessRegistrationNumber: "0123456789",
    corporateRegistrationNumber: "1234567891234",
    joinDate: "20241201",
    lastLoginTime: "20241228",
  },
  {
    id: "test3@naver.com",
    businessName: "김성우",
    tradeName: "(주)팀원",
    businessRegistrationNumber: "0123456789",
    corporateRegistrationNumber: "1234567891234",
    joinDate: "20241201",
    lastLoginTime: "20241228",
  },
  {
    id: "test4@naver.com",
    businessName: "노지훈",
    tradeName: "(주)팀원",
    businessRegistrationNumber: "0123456789",
    corporateRegistrationNumber: "1234567891234",
    joinDate: "20241201",
    lastLoginTime: "20241228",
  },
  {
    id: "test5@naver.com",
    businessName: "윤재성",
    tradeName: "(주)팀원",
    businessRegistrationNumber: "0123456789",
    corporateRegistrationNumber: "1234567891234",
    joinDate: "20241201",
    lastLoginTime: "20241228",
  },
];

function UserManageMentTable() {
  return (
    <div className="mt-3">
      <h4 className="my-3 scroll-m-20 text-center text-xl font-semibold tracking-tight text-[#070f26] dark:text-white">
        사용자 관리 테이블
      </h4>
      <div className="overflow-x-auto">
        <Table className="min-w-full border border-gray-700 text-center text-[#070f26] dark:text-white">
          {/* 테이블 헤더 */}
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
              <TableHead className="border border-gray-700 px-3 py-2">
                마지막 로그인 시간
              </TableHead>
            </TableRow>
          </TableHeader>
          {/* 테이블 본문 */}
          <TableBody>
            {users.map((user) => (
              <TableRow
                key={user.id}
                className="odd:bg-[#FFF] even:bg-[#F8F9FA] dark:odd:bg-[rgb(10,20,40)] dark:even:bg-[rgb(15,25,50)]"
              >
                <TableCell className="border border-gray-700 p-3">
                  {user.id}
                </TableCell>
                <TableCell className="border border-gray-700 p-3">
                  {user.businessName}
                </TableCell>
                <TableCell className="border border-gray-700 p-3">
                  {user.tradeName}
                </TableCell>
                <TableCell className="border border-gray-700 p-3">
                  {user.businessRegistrationNumber}
                </TableCell>
                <TableCell className="border border-gray-700 p-3">
                  {user.corporateRegistrationNumber}
                </TableCell>
                <TableCell className="border border-gray-700 p-3">
                  {user.joinDate}
                </TableCell>
                <TableCell className="border border-gray-700 p-3">
                  {user.lastLoginTime}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default UserManageMentTable;
